const userService = require("../service/Users");
// Admin
const handleLogin = async (req, res) => {
  const password = req.body.password;
  const userName = req.body.userName;
  if (!password) {
    return res.status(400).json({
      code: "0",
      message: "User or password not empty"
    });
  }
  const getUserResponse = await userService.handleCheckLogin(password, userName);
  if (getUserResponse.message === "Wrong password") {
    return res.status(400).json({
      code: getUserResponse.code,
      message: getUserResponse.message,
      success: getUserResponse.success
    });
  } else if (getUserResponse.message === "User not found") {
    return res.status(400).json({
      code: getUserResponse.code,
      message: getUserResponse.message,
      success: getUserResponse.success
    });
  }
  return res.status(200).json({
    success: getUserResponse.success,
    user: getUserResponse.info
  });
};
const handleGetAllUser = async (req, res) => {
  const {
    start,
    limit,
    sort,
    filter
  } = req.query;
  const userLists = await userService.getAllUser({
    start,
    limit,
    sort,
    filter
  });
  if (!userLists) {
    return res.status(500).json({
      code: 1,
      message: "userLists is not found"
    });
  }
  return res.status(200).json({
    count: userLists.count,
    data: userLists.data
  });
};
const handleDeleteUser = async (req, res) => {
  const userId = req.body.id;
  const msg = await userService.deleteUser(userId);
  if (!userId) {
    return res.status(400).json({
      code: 1,
      message: "user not found"
    });
  }
  return res.status(200).json(msg);
};
const handleGetAllOrderRooms = async (req, res) => {
  const {
    start,
    limit,
    sort,
    filter
  } = req.query;
  const orderRoomsData = await userService.getAllOrderRooms({
    start,
    limit,
    sort,
    filter
  });
  if (!orderRoomsData) {
    return res.status(500).json({
      code: 1,
      message: "orderRoomsData is not found"
    });
  }
  return res.status(200).json({
    count: orderRoomsData.count,
    data: orderRoomsData.data
  });
};
const handleDeleteOrderRoom = async (req, res) => {
  const orderId = req.body.id;
  const msg = await userService.deleteOrderRooms(orderId);
  if (!orderId) {
    return res.status(400).json({
      code: 1,
      message: "order not found"
    });
  }
  return res.status(200).json(msg);
};

// Hotel Application
const handleAuth = async (req, res) => {
  const {
    userName,
    password
  } = req.body;
  const user = await userService.handleCheckAuth({
    userName,
    password
  });
  if (user.success == false) {
    return res.status(400).json({
      message: user.msg
    });
  }
  return res.status(200).json({
    success: user.success,
    user: user.info
  });
};
const handleRegister = async (req, res) => {
  const {
    phoneNumber,
    userName,
    password,
    cityOfCustomer,
    regionOfCustomer,
    addressCustomer,
    identityCustomer
  } = req.body;

  // check phone existing
  const existingUser = await userService.checkPhoneExists(phoneNumber);
  if (existingUser) {
    return res.status(400).json({
      message: "Số điện thoại đã được sử dụng"
    });
  }

  // create new user
  try {
    const user = await userService.handleCheckRegister({
      phoneNumber,
      userName,
      password,
      cityOfCustomer,
      regionOfCustomer,
      addressCustomer,
      identityCustomer
    });
    console.log(user);
    return res.status(200).json({
      success: true,
      user
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
};
const VerifyOTP = async (req, res) => {
  const {
    otpCode
  } = req.body;
  const isOTPVerified = await userService.handleVerifyOTP(otpCode);
  if (!isOTPVerified) {
    return res.status(400).json({
      message: "Mã OTP không hợp lệ"
    });
  }
  return res.status(200).json({
    message: "Xác thực OTP thành công"
  });
};
module.exports = {
  handleLogin: handleLogin,
  handleRegister: handleRegister,
  VerifyOTP: VerifyOTP,
  handleAuth: handleAuth,
  // -------------------------
  handleGetAllUser: handleGetAllUser,
  handleDeleteUser: handleDeleteUser,
  handleDeleteOrderRoom: handleDeleteOrderRoom,
  handleGetAllOrderRooms: handleGetAllOrderRooms
};