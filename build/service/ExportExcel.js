const db = require("../models/index");
const ExcelJS = require("exceljs");
const {
  Op
} = require("sequelize");
const generateExcelData = async filter => {
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
  const filterRooms = await db.Rooms.findAll({
    where: whereClause
  });
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Rooms");
  if (filterRooms) {
    worksheet.columns = [{
      header: "Tên phòng",
      key: "roomName",
      width: 300
    }, {
      header: "Loại phòng",
      key: "roomType",
      width: 300
    }, {
      header: "Số phòng",
      key: "roomNumber",
      width: 300
    }, {
      header: "Giá phòng",
      key: "price",
      width: 300
    }, {
      header: "Trạng thái",
      key: "availability",
      width: 300
    }, {
      header: "Đang ở",
      key: "isStayed",
      width: 300
    }, {
      header: "Đã check out",
      key: "isCheckOut",
      width: 300
    }];
    filterRooms.forEach(room => {
      worksheet.addRow({
        roomName: room.roomName,
        roomType: room.roomType,
        roomNumber: room.roomNumber,
        price: room.price,
        availability: room.availability === 0 ? "Chưa đặt" : "Đã đặt",
        isStayed: room.isStayed === 1 ? "Có" : "Không",
        isCheckOut: room.isCheckOut === 1 ? "Có" : "Không"
      });
    });
  }
  return workbook;
};
const generateExcelRoomOrdersData = async filter => {
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
  const filterOrderRooms = await db.Orders.findAll({
    where: whereClause
  });
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Rooms");
  if (filterOrderRooms) {
    worksheet.columns = [{
      header: "Tên khách hàng",
      key: "customerName",
      width: 300
    }, {
      header: "Số lượng phòng",
      key: "infoBooking",
      width: 300
    }, {
      header: "Check in",
      key: "checkIn",
      width: 300
    }, {
      header: "Check out",
      key: "checkOut",
      width: 300
    }, {
      header: "Trạng thái",
      key: "isPayment",
      width: 300
    }, {
      header: "Tổng giá phòng",
      key: "realPrice",
      width: 300
    }];
    filterOrderRooms.forEach(room => {
      worksheet.addRow({
        customerName: room.customerName,
        infoBooking: room.infoBooking.length,
        checkIn: room.checkIn,
        checkOut: room.checkOut,
        realPrice: room.realPrice,
        isPayment: room.isPayment === 0 ? "Chưa thanh toán" : "Đã thanh toán"
      });
    });
  }
  return workbook;
};
const generateExcelRoomByDate = async ({
  checkIn,
  checkOut
}) => {
  const dataArr = {};
  dataArr.checkIn = checkIn;
  dataArr.checkOut = checkOut;
  console.log(dataArr.checkIn + "-" + dataArr.checkOut);
  const bookingsOrder = await db.Orders.findOne({
    where: {
      checkIn: dataArr.checkIn,
      checkOut: dataArr.checkOut
    }
  });
  console.log(bookingsOrder);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Rooms");
  if (bookingsOrder) {
    worksheet.columns = [{
      header: "Tên phòng",
      key: "roomName",
      width: 300
    }, {
      header: "Loại phòng",
      key: "roomType",
      width: 300
    }, {
      header: "Số phòng",
      key: "roomNumber",
      width: 300
    }, {
      header: "Giá phòng",
      key: "price",
      width: 300
    }, {
      header: "Ngày đặt",
      key: "checkIn",
      width: 300
    }, {
      header: "Ngày trả phòng",
      key: "checkOut",
      width: 300
    }, {
      header: "Trạng thái",
      key: "availability",
      width: 300
    }];
    bookingsOrder.infoBooking.forEach(room => {
      worksheet.addRow({
        roomName: room.roomName,
        roomType: room.roomType,
        roomNumber: room.roomNumber,
        price: room.price,
        checkIn: dataArr.checkIn,
        checkOut: dataArr.checkOut,
        availability: room.availability === 0 ? "Chưa đặt" : "Đã đặt"
      });
    });
  }
  return workbook;
};
module.exports = {
  generateExcelData: generateExcelData,
  generateExcelRoomOrdersData: generateExcelRoomOrdersData,
  generateExcelRoomByDate: generateExcelRoomByDate
};