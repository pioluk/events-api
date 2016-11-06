'use strict'

module.exports = (sequelize, DataTypes) => {
  const Website = sequelize.define('website', {
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
      type: DataTypes.TEXT,
      validate: {
        isUrl: true
      }
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
    classMethods: {
      associate: models => {
        Website.belongsTo(models.Event)
      }
    }
  })
  // Website.removeAttribute('id')
  return Website
}
