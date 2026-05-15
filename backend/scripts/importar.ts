import { prisma } from '../src/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

async function importarDatos() {
    console.log('📖 Leyendo archivo JSON...');
    
    const filePath = path.join(__dirname, '..', 'datos.json');
    
    if (!fs.existsSync(filePath)) {
        console.error(`❌ No se encuentra el archivo: ${filePath}`);
        return;
    }
    
    console.log(`✅ Archivo encontrado: datos.json`);
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    const words = Array.isArray(data) ? data : Object.values(data);
    
    console.log(`📊 Encontradas ${words.length} palabras para importar`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const quechuaWord = word.quechua?.[0] || `palabra_${i + 1}`;
        
        if (i % 50 === 0 && i > 0) {
            console.log(`   Progreso: ${i}/${words.length}`);
        }
        
        try {
            await prisma.word.create({
                data: {
                    quechua: word.quechua?.map((q: string) => q.toLowerCase().trim()) || [],
                    spanish: word.spanish?.map((s: string) => s.toLowerCase().trim()) || [],
                    category: word.category || 'SUSTANTIVO',
                    description: word.description || undefined,
                    examples: word.examples?.length > 0 ? {
                        create: word.examples
                    } : undefined
                }
            });
            successCount++;
        } catch (error: any) {
            errorCount++;
            if (!error.message?.includes('Unique')) {
                console.log(`   ❌ ${quechuaWord}: ${error.message?.substring(0, 50)}`);
            }
        }
    }
    
    console.log(`\n✅ Importadas: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    
    await prisma.$disconnect();
}

importarDatos();