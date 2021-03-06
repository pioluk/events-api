'use strict'

const xss = require('xss')

module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define('Email', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    EventId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    }
  }, {
    tableName: 'emails',
    classMethods: {
      associate: models => {
        Email.belongsTo(models.Event)
      }
    },
    hooks: {
      beforeCreate: (instance) => {
        instance.address = xss(instance.address)
      }
    }
  })
  return Email
}
