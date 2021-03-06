'use strict'

const xss = require('xss')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    imageAvatar: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'users',
    classMethods: {
      associate: models => {
        User.hasMany(models.Event)
      }
    },
    instanceMethods: {
      toJSON: function () {
        const data = this.get({ plain: true })
        delete data.password
        return data
      }
    },
    hooks: {
      beforeCreate: (instance) => {
        instance.username = xss(instance.username)
        instance.email = xss(instance.email)
        instance.imageAvatar = xss(instance.imageAvatar)
      }
    }
  })

  return User
}
