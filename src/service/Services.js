const db = require("../models/index");
const { Op } = require("sequelize");

const createService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const generateService = await db.Services.create({
        name: data.name,
      });

      resolve(generateService);
    } catch (error) {
      reject(error);
    }
  });
};

const getAllServices = ({ start, limit, sort, filter }) => {
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
        attributes: ["id", "name", "createdAt", "updatedAt"],
        where: whereClause,
        order,
      };

      if (start) {
        queryOptions.offset = parseInt(start, 10);
      }

      if (limit) {
        queryOptions.limit = parseInt(limit, 10);
      }

      const serviceList = await db.Services.findAndCountAll(queryOptions);

      resolve({
        data: serviceList.rows,
        count: serviceList.count,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteService = (serviceId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const objErr = {};

      const getServiceById = await db.Services.findOne({
        where: { id: serviceId },
      });

      if (!getServiceById) {
        (objErr.code = 1), (objErr.message = "service not found");
        resolve(objErr);
      }

      const isDeleteService = await db.Services.destroy({
        where: { id: serviceId },
      });

      if (isDeleteService) {
        resolve({
          code: 0,
          message: "Delete service success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateService = (serviceData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const getServiceById = await db.Services.findOne({
        where: {
          id: serviceData.id,
        },
        raw: false,
      });

      if (getServiceById) {
        getServiceById.name = serviceData.name;
        const newService = await getServiceById.save();
        resolve(newService);
      } else {
        resolve({
          code: 1,
          message: "Update Error",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllServices: getAllServices,
  createService: createService,
  deleteService: deleteService,
  updateService: updateService,
};
