const db = require("../models/index");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);

const createUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    const hashPassword = await hashPasswordUser(data.password);
    try {
      await db.User.create({
        email: data.email,
        password: hashPassword,
        userName: data.userName,
      });

      resolve("New user is create success");
    } catch (err) {
      reject(err);
    }
  });
};

const hashPasswordUser = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hash = await bcrypt.hashSync(password, salt);
      resolve(hash);
    } catch (err) {
      reject(err);
    }
  });
};

const getUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.User.findAll({
        raw: true,
      });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

const getUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.User.findOne({
        where: {
          id: userId,
        },
        raw: true,
      });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (dataUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const getInfoUserById = await db.User.findOne({
        where: {
          id: dataUser.id,
        },
      });
      if (getInfoUserById) {
        (getInfoUserById.email = dataUser.email),
          (getInfoUserById.firstName = dataUser.firstName),
          (getInfoUserById.lastName = dataUser.lastName);
        await getInfoUserById.save();

        const allData = await db.User.findAll();
        resolve(allData);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const getUserbyIds = await db.User.findOne({
        where: {
          id: userId,
        },
      });

      if (getUserbyIds) {
        await getUserbyIds.destroy();
        resolve();
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser: createUser,
  getUser: getUser,
  getUserById: getUserById,
  updateUser: updateUser,
  deleteUser: deleteUser,
};
