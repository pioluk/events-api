'use strict'

const fs = require('fs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('places', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      lat: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      lng: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      placeId: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(() => {
      if (queryInterface.sequelize.options.dialect === 'postgres') {
        return queryInterface.sequelize.query(fs.readFileSync('./sql/place-set-geography.sql', 'utf8'))
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('places')
  }
}
