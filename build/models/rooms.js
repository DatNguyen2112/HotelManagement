"use strict";

const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Rooms.init({
    roomType: DataTypes.STRING,
    roomNumber: DataTypes.STRING,
    price: DataTypes.STRING,
    availability: DataTypes.BOOLEAN,
    services: DataTypes.JSON,
    imageRoom: DataTypes.STRING,
    optionGuestAndChildNumber: DataTypes.STRING,
    roomName: DataTypes.STRING,
    roomEveduate: DataTypes.STRING,
    checkIn: DataTypes.STRING,
    checkOut: DataTypes.STRING,
    isStayed: DataTypes.BOOLEAN,
    isCheckOut: DataTypes.BOOLEAN,
    monthCheckIn: DataTypes.STRING,
    monthCheckOut: DataTypes.STRING
  }, {
    sequelize,
    modelName: "Rooms"
  });
  return Rooms;
};