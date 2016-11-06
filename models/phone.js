'use strict'

module.exports = (sequelize, DataTypes) => {
  var Phone = sequelize.define('Phone', {
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
    number: {
      allowNull: false,
      type: DataTypes.STRING
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    tableName: 'phones',
    classMethods: {
      associate: models => {
        Phone.belongsTo(models.Event)
      }
    }
  })
  // Phone.removeAttribute('id')
  return Phone
}
