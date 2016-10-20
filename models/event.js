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
      // field: 'UserId',
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
      // field: 'date_start',
      type: DataTypes.DATE
    },
    dateEnd: {
      allowNull: false,
      // field: 'date_end',
      type: DataTypes.DATE
    },
    placeId: {
      // field: 'place_id',
      type: DataTypes.INTEGER
    },
    color: {
      allowNull: false,
      type: DataTypes.STRING(6),
      validate: {
        len: 6,
        notEmpty: true
      }
    },
    imageThumbnail: {
      // field: 'image_thumbnail',
      type: DataTypes.TEXT
    },
    imageSmall: {
      // field: 'image_small',
      type: DataTypes.TEXT
    },
    imageBig: {
      // field: 'image_big',
      type: DataTypes.TEXT
    },
    createdAt: {
      // field: 'created_at',
      type: DataTypes.DATE
    },
    updatedAt: {
      // field: 'updated_at',
      type: DataTypes.DATE
    },
    deletedAt: {
      // field: 'deleted_at',
      type: DataTypes.DATE
    }
  }, {
    paranoid: true,
    tableName: 'events',
    classMethods: {
      associate: models => {
        Event.belongsTo(models.User)
      }
    }
  })
  return Event
}
