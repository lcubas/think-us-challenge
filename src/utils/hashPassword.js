const { getEnv } = require('../config/env');
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const env = getEnv();
  return bcrypt.hash(password, env.BCRYPT_ROUNDS);
};

module.exports = { hashPassword };
