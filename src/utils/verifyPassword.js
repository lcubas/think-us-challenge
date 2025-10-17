const bcrypt = require('bcryptjs');

/**
 * Verificar contraseña
 * @param {string} plainPassword - Contraseña en texto plano
 * @param {string} hashedPassword - Hash de contraseña
 * @returns {Promise<boolean>}
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  console.log('Verifying password:', { plainPassword, hashedPassword });
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { verifyPassword };