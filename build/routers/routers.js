const express = require("express");
const roomController = require("../controllers/roomController");
const userController = require("../controllers/userController");
const serviceController = require("../controllers/serviceController");
const orderAndCancleController = require("../controllers/orderAndCancelController");
const router = express.Router();
const initConfigsRoutes = app => {
  // handle API Hotel Management
  // -------------------------------------------------------------
  router.post("/api/v1/login", userController.handleLogin);
  router.get("/api/v1/list-users", userController.handleGetAllUser);
  router.delete("/api/v1/delete-user", userController.handleDeleteUser);
  // -----------------------------------------------------------
  router.post("/api/v1/create-room", roomController.postCRUDRoom);
  router.get("/api/v1/list-room", roomController.getCRUDRoom);
  router.delete("/api/v1/delete-room", roomController.deleteCRUDRoom);
  router.put("/api/v1/update-room", roomController.updateCRUDRoom);
  router.get("/detail-room/:id", roomController.getDetailCRUDRoom);
  // ------------------------------------------------------------
  router.get("/api/v1/list-services", serviceController.handleGetAllService);
  router.post("/api/v1/create-service", serviceController.handleCreateService);
  router.delete("/api/v1/delete-service", serviceController.handleDeleteService);
  router.put("/api/v1/update-service", serviceController.handleUpdateService);
  router.get("/api/v1/list-orders", userController.handleGetAllOrderRooms);
  router.delete("/api/v1/delete-order", userController.handleDeleteOrderRoom);
  // ---------------------------------------------------------------
  router.get("/api/v1/export-excel", roomController.exportExcel);
  router.get("/api/v1/export-rooms-orders-excel", roomController.exportRoomOrdersExcel);
  router.get("/api/v1/export-rooms-by-date", roomController.exportRoomByDate);
  // handle API Hotel Application
  router.post("/api/v1/auth", userController.handleAuth);
  router.post("/api/v1/register", userController.handleRegister);
  router.post("/api/v1/verify-otp", userController.VerifyOTP);
  router.post("/api/v1/order-and-payment", orderAndCancleController.orderRoom);
  router.delete("/api/v1/cancel-and-refund", orderAndCancleController.cancelRoom);
  router.post("/api/v1/check-date", orderAndCancleController.checkDateIsBooked);
  router.post("/api/v1/insert-date", orderAndCancleController.handleInsertDate);
  router.post("/api/v1/get-rooms-order", orderAndCancleController.handleGetRoomsOrder);
  return app.use("/", router);
};
module.exports = initConfigsRoutes;