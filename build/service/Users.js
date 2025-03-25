const db = require("../models/index");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const twilio = require("twilio");
const {
  parsePhoneNumberFromString
} = require("libphonenumber-js");
const {
  Op
} = require("sequelize");
const accountSid = "ACd593bdbe419276e1419b36c0cbec6f34";
const authToken = "d3f49e326c1bc479470200682004af49";
const client = new twilio(accountSid, authToken);
const accessTokenSecret = crypto.randomBytes(64).toString("hex");
const expiresIn = 8 * 60 * 60; // 8 giờ tính bằng giây

const generateAccessToken = user => {
  return jwt.sign(user, accessTokenSecret, {
    expiresIn
  });
};

// Hotel Management
const handleCheckLogin = (password, userName) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userErrObj = {};

      // check when email exsit
      const getUserByUserName = await db.User.findOne({
        where: {
          userName: userName
        }
      });
      if (getUserByUserName) {
        if (password === getUserByUserName.password) {
          const accessToken = generateAccessToken({
            userName: getUserByUserName.userName
          });
          userErrObj.code = 1;
          userErrObj.message = "OK";
          userErrObj.info = {
            userName: getUserByUserName.userName,
            accessToken: accessToken
          };
          userErrObj.success = true;
          resolve(userErrObj);
        } else {
          userErrObj.code = 2;
          userErrObj.message = "Wrong password";
          userErrObj.success = false;
          resolve(userErrObj);
        }
      } else {
        userErrObj.code = 3;
        userErrObj.message = "User not found";
        userErrObj.success = false;
        resolve(userErrObj);
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getAllUser = ({
  start,
  limit,
  sort,
  filter
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const whereClause = {};
      if (filter) {
        const filterArray = JSON.parse(filter);
        if (Array.isArray(filterArray)) {
          filterArray.forEach(({
            operator,
            value,
            property
          }) => {
            if (operator && value && property) {
              whereClause[property] = {
                [Op[operator]]: value
              };
            }
          });
        }
      }
      const order = [];
      if (sort && typeof sort === "object") {
        const {
          property,
          direction
        } = sort;
        const sortDirection = direction === "desc" ? "DESC" : "ASC";
        if (property) {
          order.push([property, sortDirection]);
        }
      }
      const queryOptions = {
        addtribute: ["id", "userName", "phoneNumber", "createdAt", "updatedAt"],
        where: whereClause,
        order
      };
      if (start) {
        queryOptions.offset = parseInt(start, 10);
      }
      if (limit) {
        queryOptions.limit = parseInt(limit, 10);
      }
      const userLists = await db.HotelUser.findAndCountAll(queryOptions);
      resolve({
        data: userLists.rows,
        count: userLists.count
      });
    } catch (error) {
      reject(error);
    }
  });
};
const deleteUser = userId => {
  return new Promise(async (resolve, reject) => {
    try {
      const errObj = {};
      const getUserById = await db.HotelUser.findOne({
        where: {
          id: userId
        }
      });
      if (!getUserById) {
        errObj.code = 1, errObj.message = "User not found";
        resolve(errObj);
      }
      await db.HotelUser.destroy({
        where: {
          id: userId
        }
      });
      resolve({
        code: 0,
        message: "delete success"
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getAllOrderRooms = ({
  start,
  limit,
  sort,
  filter
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const whereClause = {};
      if (filter) {
        const filterArray = JSON.parse(filter);
        if (Array.isArray(filterArray)) {
          filterArray.forEach(({
            operator,
            value,
            property
          }) => {
            if (operator && value && property) {
              whereClause[property] = {
                [Op[operator]]: value
              };
            }
          });
        }
      }
      const order = [];
      if (sort && typeof sort === "object") {
        const {
          property,
          direction
        } = sort;
        const sortDirection = direction === "desc" ? "DESC" : "ASC";
        if (property) {
          order.push([property, sortDirection]);
        }
      }
      const queryOptions = {
        addtribute: ["id", "customerName", "address", "phoneNumber", "city", "region", "infoBooking", "isPayment", "realPrice", "checkIn", "checkOut", "createdAt", "updatedAt"],
        where: whereClause,
        order
      };
      if (start) {
        queryOptions.offset = parseInt(start, 10);
      }
      if (limit) {
        queryOptions.limit = parseInt(limit, 10);
      }
      const roomOrders = await db.Orders.findAndCountAll(queryOptions);
      resolve({
        data: roomOrders.rows,
        count: roomOrders.count
      });
    } catch (error) {
      reject(error);
    }
  });
};
const deleteOrderRooms = orderId => {
  return new Promise(async (resolve, reject) => {
    try {
      const errObj = {};
      const getUserById = await db.Orders.findOne({
        where: {
          id: orderId
        }
      });
      if (!getUserById) {
        errObj.code = 1, errObj.message = "User not found";
        resolve(errObj);
      }
      await db.Orders.destroy({
        where: {
          id: orderId
        }
      });
      resolve({
        code: 0,
        message: "delete success"
      });
    } catch (error) {
      reject(error);
    }
  });
};

// ----------------------------------------------------
// Hotel Application
const handleCheckAuth = ({
  userName,
  password
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userErrObj = {};
      const checkUserByUserName = await db.HotelUser.findOne({
        where: {
          userName: userName,
          password: password
        }
      });
      console.log(checkUserByUserName);
      if (checkUserByUserName) {
        const accessToken = generateAccessToken({
          userName: checkUserByUserName.userName,
          phoneNumber: checkUserByUserName.phoneNumber,
          addressCustomer: checkUserByUserName.addressCustomer,
          identityCustomer: checkUserByUserName.identityCustomer,
          cityOfCustomer: checkUserByUserName.cityOfCustomer,
          regionOfCustomer: checkUserByUserName.regionOfCustomer
        });
        userErrObj.info = {
          userName: checkUserByUserName.userName,
          phoneNumber: checkUserByUserName.phoneNumber,
          addressCustomer: checkUserByUserName.addressCustomer,
          identityCustomer: checkUserByUserName.identityCustomer,
          cityOfCustomer: checkUserByUserName.cityOfCustomer,
          regionOfCustomer: checkUserByUserName.regionOfCustomer,
          accessToken: accessToken
        };
        userErrObj.success = true;
        resolve(userErrObj);
      } else {
        userErrObj.code = 2;
        userErrObj.msg = "Không tìm thấy người dùng";
        userErrObj.success = false;
        resolve(userErrObj);
      }
    } catch (e) {
      reject(e);
    }
  });
};
const handleCheckRegister = async ({
  phoneNumber,
  userName,
  password,
  cityOfCustomer,
  addressCustomer,
  regionOfCustomer,
  identityCustomer
}) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Save user to the database
  const user = await db.HotelUser.create({
    phoneNumber,
    password,
    userName,
    cityOfCustomer,
    addressCustomer,
    identityCustomer,
    regionOfCustomer,
    otp
  });
  try {
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      to: parsePhoneNumberFromString(phoneNumber, "VN").formatInternational(),
      from: "+12403292698"
    });
  } catch (error) {
    console.error(`Error sending OTP: ${error.message}`);
  }
  return user;
};
const checkPhoneExists = phoneNumber => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.HotelUser.findOne({
        where: {
          phoneNumber: phoneNumber
        }
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};
const handleVerifyOTP = async otpCode => {
  const OTPRecord = await db.HotelUser.findOne({
    where: {
      otp: otpCode
    }
  });
  return OTPRecord !== null;
};
module.exports = {
  handleCheckLogin: handleCheckLogin,
  handleCheckRegister: handleCheckRegister,
  handleVerifyOTP: handleVerifyOTP,
  handleCheckAuth: handleCheckAuth,
  checkPhoneExists: checkPhoneExists,
  // ---------------------------------

  getAllUser: getAllUser,
  deleteUser: deleteUser,
  getAllOrderRooms: getAllOrderRooms,
  deleteOrderRooms: deleteOrderRooms
};