"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("HotelUsers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userName: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.STRING
      },
      addressCustomer: {
        type: Sequelize.STRING
      },
      identityCustomer: {
        type: Sequelize.STRING
      },
      cityOfCustomer: {
        type: Sequelize.STRING
      },
      regionOfCustomer: {
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
    await queryInterface.dropTable("HotelUsers");
  }
};