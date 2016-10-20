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
        // field: 'UserId',
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
        // field: 'date_start',
        type: Sequelize.DATE
      },
      dateEnd: {
        allowNull: false,
        // field: 'date_end',
        type: Sequelize.DATE
      },
      placeId: {
        // field: 'place_id',
        type: Sequelize.INTEGER
      },
      color: {
        allowNull: false,
        type: Sequelize.STRING(6)
      },
      imageThumbnail: {
        // field: 'image_thumbnail',
        type: Sequelize.TEXT
      },
      imageSmall: {
        // field: 'image_small',
        type: Sequelize.TEXT
      },
      imageBig: {
        // field: 'image_big',
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        // field: 'created_at',
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        // field: 'updated_at',
        type: Sequelize.DATE
      },
      deletedAt: {
        // field: 'deleted_at',
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('events')
  }
}
