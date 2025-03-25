const db = require("../models/index");

const handleOrderRoom = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createOrder = await db.Orders.create({
        customerName: data.customerName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        city: data.city,
        region: data.region,
        infoBooking: data.infoBooking,
        isPayment: data.isPayment,
        realPrice: data.realPrice,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
      });

      resolve(createOrder);
    } catch (error) {
      reject(error);
    }
  });
};

const updateBookingStatus = async (bookingId, status) => {
  try {
    await db.Orders.update({ isPayment: status }, { where: { id: bookingId } });
  } catch (error) {
    console.error(error);
    throw new Error("Cập nhật thất bại");
  }
};

const updateRoomStatus = async (roomId, status) => {
  try {
    await db.Rooms.update(
      {
        availability: status,
        isStayed: status,
        isCheckOut: !status,
      },
      {
        where: {
          id: roomId,
        },
      }
    );
  } catch (error) {
    console.error(error);
    throw new Error("Cập nhật thất bại");
  }
};

const updateCancelRoomStatus = async (roomId, status) => {
  try {
    await db.Rooms.update(
      {
        availability: status,
        isStayed: status,
        isCheckOut: status,
      },
      {
        where: {
          id: roomId,
        },
      }
    );
  } catch (error) {
    console.error(error);
    throw new Error("Cập nhật thất bại");
  }
};

module.exports = {
  handleOrderRoom: handleOrderRoom,
  updateBookingStatus: updateBookingStatus,
  updateRoomStatus: updateRoomStatus,
  updateCancelRoomStatus: updateCancelRoomStatus,
};
