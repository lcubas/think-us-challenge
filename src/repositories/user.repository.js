const User = require('../models/user.model');

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findByEmail(email) {
    return User.findOne({ where: { email: email.toLowerCase() } });
  }

  async findById(id) {
    return User.findByPk(id);
  }

  async findAll(options = {}) {
    return User.findAll(options);
  }

  async update(id, updates) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return user.update(updates);
  }

  async delete(id) {
    return User.destroy({ where: { id } });
  }
}

module.exports = new UserRepository();