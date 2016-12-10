'use strict'
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
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
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    },
    dateStart: {
      allowNull: false,
      type: DataTypes.DATE
    },
    dateEnd: {
      allowNull: false,
      type: DataTypes.DATE
    },
    PlaceId: {
      type: DataTypes.INTEGER
    },
    color: {
      allowNull: false,
      type: DataTypes.STRING(7),
      validate: {
        len: [4, 7],
        notEmpty: true
      }
    },
    image: {
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
    tableName: 'events',
    classMethods: {
      associate: models => {
        Event.belongsTo(models.User)
        Event.belongsTo(models.Place)
        Event.hasMany(models.Comment)
      }
    }
  })
  return Event
}
