import dotenv from 'dotenv';
import path from 'path';

// Carregando variáveis de ambiente do arquivo .env
const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
}

export {}; // Para tornar este arquivo um módulo