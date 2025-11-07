const Database = require('./database');

// Seus aparelhos do array original
const devicesData = [
    {
        brand: "Apple",
        models: [
            { name: "iPhone 15", status: "voz-dados", has5g: true },
            { name: "iPhone 15 Plus", status: "voz-dados", has5g: true },
            { name: "iPhone 15 Pro", status: "voz-dados", has5g: true },
            { name: "iPhone 15 Pro Max", status: "voz-dados", has5g: true },
            { name: "iPhone 14", status: "voz-dados", has5g: true },
            { name: "iPhone 14 Plus", status: "voz-dados", has5g: true },
            { name: "iPhone 14 Pro", status: "voz-dados", has5g: true },
            { name: "iPhone 14 Pro Max", status: "voz-dados", has5g: true },
            { name: "iPhone 13", status: "voz-dados", has5g: true },
            { name: "iPhone 13 mini", status: "voz-dados", has5g: true },
            { name: "iPhone 13 Pro", status: "voz-dados", has5g: true },
            { name: "iPhone 13 Pro Max", status: "voz-dados", has5g: true },
            { name: "iPhone 12", status: "voz-dados", has5g: true },
            { name: "iPhone 12 mini", status: "voz-dados", has5g: true },
            { name: "iPhone 12 Pro", status: "voz-dados", has5g: true },
            { name: "iPhone 12 Pro Max", status: "voz-dados", has5g: true },
            { name: "iPhone 11", status: "voz-dados", has5g: false },
            { name: "iPhone 11 Pro", status: "voz-dados", has5g: false },
            { name: "iPhone 11 Pro Max", status: "voz-dados", has5g: false },
            { name: "iPhone XR", status: "voz-dados", has5g: false },
            { name: "iPhone XS", status: "voz-dados", has5g: false },
            { name: "iPhone XS Max", status: "voz-dados", has5g: false },
            { name: "iPhone X", status: "voz-dados", has5g: false },
            { name: "iPhone 8", status: "voz-dados", has5g: false },
            { name: "iPhone 8 Plus", status: "voz-dados", has5g: false },
            { name: "iPhone 7", status: "voz-dados", has5g: false },
            { name: "iPhone 7 Plus", status: "voz-dados", has5g: false },
            { name: "iPhone SE (2022)", status: "voz-dados", has5g: true },
            { name: "iPhone SE (2020)", status: "voz-dados", has5g: false },
            { name: "iPhone 6S", status: "apenas-dados", has5g: false },
            { name: "iPhone 6S Plus", status: "apenas-dados", has5g: false }
        ]
    },
    {
        brand: "Samsung",
        models: [
            { name: "Galaxy S23 Ultra", status: "voz-dados", has5g: true },
            { name: "Galaxy S23+", status: "voz-dados", has5g: true },
            { name: "Galaxy S23", status: "voz-dados", has5g: true },
            { name: "Galaxy S22 Ultra", status: "voz-dados", has5g: true },
            { name: "Galaxy S22+", status: "voz-dados", has5g: true },
            { name: "Galaxy S22", status: "voz-dados", has5g: true },
            { name: "Galaxy S21 Ultra", status: "voz-dados", has5g: true },
            { name: "Galaxy S21+", status: "voz-dados", has5g: true },
            { name: "Galaxy S21", status: "voz-dados", has5g: true },
            { name: "Galaxy S21 FE", status: "voz-dados", has5g: true },
            { name: "Galaxy S20 Ultra", status: "voz-dados", has5g: true },
            { name: "Galaxy S20+", status: "voz-dados", has5g: true },
            { name: "Galaxy S20", status: "voz-dados", has5g: true },
            { name: "Galaxy S20 FE", status: "voz-dados", has5g: true },
            { name: "Galaxy Z Fold 5", status: "voz-dados", has5g: true },
            { name: "Galaxy Z Fold 4", status: "voz-dados", has5g: true },
            { name: "Galaxy Z Fold 3", status: "voz-dados", has5g: true },
            { name: "Galaxy Z Flip 5", status: "voz-dados", has5g: true },
            { name: "Galaxy Z Flip 4", status: "voz-dados", has5g: true },
            { name: "Galaxy Z Flip 3", status: "voz-dados", has5g: true },
            { name: "Galaxy A73", status: "voz-dados", has5g: true },
            { name: "Galaxy A54", status: "voz-dados", has5g: true },
            { name: "Galaxy A53", status: "voz-dados", has5g: true },
            { name: "Galaxy A52s", status: "voz-dados", has5g: true },
            { name: "Galaxy A52", status: "voz-dados", has5g: true },
            { name: "Galaxy A35", status: "voz-dados", has5g: true },
            { name: "Galaxy A34", status: "voz-dados", has5g: true },
            { name: "Galaxy A33", status: "voz-dados", has5g: true },
            { name: "Galaxy A32", status: "voz-dados", has5g: false },
            { name: "Galaxy A23", status: "voz-dados", has5g: true },
            { name: "Galaxy A22", status: "voz-dados", has5g: false },
            { name: "Galaxy A15", status: "voz-dados", has5g: false },
            { name: "Galaxy A14", status: "voz-dados", has5g: true },
            { name: "Galaxy A13", status: "voz-dados", has5g: true },
            { name: "Galaxy A12", status: "voz-dados", has5g: false },
            { name: "Galaxy A04s", status: "voz-dados", has5g: false },
            { name: "Galaxy A04", status: "voz-dados", has5g: false },
            { name: "Galaxy A03s", status: "voz-dados", has5g: false },
            { name: "Galaxy A03 Core", status: "voz-dados", has5g: false },
            { name: "Galaxy M54", status: "voz-dados", has5g: true },
            { name: "Galaxy M53", status: "voz-dados", has5g: true },
            { name: "Galaxy M34", status: "voz-dados", has5g: true },
            { name: "Galaxy M33", status: "voz-dados", has5g: true },
            { name: "Galaxy M23", status: "voz-dados", has5g: false },
            { name: "Galaxy M14", status: "voz-dados", has5g: true },
            { name: "Galaxy M13", status: "voz-dados", has5g: false },
            { name: "Galaxy A31", status: "apenas-dados", has5g: false },
            { name: "Galaxy A30s", status: "apenas-dados", has5g: false },
            { name: "Galaxy A21s", status: "apenas-dados", has5g: false },
            { name: "Galaxy A20s", status: "apenas-dados", has5g: false },
            { name: "Galaxy A20", status: "apenas-dados", has5g: false },
            { name: "Galaxy M51", status: "apenas-dados", has5g: false },
            { name: "Galaxy A10s", status: "roaming", has5g: false },
            { name: "Galaxy A10", status: "roaming", has5g: false },
            { name: "Galaxy A01", status: "roaming", has5g: false },
            { name: "Galaxy A02s", status: "roaming", has5g: false },
            { name: "Galaxy J4 Core", status: "roaming", has5g: false },
            { name: "Galaxy J4", status: "roaming", has5g: false }
        ]
    },
    {
        brand: "Motorola",
        models: [
            { name: "Moto G84", status: "voz-dados", has5g: true },
            { name: "Moto G73", status: "voz-dados", has5g: true },
            { name: "Moto G54", status: "voz-dados", has5g: true },
            { name: "Moto G53", status: "voz-dados", has5g: true },
            { name: "Moto G34", status: "voz-dados", has5g: true },
            { name: "Moto G14", status: "voz-dados", has5g: false },
            { name: "Moto G04s", status: "voz-dados", has5g: false },
            { name: "Moto G Power 5G", status: "voz-dados", has5g: true },
            { name: "Moto G Stylus 5G", status: "voz-dados", has5g: true },
            { name: "Moto E13", status: "voz-dados", has5g: false },
            { name: "Moto E22", status: "voz-dados", has5g: false },
            { name: "Moto E20", status: "voz-dados", has5g: false },
            { name: "Edge 40", status: "voz-dados", has5g: true },
            { name: "Edge 30", status: "voz-dados", has5g: true },
            { name: "Edge 30 Fusion", status: "voz-dados", has5g: true },
            { name: "Edge 30 Neo", status: "voz-dados", has5g: true },
            { name: "Edge 30 Pro", status: "voz-dados", has5g: true },
            { name: "Edge 30 Ultra", status: "voz-dados", has5g: true },
            { name: "Edge 20", status: "voz-dados", has5g: true },
            { name: "Edge 20 Pro", status: "voz-dados", has5g: true },
            { name: "Razr 40", status: "voz-dados", has5g: true },
            { name: "Razr 40 Ultra", status: "voz-dados", has5g: true },
            { name: "ThinkPhone", status: "voz-dados", has5g: true },
            { name: "Moto G200", status: "voz-dados", has5g: true },
            { name: "Moto G71", status: "apenas-dados", has5g: false },
            { name: "Moto G60", status: "apenas-dados", has5g: false },
            { name: "Moto G52", status: "apenas-dados", has5g: false },
            { name: "Moto G32", status: "apenas-dados", has5g: false },
            { name: "Moto G24", status: "apenas-dados", has5g: false },
            { name: "Moto G22", status: "apenas-dados", has5g: false },
            { name: "Moto G20", status: "apenas-dados", has5g: false },
            { name: "Moto G10", status: "apenas-dados", has5g: false },
            { name: "Moto E40", status: "apenas-dados", has5g: false },
            { name: "Moto G9 Plus", status: "roaming", has5g: false },
            { name: "Moto G8", status: "roaming", has5g: false },
            { name: "Moto One Macro", status: "roaming", has5g: false }
        ]
    },
    {
        brand: "Xiaomi",
        models: [
            { name: "Poco X6 Pro", status: "voz-dados", has5g: true },
            { name: "Poco X6", status: "voz-dados", has5g: true },
            { name: "Poco X5 Pro", status: "voz-dados", has5g: true },
            { name: "Poco X5", status: "voz-dados", has5g: true },
            { name: "Poco X4 Pro", status: "voz-dados", has5g: true },
            { name: "Poco M6", status: "voz-dados", has5g: false },
            { name: "Poco C65", status: "voz-dados", has5g: false },
            { name: "Poco F5", status: "voz-dados", has5g: true },
            { name: "Poco F4", status: "voz-dados", has5g: true },
            { name: "Redmi Note M4 5G", status: "apenas-dados", has5g: false },
            { name: "Redmi 14", status: "voz-dados", has5g: false },
            { name: "Redmi 13 Pro", status: "voz-dados", has5g: false },
            { name: "Redmi 13C", status: "voz-dados", has5g: false },
            { name: "Redmi 12C", status: "voz-dados", has5g: false },
            { name: "Redmi 12", status: "voz-dados", has5g: false },
            { name: "Redmi 10C", status: "voz-dados", has5g: false },
            { name: "Redmi A3x", status: "voz-dados", has5g: false },
            { name: "Redmi A3", status: "voz-dados", has5g: false },
            { name: "Redmi Note 13", status: "voz-dados", has5g: false },
            { name: "Redmi Note 12", status: "voz-dados", has5g: true },
            { name: "Redmi Note 12 Pro", status: "voz-dados", has5g: true },
            { name: "Redmi Note 11", status: "voz-dados", has5g: false },
            { name: "Redmi Note 10", status: "voz-dados", has5g: true },
            { name: "Redmi Note 9S", status: "voz-dados", has5g: false },
            { name: "Redmi Note 9", status: "voz-dados", has5g: false },
            { name: "Redmi Note 8", status: "voz-dados", has5g: false },
            { name: "Redmi Note 7", status: "voz-dados", has5g: false },
            { name: "Xiaomi 13", status: "voz-dados", has5g: true },
            { name: "Xiaomi 13 Lite", status: "voz-dados", has5g: true },
            { name: "Xiaomi 12", status: "voz-dados", has5g: true },
            { name: "Xiaomi 12 Lite", status: "voz-dados", has5g: true },
            { name: "Xiaomi 11 Lite", status: "voz-dados", has5g: true },
            { name: "Redmi Note 13", status: "apenas-dados", has5g: false },
            { name: "Redmi Note 12s", status: "apenas-dados", has5g: false },
            { name: "Redmi Note 11s", status: "apenas-dados", has5g: false },
            { name: "Redmi Note 10S", status: "apenas-dados", has5g: false },
            { name: "Redmi Note 9C", status: "apenas-dados", has5g: false },
            { name: "Redmi A2", status: "apenas-dados", has5g: false },
            { name: "Redmi 9A", status: "apenas-dados", has5g: false },
            { name: "Mi A2", status: "roaming", has5g: false },
            { name: "Redmi Note 6 Pro", status: "roaming", has5g: false }
        ]
    },
    {
        brand: "Realme",
        models: [
            { name: "Realme 11 Pro+", status: "voz-dados", has5g: true },
            { name: "Realme 11 Pro", status: "voz-dados", has5g: true },
            { name: "Realme 10 Pro+", status: "voz-dados", has5g: true },
            { name: "Realme 9 Pro+", status: "voz-dados", has5g: true },
            { name: "Realme GT 2", status: "voz-dados", has5g: true },
            { name: "Realme GT Master", status: "voz-dados", has5g: true },
            { name: "Realme 8 5G", status: "voz-dados", has5g: true },
            { name: "Realme 7 5G", status: "voz-dados", has5g: true },
            { name: "Realme C67", status: "apenas-dados", has5g: false },
            { name: "Realme C55", status: "apenas-dados", has5g: false },
            { name: "Realme C53", status: "apenas-dados", has5g: false },
            { name: "Realme Note 50", status: "apenas-dados", has5g: false },
            { name: "Realme C11", status: "apenas-dados", has5g: false }
        ]
    },
    {
        brand: "Asus",
        models: [
            { name: "Zenfone 9", status: "voz-dados", has5g: true },
            { name: "Zenfone 8", status: "voz-dados", has5g: true },
            { name: "Zenfone 8 Flip", status: "voz-dados", has5g: true },
            { name: "ROG Phone 7", status: "voz-dados", has5g: true },
            { name: "ROG Phone 6", status: "voz-dados", has5g: true }
        ]
    },
    {
        brand: "TCL",
        models: [
            { name: "TCL 40 R", status: "voz-dados", has5g: true },
            { name: "TCL 30", status: "voz-dados", has5g: true },
            { name: "TCL 20 Pro", status: "voz-dados", has5g: true }
        ]
    },
    {
        brand: "Multilaser",
        models: [
            { name: "MS80", status: "voz-dados", has5g: true }
        ]
    },
    {
        brand: "Tecno",
        models: [
            { name: "Spark 10", status: "voz-dados", has5g: true },
            { name: "Camon 20", status: "voz-dados", has5g: true }
        ]
    },
    {
        brand: "Infinix",
        models: [
            { name: "Smart 6", status: "roaming", has5g: false },
            { name: "HOT 20", status: "voz-dados", has5g: true },
            { name: "ZERO 5G", status: "voz-dados", has5g: true }
        ]
    },
    {
        brand: "LG",
        models: [
            { name: "K62", status: "apenas-dados", has5g: false },
            { name: "K52", status: "apenas-dados", has5g: false },
            { name: "K41s", status: "apenas-dados", has5g: false },
            { name: "K41", status: "apenas-dados", has5g: false },
            { name: "K22", status: "roaming", has5g: false },
            { name: "K9", status: "roaming", has5g: false }
        ]
    },
    {
        brand: "Positivo",
        models: [
            { name: "Tablet T810", status: "roaming", has5g: false }
        ]
    }
];

async function importDevices() {
    const db = new Database();
    
    // Aguardar o banco inicializar
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let totalImported = 0;
    let errors = 0;
    
    console.log('🚀 Iniciando importação de dispositivos...');
    
    for (const brandData of devicesData) {
        const brand = brandData.brand;
        console.log(`\n📱 Importando ${brand}...`);
        
        for (const modelData of brandData.models) {
            try {
                await db.createDevice(
                    brand,
                    modelData.name,
                    modelData.status,
                    modelData.has5g
                );
                totalImported++;
                console.log(`✅ ${brand} ${modelData.name}`);
            } catch (error) {
                if (error.message.includes('UNIQUE constraint failed')) {
                    console.log(`⚠️ ${brand} ${modelData.name} - Já existe`);
                } else {
                    console.log(`❌ ${brand} ${modelData.name} - Erro: ${error.message}`);
                    errors++;
                }
            }
            
            // Pequena pausa para não sobrecarregar
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }
    
    console.log('\n🎉 Importação concluída!');
    console.log(`📊 Total importados: ${totalImported}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`💾 Banco atualizado: devices.db`);
    
    db.close();
}

// Executar a importação
importDevices().catch(console.error);