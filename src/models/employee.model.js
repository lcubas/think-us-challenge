const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DocumentType = Object.freeze({
  DNI: 'dni',
  PASSPORT: 'pasaporte',
});

const Employee = sequelize.define(
  'Employee',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    documentNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    documentType: {
      type: DataTypes.ENUM(DocumentType.DNI, DocumentType.PASSPORT),
      allowNull: false,
      defaultValue: 'employee',
    },
    salary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    hiredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'employees',
    timestamps: true,
    paranoid: true,
  },
);

module.exports = Employee;