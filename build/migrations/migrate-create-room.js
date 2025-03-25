"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Rooms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomType: {
        type: Sequelize.STRING
      },
      roomNumber: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      availability: {
        type: Sequelize.BOOLEAN
      },
      services: {
        type: Sequelize.JSON,
        // Define a field for storing JSON data (array of objects)
        allowNull: true
      },
      roomName: {
        type: Sequelize.STRING
      },
      roomEveduate: {
        type: Sequelize.STRING
      },
      imageRoom: {
        type: Sequelize.STRING
      },
      optionGuestAndChildNumber: {
        type: Sequelize.STRING
      },
      checkIn: {
        type: Sequelize.STRING
      },
      checkOut: {
        type: Sequelize.STRING
      },
      isStayed: {
        type: Sequelize.BOOLEAN
      },
      isCheckOut: {
        type: Sequelize.BOOLEAN
      },
      monthCheckIn: {
        type: Sequelize.STRING
      },
      monthCheckOut: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Rooms");
  }
};