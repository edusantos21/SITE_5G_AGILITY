const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

class Database {
    constructor() {
        // Esta linha funciona tanto local quanto no Vercel:
        this.db = new sqlite3.Database('./devices.db', (err) => {
            if (err) {
                console.error('Erro ao conectar com o banco:', err);
            } else {
                console.log('✅ Conectado ao banco SQLite.');
                this.initDatabase();
            }
        });
    }

    initDatabase() {
        // Primeiro cria as tabelas
        this.db.serialize(() => {
            // Tabela de administradores
            this.db.run(`CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
                if (err) {
                    console.error('❌ Erro ao criar tabela admins:', err);
                } else {
                    console.log('✅ Tabela admins criada/verificada');

                    // Só depois de criar a tabela, insere os admins
                    this.createDefaultAdmin();
                }
            });

            // Tabela de dispositivos
            this.db.run(`CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            brand TEXT NOT NULL,
            model TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('voz-dados', 'apenas-dados', 'roaming')),
            has_5g BOOLEAN NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(brand, model)
        )`, (err) => {
                if (err) {
                    console.error('❌ Erro ao criar tabela devices:', err);
                } else {
                    console.log('✅ Tabela devices criada/verificada');

                    // Só depois de criar a tabela, insere os dispositivos
                    setTimeout(() => {
                        this.createSampleDevices();
                    }, 1000);
                }
            });
        });
    }

    async createDefaultAdmin() {
        try {
            const admins = [
                { username: "elly", password: "2060" },
                { username: "edu", password: "1604" }
            ];

            for (const admin of admins) {
                const hashedPassword = await bcrypt.hash(admin.password, 10);

                this.db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)`,
                    [admin.username, hashedPassword], (err) => {
                        if (err) {
                            console.error(`Erro ao criar admin ${admin.username}:`, err);
                        } else {
                            console.log(`✅ Admin criado: ${admin.username} / ${admin.password}`);
                        }
                    });
            }
        } catch (error) {
            console.error('Erro ao criar admins:', error);
        }
    }

    createSampleDevices() {
        const sampleDevices = [
            { brand: 'Apple', model: 'iPhone 15', status: 'voz-dados', has5g: 1 },
            { brand: 'Apple', model: 'iPhone 14', status: 'voz-dados', has5g: 1 },
            { brand: 'Samsung', model: 'Galaxy S23', status: 'voz-dados', has5g: 1 },
            { brand: 'Motorola', model: 'Moto G54', status: 'voz-dados', has5g: 1 },
            { brand: 'Apple', model: 'iPhone 13', status: 'voz-dados', has5g: 1 },
            { brand: 'Apple', model: 'iPhone 12', status: 'voz-dados', has5g: 1 },
            { brand: 'Apple', model: 'iPhone 11', status: 'voz-dados', has5g: 0 },
            { brand: 'Samsung', model: 'Galaxy A54', status: 'voz-dados', has5g: 1 },
            { brand: 'Motorola', model: 'Moto G84', status: 'voz-dados', has5g: 1 }
        ];

        sampleDevices.forEach(device => {
            this.db.run(`INSERT OR IGNORE INTO devices (brand, model, status, has_5g) VALUES (?, ?, ?, ?)`,
                [device.brand, device.model, device.status, device.has5g]);
        });

        console.log('✅ Dispositivos de exemplo criados');
    }

    // ========== MÉTODOS PARA ADMINS ==========
    async verifyAdmin(username, password) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM admins WHERE username = ?`, [username], async (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    const isValid = await bcrypt.compare(password, row.password);
                    resolve(isValid ? { id: row.id, username: row.username } : null);
                }
            });
        });
    }

    async createAdmin(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO admins (username, password) VALUES (?, ?)`,
                [username, hashedPassword], function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, username });
                });
        });
    }

    getAdmins() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT id, username, created_at FROM admins ORDER BY created_at`, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    deleteAdmin(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM admins WHERE id = ?`, [id], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // ========== MÉTODOS PARA DISPOSITIVOS ==========
    getDevices() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM devices ORDER BY brand, model`, (err, rows) => {
                if (err) reject(err);
                else {
                    const result = rows.map(row => ({
                        id: row.id,
                        brand: row.brand,
                        model: row.model,
                        status: row.status,
                        has5g: Boolean(row.has_5g)
                    }));
                    resolve(result);
                }
            });
        });
    }

    searchDevices(searchTerm) {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT * FROM devices 
                WHERE brand LIKE ? OR model LIKE ?
                ORDER BY brand, model
            `, [`%${searchTerm}%`, `%${searchTerm}%`], (err, rows) => {
                if (err) reject(err);
                else {
                    const result = rows.map(row => ({
                        id: row.id,
                        brand: row.brand,
                        model: row.model,
                        status: row.status,
                        has5g: Boolean(row.has_5g)
                    }));
                    resolve(result);
                }
            });
        });
    }

    createDevice(brand, model, status, has5g) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO devices (brand, model, status, has_5g) VALUES (?, ?, ?, ?)`,
                [brand, model, status, has5g ? 1 : 0], function (err) {
                    if (err) reject(err);
                    else resolve({
                        id: this.lastID,
                        brand,
                        model,
                        status,
                        has5g: Boolean(has5g)
                    });
                });
        });
    }

    updateDevice(id, brand, model, status, has5g) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                UPDATE devices 
                SET brand = ?, model = ?, status = ?, has_5g = ?
                WHERE id = ?
            `, [brand, model, status, has5g ? 1 : 0, id], function (err) {
                if (err) reject(err);
                else resolve({
                    id,
                    brand,
                    model,
                    status,
                    has5g: Boolean(has5g),
                    changes: this.changes
                });
            });
        });
    }

    deleteDevice(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM devices WHERE id = ?`, [id], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = Database;