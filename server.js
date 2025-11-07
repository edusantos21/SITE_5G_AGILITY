const express = require('express');
const cors = require('cors');
const Database = require('./database');

const app = express();
const db = new Database();

// Configurações
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (seu site HTML)
app.use(express.static('.'));

// ========== ROTAS PARA ADMINS ==========
app.post('/api/admins/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await db.verifyAdmin(username, password);
        
        if (admin) {
            res.json({ success: true, admin });
        } else {
            res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});

app.post('/api/admins', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await db.createAdmin(username, password);
        res.json({ success: true, admin });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao criar admin' });
    }
});

app.get('/api/admins', async (req, res) => {
    try {
        const admins = await db.getAdmins();
        res.json({ success: true, admins });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar admins' });
    }
});

app.delete('/api/admins/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.deleteAdmin(id);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao deletar admin' });
    }
});

// ========== ROTAS PARA DISPOSITIVOS ==========
app.get('/api/devices', async (req, res) => {
    try {
        const { search } = req.query;
        let devices;
        
        if (search) {
            devices = await db.searchDevices(search);
        } else {
            devices = await db.getDevices();
        }
        
        res.json({ success: true, devices });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar dispositivos' });
    }
});

app.post('/api/devices', async (req, res) => {
    try {
        const { brand, model, status, has5g } = req.body;
        const device = await db.createDevice(brand, model, status, has5g);
        res.json({ success: true, device });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao criar dispositivo' });
    }
});

app.put('/api/devices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { brand, model, status, has5g } = req.body;
        const device = await db.updateDevice(id, brand, model, status, has5g);
        res.json({ success: true, device });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao atualizar dispositivo' });
    }
});

app.delete('/api/devices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.deleteDevice(id);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao deletar dispositivo' });
    }
});

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
});