// ========== CONFIGURAÇÕES E CONSTANTES ==========
const API_BASE_URL = window.location.origin + '/api';

const STATUS_MAP = {
    'voz-dados': 'Voz e Dados',
    'apenas-dados': 'Apenas Dados', 
    'roaming': 'Roaming'
};

const STATUS_CLASSES = {
    'voz-dados': 'status-voz',
    'apenas-dados': 'status-dados',
    'roaming': 'status-roaming'
};

// ========== ESTADO DA APLICAÇÃO ==========
let appState = {
    currentFilter: 'all',
    currentSearch: '',
    currentEditingDevice: null,
    devices: [] // Agora vazio - será carregado da API
};

// ========== FUNÇÕES UTILITÁRIAS ==========
const utils = {
    getStatusText: (status) => STATUS_MAP[status] || status,
    
    getStatusClass: (status) => STATUS_CLASSES[status] || '',
    
    showNotification: (message, type = 'info') => {
        // Remove notificação anterior se existir
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animação de entrada
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Funções para API
    async apiRequest(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Erro na requisição');
            }
            
            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }
};

// ========== SISTEMA PRINCIPAL ==========
const mainSystem = {
    async init() {
        await this.bindEvents();
        await this.loadAllDevices();
    },
    
    async bindEvents() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        const clearBtn = document.querySelector('.clear-btn');
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        // Busca
        searchBtn.addEventListener('click', () => this.performSearch());
        clearBtn.addEventListener('click', () => this.clearSearch());
        searchInput.addEventListener('input', utils.debounce(() => this.performSearch(), 300));
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        
        // Filtros
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                appState.currentFilter = btn.getAttribute('data-filter');
                this.performSearch();
            });
        });
    },

    async loadAllDevices() {
        try {
            const data = await utils.apiRequest('/devices');
            appState.devices = data.devices;
            this.displayDevices(appState.devices);
        } catch (error) {
            utils.showNotification('Erro ao carregar dispositivos', 'error');
        }
    },
    
    async performSearch() {
        const searchInput = document.querySelector('.search-input');
        appState.currentSearch = searchInput.value.toLowerCase().trim();
        
        try {
            let devices;
            
            if (appState.currentSearch) {
                const data = await utils.apiRequest(`/devices?search=${encodeURIComponent(appState.currentSearch)}`);
                devices = data.devices;
            } else {
                devices = appState.devices;
            }
            
            if (appState.currentFilter !== 'all') {
                if (appState.currentFilter === '5g') {
                    devices = devices.filter(device => device.has5g);
                } else {
                    devices = devices.filter(device => device.status === appState.currentFilter);
                }
            }
            
            this.displayDevices(devices);
        } catch (error) {
            utils.showNotification('Erro na busca', 'error');
        }
    },
    
    clearSearch() {
        const searchInput = document.querySelector('.search-input');
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        searchInput.value = '';
        appState.currentSearch = '';
        filterBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        appState.currentFilter = 'all';
        this.displayDevices(appState.devices);
    },
    
    displayDevices(devicesToShow) {
        const resultsGrid = document.getElementById('results-grid');
        const resultCount = document.getElementById('result-count');
        
        resultsGrid.innerHTML = '';
        resultCount.textContent = devicesToShow.length;
        
        if (devicesToShow.length === 0) {
            resultsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Nenhum aparelho encontrado com os critérios de busca.</p>
                    <p>Tente usar termos diferentes ou verifique os filtros aplicados.</p>
                </div>
            `;
            return;
        }
        
        devicesToShow.forEach(device => {
            const statusText = utils.getStatusText(device.status);
            const statusClass = utils.getStatusClass(device.status);
            
            const deviceCard = document.createElement('div');
            deviceCard.className = `device-card ${device.status}`;
            deviceCard.innerHTML = `
                <div class="device-name">${device.model}</div>
                <div class="device-brand">${device.brand}</div>
                <div class="device-status ${statusClass}">${statusText}</div>
                ${device.has5g ? '<div class="device-5g">5G</div>' : ''}
            `;
            resultsGrid.appendChild(deviceCard);
        });
    }
};

// ========== SISTEMA ADMINISTRATIVO ==========
const adminSystem = {
    init() {
        this.bindEvents();
        this.createOverlay();
    },
    
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.addEventListener('click', () => this.closeAllModals());
        document.body.appendChild(overlay);
    },
    
    bindEvents() {
        const adminFloatBtn = document.getElementById('adminFloatBtn');
        const adminLoginForm = document.getElementById('adminLoginForm');
        const logoutBtn = document.getElementById('logoutBtn');
        const closeModal = document.querySelector('.close');
        
        // Login
        adminFloatBtn.addEventListener('click', () => this.showLoginModal());
        closeModal.addEventListener('click', () => this.closeLoginModal());
        adminLoginForm.addEventListener('submit', (e) => this.handleLogin(e));
        logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Ações do admin
        document.getElementById('addDeviceBtn').addEventListener('click', () => this.showAddSection());
        document.getElementById('refreshListBtn').addEventListener('click', () => this.loadDevicesForAdmin());
        
        // Seções de edição/adição
        document.getElementById('closeEditBtn').addEventListener('click', () => this.hideEditSection());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.hideEditSection());
        document.getElementById('closeAddBtn').addEventListener('click', () => this.hideAddSection());
        document.getElementById('cancelAddBtn').addEventListener('click', () => this.hideAddSection());
        
        // Formulários
        document.getElementById('editDeviceForm').addEventListener('submit', (e) => this.saveEditDevice(e));
        document.getElementById('addDeviceForm').addEventListener('submit', (e) => this.addNewDevice(e));
        
        // Busca admin
        const adminSearchInput = document.getElementById('adminSearchDirect');
        if (adminSearchInput) {
            adminSearchInput.addEventListener('input', utils.debounce(() => this.performAdminSearch(), 300));
        }
        
        // Tecla ESC para fechar modais
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllModals();
        });
    },
    
    showLoginModal() {
        document.getElementById('adminModal').style.display = 'block';
    },
    
    closeLoginModal() {
        document.getElementById('adminModal').style.display = 'none';
        document.getElementById('adminLoginForm').reset();
    },
    
    async handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const data = await utils.apiRequest('/admins/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            
            if (data.success) {
                this.closeLoginModal();
                this.showAdminPanel();
                utils.showNotification('Login realizado com sucesso!', 'success');
            }
        } catch (error) {
            utils.showNotification('Credenciais incorretas!', 'error');
        }
    },
    
    showAdminPanel() {
        document.getElementById('adminPanel').classList.add('active');
        document.querySelector('.overlay').classList.add('active');
        this.loadDevicesForAdmin();
    },
    
    closeAdminPanel() {
        document.getElementById('adminPanel').classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
        this.hideEditSection();
        this.hideAddSection();
    },
    
    handleLogout() {
        this.closeAdminPanel();
        utils.showNotification('Logout realizado!', 'success');
    },
    
    closeAllModals() {
        this.closeLoginModal();
        this.closeAdminPanel();
    },
    
    // Gerenciamento de dispositivos
    async loadDevicesForAdmin() {
        try {
            const data = await utils.apiRequest('/devices');
            this.displayAdminDevices(data.devices);
        } catch (error) {
            utils.showNotification('Erro ao carregar dispositivos', 'error');
        }
    },
    
    displayAdminDevices(devices) {
        const adminDevicesList = document.getElementById('adminDevicesList');
        const resultsCount = document.getElementById('adminResultsCount');
        
        adminDevicesList.innerHTML = '';
        
        if (resultsCount) {
            resultsCount.textContent = devices.length;
        }
        
        if (devices.length === 0) {
            adminDevicesList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Nenhum aparelho encontrado.</p>
                </div>
            `;
            return;
        }
        
        devices.forEach(device => {
            const deviceItem = document.createElement('div');
            deviceItem.className = 'device-item';
            deviceItem.innerHTML = `
                <div class="device-info">
                    <h5>${device.model}</h5>
                    <div class="device-meta">
                        <strong>Marca:</strong> ${device.brand} | 
                        <strong>Status:</strong> ${utils.getStatusText(device.status)} | 
                        <strong>5G:</strong> ${device.has5g ? 'Sim' : 'Não'}
                    </div>
                </div>
                <div class="device-actions">
                    <button class="edit-btn" data-id="${device.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-btn" data-id="${device.id}">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            `;
            
            // Adicionar eventos aos botões
            deviceItem.querySelector('.edit-btn').addEventListener('click', () => {
                this.openEditSection(device);
            });
            
            deviceItem.querySelector('.delete-btn').addEventListener('click', () => {
                this.deleteDevice(device.id, device.model);
            });
            
            adminDevicesList.appendChild(deviceItem);
        });
    },
    
    async performAdminSearch() {
        const searchTerm = document.getElementById('adminSearchDirect').value.trim();
        
        try {
            let data;
            if (searchTerm) {
                data = await utils.apiRequest(`/devices?search=${encodeURIComponent(searchTerm)}`);
            } else {
                data = await utils.apiRequest('/devices');
            }
            this.displayAdminDevices(data.devices);
        } catch (error) {
            utils.showNotification('Erro na busca', 'error');
        }
    },
    
    // Seções de edição/adição
    showEditSection() {
        document.getElementById('editSection').style.display = 'block';
        document.getElementById('editSection').classList.add('active');
        this.scrollToSection('editSection');
    },
    
    hideEditSection() {
        document.getElementById('editSection').style.display = 'none';
        document.getElementById('editSection').classList.remove('active');
        document.getElementById('editDeviceForm').reset();
        appState.currentEditingDevice = null;
    },
    
    showAddSection() {
        document.getElementById('addSection').style.display = 'block';
        document.getElementById('addSection').classList.add('active');
        this.scrollToSection('addSection');
    },
    
    hideAddSection() {
        document.getElementById('addSection').style.display = 'none';
        document.getElementById('addSection').classList.remove('active');
        document.getElementById('addDeviceForm').reset();
    },
    
    scrollToSection(sectionId) {
        document.getElementById(sectionId).scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    },
    
    openEditSection(device) {
        appState.currentEditingDevice = device;
        
        document.getElementById('editBrand').value = device.brand;
        document.getElementById('editModel').value = device.model;
        document.getElementById('editStatus').value = device.status;
        document.getElementById('edit5g').value = device.has5g.toString();
        
        this.showEditSection();
    },
    
    async saveEditDevice(e) {
        e.preventDefault();
        
        const brand = document.getElementById('editBrand').value.trim();
        const model = document.getElementById('editModel').value.trim();
        const status = document.getElementById('editStatus').value;
        const has5g = document.getElementById('edit5g').value === 'true';
        
        if (!brand || !model || !status) {
            utils.showNotification('Por favor, preencha todos os campos!', 'error');
            return;
        }
        
        try {
            await utils.apiRequest(`/devices/${appState.currentEditingDevice.id}`, {
                method: 'PUT',
                body: JSON.stringify({ brand, model, status, has5g })
            });
            
            utils.showNotification('Aparelho atualizado com sucesso!', 'success');
            this.hideEditSection();
            await this.loadDevicesForAdmin();
            await mainSystem.loadAllDevices(); // Atualiza a busca principal
        } catch (error) {
            utils.showNotification('Erro ao atualizar aparelho', 'error');
        }
    },
    
    async addNewDevice(e) {
        e.preventDefault();
        
        const brand = document.getElementById('addBrand').value.trim();
        const model = document.getElementById('addModel').value.trim();
        const status = document.getElementById('addStatus').value;
        const has5g = document.getElementById('add5g').value === 'true';
        
        if (!brand || !model || !status) {
            utils.showNotification('Por favor, preencha todos os campos!', 'error');
            return;
        }
        
        try {
            await utils.apiRequest('/devices', {
                method: 'POST',
                body: JSON.stringify({ brand, model, status, has5g })
            });
            
            utils.showNotification('Aparelho adicionado com sucesso!', 'success');
            this.hideAddSection();
            await this.loadDevicesForAdmin();
            await mainSystem.loadAllDevices(); // Atualiza a busca principal
        } catch (error) {
            utils.showNotification('Erro ao adicionar aparelho', 'error');
        }
    },
    
    async deleteDevice(deviceId, deviceName) {
        if (!confirm(`Tem certeza que deseja excluir o aparelho ${deviceName}?`)) {
            return;
        }
        
        try {
            await utils.apiRequest(`/devices/${deviceId}`, {
                method: 'DELETE'
            });
            
            utils.showNotification('Aparelho excluído com sucesso!', 'success');
            await this.loadDevicesForAdmin();
            await mainSystem.loadAllDevices(); // Atualiza a busca principal
        } catch (error) {
            utils.showNotification('Erro ao excluir aparelho', 'error');
        }
    }
};

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    mainSystem.init();
    adminSystem.init();
});