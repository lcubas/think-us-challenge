const fs = require('fs');
const path = require('path');
const { sequelize } = require('./src/config/database');

const SUPPORTED_DIRECTIONS = ['up', 'down'];

async function runMigrations(direction = 'up') {
  if (!SUPPORTED_DIRECTIONS.includes(direction)) {
    console.error('❌ Only "up" or "down" are supported as migrations.');
    process.exit(1);
  }

  const migrationsDir = path.resolve(__dirname, `migrations/${direction}`);
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  console.log(`🚀 Ejecutando migraciones: ${direction.toUpperCase()}`);

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`⚙️ Migracion ${direction}: ${file}`);
    try {
      await sequelize.query(sql);
      console.log(`✅ ${file} ejecutado correctamente`);
    } catch (err) {
      console.error(`❌ Error en ${file}:`, err.message);
      break;
    }
  }

  await sequelize.close();
  console.log('🔒 Conexión cerrada.');
}

// Ejecuta directamente si se llama por CLI
if (require.main === module) {
  const direction = process.argv[2] || 'up';
  runMigrations(direction).catch(err => {
    console.error('❌ Error general al ejecutar migraciones:', err);
    process.exit(1);
  });
}
