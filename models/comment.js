'use strict'

const xss = require('xss')

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    EventId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    text: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    paranoid: true,
    tableName: 'comments',
    classMethods: {
      associate: (models) => {
        Comment.belongsTo(models.User)
        Comment.belongsTo(models.Event)
      }
    },
    hooks: {
      beforeCreate: (instance) => {
        instance.text = xss(instance.text)
      }
    }
  })

  return Comment
}
