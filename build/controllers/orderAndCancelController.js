const OrderAndCancleService = require("../service/orderAndCancel");
const {
  VNPay
} = require("vnpay");
const db = require("../models/index");
const Sequelize = require("sequelize");

// Xác định tham số cho API thanh toán VNPay
const vnpay = new VNPay({
  tmnCode: "BF5D8YLG",
  secureSecret: "WGZOZVSMLASCWAWUXLWEDTTGKCTSUDXU",
  api_Host: "https://sandbox.vnpayment.vn"
});
const orderRoom = async (req, res) => {
  try {
    const orderData = await OrderAndCancleService.handleOrderRoom(req.body);
    const paymentData = {
      vnp_Amount: Number(orderData.realPrice),
      vnp_IpAddr: "192.168.0.1",
      vnp_Command: "pay",
      vnp_OrderInfo: "Thanh toán",
      vnp_ReturnUrl: "http://localhost:5173/rooms/payment-success",
      vnp_TxnRef: orderData.id.toString(),
      vnp_TxnType: "pay"
    };

    // Gửi yêu cầu thanh toán đến VNPay
    const paymentUrl = await vnpay.buildPaymentUrl(paymentData);
    res.json({
      paymentUrl: paymentUrl
    });
    await OrderAndCancleService.updateBookingStatus(orderData.id, true);
    for (const order of orderData.infoBooking) {
      await OrderAndCancleService.updateRoomStatus(order.id, true);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};
const cancelRoom = async (req, res) => {
  const bookingId = req.body.id;
  try {
    const booking = await db.Orders.findOne({
      where: {
        id: bookingId
      }
    });
    console.log(booking);
    await OrderAndCancleService.updateBookingStatus(booking.id, false);
    for (const book of booking.infoBooking) {
      await OrderAndCancleService.updateCancelRoomStatus(book.id, false);
    }
    return res.json({
      message: "Hủy đơn đặt phòng và hoàn tiền thành công"
    });
  } catch (error) {
    console.error("Error canceling booking:", error);
    return res.status(500).json({
      error: "Đã xảy ra lỗi"
    });
  }
};
const checkDateIsBooked = async (req, res) => {
  try {
    const {
      checkIn,
      checkOut
    } = req.body;
    const bookingsOrder = await db.Orders.findAll({
      where: {
        checkIn: checkIn,
        checkOut: checkOut
      }
    });

    // Tạo một đối tượng để theo dõi trạng thái mới của từng phòng
    const roomStatusMap = {};

    // Duyệt qua tất cả các đặt phòng
    if (bookingsOrder.length > 0) {
      for (const booking of bookingsOrder) {
        for (const order of booking.infoBooking) {
          const roomId = order.id;
          // Nếu phòng chưa có trong đối tượng roomStatusMap, tạo một mục mới
          if (!roomStatusMap[roomId]) {
            roomStatusMap[roomId] = {
              isBooked: true // Đặt ban đầu là đã đặt
            };
          }
        }
      }

      // Lấy danh sách các phòng từ đối tượng roomStatusMap
      const roomIds = Object.keys(roomStatusMap);
      console.log(roomIds);
      for (const roomId of roomIds) {
        // Lấy thông tin về phòng từ cơ sở dữ liệu
        const room = await db.Rooms.findByPk(roomId);
        const status = roomStatusMap[roomId].isBooked ? true : false;
        room.status = status;
        await OrderAndCancleService.updateRoomStatus(roomId, status
        // checkIn,
        // checkOut
        );
      }
    } else {
      const roomsUpdate = await db.Rooms.findAll();
      for (const room of roomsUpdate) {
        await db.Rooms.update({
          availability: false
        }, {
          where: {
            id: room.id
          }
        });
      }
    }
    return res.status(200).json({
      data: await db.Rooms.findAll({
        where: {
          availability: false,
          checkIn: checkIn,
          checkOut: checkOut
        }
      })
    });
  } catch (error) {
    console.log(error);
  }
};
const handleInsertDate = async (req, res) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      monthCheckIn,
      monthCheckOut
    } = req.body;
    const roomItem = await db.Rooms.findOne({
      where: {
        id: roomId
      }
    });
    console.log(await db.Rooms.findAll());
    if (roomItem) {
      await db.Rooms.update({
        checkIn: checkIn,
        checkOut: checkOut,
        monthCheckIn: monthCheckIn,
        montCheckOut: monthCheckOut
      }, {
        where: {
          id: roomId
        }
      });
    } else {
      return res.status(500).json({
        message: "Room not found"
      });
    }
    return res.status(200).json({
      data: await db.Rooms.findOne({
        where: {
          id: roomId
        }
      })
    });
  } catch (error) {
    console.log(error);
  }
};
const handleGetRoomsOrder = async (req, res) => {
  try {
    const {
      checkIn,
      checkOut
    } = req.body;
    const roomsOrder = await db.Orders.findOne({
      where: {
        checkIn: checkIn,
        checkOut: checkOut
      }
    });
    if (roomsOrder) {
      return res.status(200).json({
        data: roomsOrder.infoBooking
      });
    } else {
      return res.status(200).json({
        data: []
      });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  orderRoom: orderRoom,
  cancelRoom: cancelRoom,
  checkDateIsBooked: checkDateIsBooked,
  handleInsertDate: handleInsertDate,
  handleGetRoomsOrder: handleGetRoomsOrder
};