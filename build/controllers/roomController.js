const CRUDRoom = require("../service/Rooms");
const excelService = require("../service/ExportExcel");
const postCRUDRoom = async (req, res) => {
  const roomItemData = await CRUDRoom.createRoom(req.body);
  console.log(roomItemData);
  return res.status(200).json({
    roomType: roomItemData.roomType,
    roomNumber: roomItemData.roomNumber,
    price: roomItemData.price,
    availability: roomItemData.availability,
    services: roomItemData.services,
    imageRoom: roomItemData.imageRoom,
    optionGuestAndChildNumber: roomItemData.optionGuestAndChildNumber,
    roomName: roomItemData.roomName,
    roomEveduate: roomItemData.roomEveduate,
    checkIn: roomItemData.checkIn,
    checkOut: roomItemData.checkOut,
    isStayed: roomItemData.isStayed,
    isCheckOut: roomItemData.isCheckOut,
    monthCheckIn: roomItemData.monthCheckIn,
    monthCheckOut: roomItemData.monthCheckOut
  });
};
const getCRUDRoom = async (req, res) => {
  const {
    start,
    limit,
    sort,
    filter
  } = req.query;
  const roomLists = await CRUDRoom.getAllRoom({
    start,
    limit,
    sort,
    filter
  });
  if (!roomLists) {
    return res.status(500).json({
      code: 1,
      message: "roomList is not found"
    });
  }
  return res.status(200).json({
    count: roomLists.count,
    data: roomLists.data
  });
};
const deleteCRUDRoom = async (req, res) => {
  const roomId = req.body.id;
  const msg = await CRUDRoom.deleteRoom(roomId);
  if (!roomId) {
    return res.status(400).json({
      code: 1,
      message: "Room not found"
    });
  }
  return res.status(200).json(msg);
};
const updateCRUDRoom = async (req, res) => {
  const roomData = req.body;
  const updateRoomData = await CRUDRoom.updateRoom(roomData);
  console.log(updateRoomData);
  return res.status(200).json({
    roomType: updateRoomData.roomType,
    roomNumber: updateRoomData.roomNumber,
    price: updateRoomData.price,
    availability: updateRoomData.availability,
    services: updateRoomData.services,
    imageRoom: updateRoomData.imageRoom,
    optionGuestAndChildNumber: updateRoomData.optionGuestAndChildNumber,
    roomName: updateRoomData.roomName,
    roomEveduate: updateRoomData.roomEveduate,
    isStayed: updateRoomData.isStayed,
    isCheckOut: updateRoomData.isCheckOut,
    monthCheckIn: updateRoomData.monthCheckIn,
    monthCheckOut: updateRoomData.monthCheckOut
  });
};
const getDetailCRUDRoom = async (req, res) => {
  const roomDetailIds = req.params.id;
  if (roomDetailIds) {
    const roomDetail = await CRUDRoom.getDetailRoom(roomDetailIds);
    return res.status(200).json(roomDetail);
  } else {
    const roomDetail = await CRUDRoom.getDetailRoom(roomDetailIds);
    return res.status(400).json({
      code: roomDetail.code,
      message: roomDetail.message
    });
  }
};
const exportExcel = async (req, res) => {
  try {
    const {
      fileName,
      filter
    } = req.query;
    const workbook = await excelService.generateExcelData(filter);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const exportRoomOrdersExcel = async (req, res) => {
  try {
    const {
      fileName,
      filter
    } = req.query;
    const workbook = await excelService.generateExcelRoomOrdersData(filter);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const exportRoomByDate = async (req, res) => {
  try {
    const {
      fileName,
      checkIn,
      checkOut
    } = req.query;
    const workbook = await excelService.generateExcelRoomByDate({
      checkIn,
      checkOut
    });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  postCRUDRoom: postCRUDRoom,
  getCRUDRoom: getCRUDRoom,
  deleteCRUDRoom: deleteCRUDRoom,
  updateCRUDRoom: updateCRUDRoom,
  getDetailCRUDRoom: getDetailCRUDRoom,
  exportExcel: exportExcel,
  exportRoomOrdersExcel: exportRoomOrdersExcel,
  exportRoomByDate: exportRoomByDate
};