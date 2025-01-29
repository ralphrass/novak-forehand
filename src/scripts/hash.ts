// scripts/hash.ts
import bcrypt from 'bcryptjs'

async function generateHash() {
    const password = 'novak123';
    const hash = await bcrypt.hash(password, 12);
    console.log('Hash para novak123:', hash);
    
    // Teste de verificação
    const isValid = await bcrypt.compare('novak123', hash);
    console.log('Teste de verificação:', isValid);
}

generateHash();