const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserRoles = Object.freeze({
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
});

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: { isEmail: true },
    }, 
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(UserRoles.EMPLOYEE, UserRoles.ADMIN),
      allowNull: false,
      defaultValue: 'employee',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
  },
);

module.exports = User;
