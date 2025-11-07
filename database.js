const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

class Database {
    constructor() {
        // ⚠️ CORREÇÃO: Usar SQLite em memória no Vercel, arquivo local em desenvolvimento
        const isVercel = process.env.VERCEL === '1';
        const dbPath = isVercel ? ':memory:' : './devices.db';

        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ Erro ao conectar com o banco:', err);
            } else {
                console.log(`✅ Conectado ao banco SQLite: ${dbPath}`);
                this.initDatabase();
            }
        });
    }

    initDatabase() {
        // CORREÇÃO: Remover callback aninhado e usar async/await
        this.createTables()
            .then(() => {
                console.log('✅ Todas as tabelas criadas/verificadas');
                return this.createDefaultAdmin();
            })
            .then(() => {
                console.log('✅ Admins padrão criados');
                return this.createSampleDevices();
            })
            .then(() => {
                console.log('✅ Dispositivos de exemplo criados');
            })
            .catch(err => {
                console.error('❌ Erro na inicialização do banco:', err);
            });
    }

    createTables() {
        return new Promise((resolve, reject) => {
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
                        reject(err);
                        return;
                    }
                    console.log('✅ Tabela admins criada/verificada');
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
                        reject(err);
                        return;
                    }
                    console.log('✅ Tabela devices criada/verificada');
                    resolve();
                });
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

                await new Promise((resolve, reject) => {
                    this.db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)`,
                        [admin.username, hashedPassword], function (err) {
                            if (err) {
                                console.error(`❌ Erro ao criar admin ${admin.username}:`, err);
                                reject(err);
                            } else {
                                if (this.changes > 0) {
                                    console.log(`✅ Admin criado: ${admin.username} / ${admin.password}`);
                                } else {
                                    console.log(`ℹ️ Admin já existe: ${admin.username}`);
                                }
                                resolve();
                            }
                        });
                });
            }
        } catch (error) {
            console.error('❌ Erro ao criar admins:', error);
        }
    }

    createSampleDevices() {
        return new Promise((resolve, reject) => {
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

            let completed = 0;
            let errors = 0;

            if (sampleDevices.length === 0) {
                resolve();
                return;
            }

            sampleDevices.forEach(device => {
                this.db.run(`INSERT OR IGNORE INTO devices (brand, model, status, has_5g) VALUES (?, ?, ?, ?)`,
                    [device.brand, device.model, device.status, device.has5g], function (err) {
                        if (err) {
                            console.error(`❌ Erro ao inserir ${device.brand} ${device.model}:`, err);
                            errors++;
                        }

                        completed++;
                        if (completed === sampleDevices.length) {
                            if (errors === 0) {
                                console.log('✅ Todos os dispositivos de exemplo processados');
                            } else {
                                console.log(`⚠️ ${errors} erros ao inserir dispositivos`);
                            }
                            resolve();
                        }
                    });
            });
        });
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
                    try {
                        const isValid = await bcrypt.compare(password, row.password);
                        resolve(isValid ? { id: row.id, username: row.username } : null);
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
    }

    async createAdmin(username, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO admins (username, password) VALUES (?, ?)`,
                    [username, hashedPassword], function (err) {
                        if (err) reject(err);
                        else resolve({ id: this.lastID, username });
                    });
            });
        } catch (error) {
            throw error;
        }
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
                if (err) {
                    reject(err);
                } else {
                    const result = rows.map(row => ({
                        id: row.id,
                        brand: row.brand,
                        model: row.model,
                        status: row.status,
                        has5g: Boolean(row.has_5g),
                        created_at: row.created_at
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
                if (err) {
                    reject(err);
                } else {
                    const result = rows.map(row => ({
                        id: row.id,
                        brand: row.brand,
                        model: row.model,
                        status: row.status,
                        has5g: Boolean(row.has_5g),
                        created_at: row.created_at
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
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: this.lastID,
                            brand,
                            model,
                            status,
                            has5g: Boolean(has5g)
                        });
                    }
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
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id,
                        brand,
                        model,
                        status,
                        has5g: Boolean(has5g),
                        changes: this.changes
                    });
                }
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

    // CORREÇÃO: Método para verificar se o banco está pronto
    isReady() {
        return new Promise((resolve) => {
            this.db.get("SELECT 1", (err) => {
                resolve(!err);
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = Database;