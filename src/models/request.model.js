const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Request = sequelize.define(
  'Request',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    tableName: 'requests',
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
);

module.exports = Request;
