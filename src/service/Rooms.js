const db = require("../models/index");
const { Op } = require("sequelize");

const createRoom = async (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data);
    try {
      const roomItem = await db.Rooms.create({
        roomType: data.roomType,
        roomNumber: data.roomNumber,
        price: data.price,
        availability: data.availability,
        services: data.services,
        imageRoom: data.imageRoom,
        optionGuestAndChildNumber: data.optionGuestAndChildNumber,
        roomName: data.roomName,
        roomEveduate: data.roomEveduate,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        isStayed: data.isStayed,
        isCheckOut: data.isCheckOut,
        monthCheckIn: data.monthCheckIn,
        monthCheckOut: data.monthCheckOut,
      });

      resolve(roomItem);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllRoom = ({ start, limit, sort, filter }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const whereClause = {};

      if (filter) {
        const filterArray = JSON.parse(filter);
        if (Array.isArray(filterArray)) {
          filterArray.forEach(({ operator, value, property }) => {
            if (operator && value && property) {
              whereClause[property] = {
                [Op[operator]]: value,
              };
            }
          });
        }
      }

      const order = [];

      if (sort && typeof sort === "object") {
        const { property, direction } = sort;
        const sortDirection = direction === "desc" ? "DESC" : "ASC";

        if (property) {
          order.push([property, sortDirection]);
        }
      }

      const queryOptions = {
        attributes: [
          "id",
          "roomType",
          "roomNumber",
          "price",
          "availability",
          "services",
          "imageRoom",
          "optionGuestAndChildNumber",
          "roomName",
          "roomEveduate",
          "checkIn",
          "checkOut",
          "createdAt",
          "updatedAt",
          "isStayed",
          "isCheckOut",
          "monthCheckIn",
          "monthCheckOut",
        ],
        where: whereClause,
        order,
      };

      if (start) {
        queryOptions.offset = parseInt(start, 10);
      }

      if (limit) {
        queryOptions.limit = parseInt(limit, 10);
      }

      const RoomList = await db.Rooms.findAndCountAll(queryOptions);

      resolve({
        data: RoomList.rows,
        count: RoomList.count,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteRoom = (roomId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const errObj = {};
      const getRoomById = await db.Rooms.findOne({
        where: {
          id: roomId,
        },
      });

      if (!getRoomById) {
        (errObj.code = 1), (errObj.message = "Room not found");
        resolve(errObj);
      }

      await db.Rooms.destroy({
        where: {
          id: roomId,
        },
      });

      resolve({
        code: 0,
        message: "delete success",
      });
    } catch (err) {
      reject(err);
    }
  });
};

const updateRoom = (roomItem) => {
  return new Promise(async (resolve, reject) => {
    try {
      const getRoomByIds = await db.Rooms.findOne({
        where: {
          id: roomItem.id,
        },
        raw: false,
      });

      if (getRoomByIds) {
        (getRoomByIds.roomType = roomItem.roomType),
          (getRoomByIds.roomNumber = roomItem.roomNumber),
          (getRoomByIds.price = roomItem.price);
        getRoomByIds.availability = roomItem.availability;
        getRoomByIds.services = roomItem.services;
        getRoomByIds.imageRoom = roomItem.imageRoom;
        getRoomByIds.optionGuestAndChildNumber =
          roomItem.optionGuestAndChildNumber;
        getRoomByIds.roomName = roomItem.roomName;
        getRoomByIds.roomEveduate = roomItem.roomEveduate;
        getRoomByIds.isStayed = roomItem.isStayed;
        getRoomByIds.isCheckOut = roomItem.isCheckOut;
        getRoomByIds.monthCheckIn = roomItem.monthCheckIn;
        getRoomByIds.monthCheckOut = roomItem.monthCheckOut;

        const newRooms = await getRoomByIds.save();
        resolve(newRooms);
      } else {
        resolve({
          code: 1,
          message: "Error",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailRoom = (roomDetailId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let errObj = {};
      const getRoomDetailById = await db.Rooms.findByPk(roomDetailId);

      if (getRoomDetailById) {
        resolve(getRoomDetailById);
      } else {
        (errObj.code = 1), (errObj.message = "Room not found");
        resolve(errObj);
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createRoom: createRoom,
  getAllRoom: getAllRoom,
  deleteRoom: deleteRoom,
  updateRoom: updateRoom,
  getDetailRoom: getDetailRoom,
};
