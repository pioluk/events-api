'use strict'

const fs = require('fs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      EventId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'events',
          key: 'id'
        }
      },
      text: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
    .then(() => {
      if (queryInterface.sequelize.options.dialect === 'postgres') {
        return queryInterface.sequelize.query(fs.readFileSync('./sql/events_fts.sql', 'utf8'))
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comments')
  }
}
