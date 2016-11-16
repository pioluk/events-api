'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('events', {
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
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      dateStart: {
        allowNull: false,
        type: Sequelize.DATE
      },
      dateEnd: {
        allowNull: false,
        type: Sequelize.DATE
      },
      PlaceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'places',
          key: 'id'
        }
      },
      color: {
        allowNull: false,
        type: Sequelize.STRING(7)
      },
      imageThumbnail: {
        type: Sequelize.TEXT
      },
      imageSmall: {
        type: Sequelize.TEXT
      },
      imageBig: {
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('events')
  }
}
