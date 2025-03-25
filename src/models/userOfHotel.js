"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HotelUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HotelUser.init(
    {
      userName: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      addressCustomer: DataTypes.STRING,
      identityCustomer: DataTypes.STRING,
      cityOfCustomer: DataTypes.STRING,
      regionOfCustomer: DataTypes.STRING,
      password: DataTypes.STRING,
      otp: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "HotelUser",
    }
  );
  return HotelUser;
};
