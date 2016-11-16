'use strict'
module.exports = (sequelize, DataTypes) => {
  const Place = sequelize.define('Place', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    lat: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    lng: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    placeId: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    tableName: 'places',
    classMethods: {
      associate: (models) => {
        Place.hasMany(models.Event)
      }
    }
  })

  return Place
}
