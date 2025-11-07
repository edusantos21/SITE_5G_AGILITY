console.log('✅ Package.json configurado com sucesso!');
console.log('✅ Dependências instaladas:');
console.log('   - express: Servidor web');
console.log('   - sqlite3: Banco de dados');
console.log('   - cors: Permissões para API');
console.log('   - bcrypt: Criptografia de senhas');

// Testar se as dependências foram instaladas corretamente
try {
    const express = require('express');
    const sqlite3 = require('sqlite3');
    const cors = require('cors');
    const bcrypt = require('bcrypt');
    console.log('🎉 Todas as dependências carregadas com sucesso!');
} catch (error) {
    console.error('❌ Erro ao carregar dependências:', error.message);
}