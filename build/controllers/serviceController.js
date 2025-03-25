const serviceController = require("../service/Services");
const handleCreateService = async (req, res) => {
  const serviceData = await serviceController.createService(req.body);
  return res.status(200).json({
    id: serviceData.id,
    name: serviceData.name,
    createdAt: serviceData.createAt,
    updatedAt: serviceData.updatedAt
  });
};
const handleGetAllService = async (req, res) => {
  const {
    start,
    limit,
    sort,
    filter
  } = req.query;
  const serviceLists = await serviceController.getAllServices({
    start,
    limit,
    sort,
    filter
  });
  if (!serviceLists) {
    return res.status(500).json({
      code: 1,
      message: "serviceList is not found"
    });
  }
  return res.status(200).json({
    count: serviceLists.count,
    data: serviceLists.data
  });
};
const handleDeleteService = async (req, res) => {
  const serviceId = req.body.id;
  console.log(serviceId);
  const msg = await serviceController.deleteService(serviceId);
  console.log(msg);
  if (!serviceId) {
    return res.status(400).json({
      code: 1,
      message: "Service not found"
    });
  }
  return res.status(200).json(msg);
};
const handleUpdateService = async (req, res) => {
  const serviceData = req.body;
  const updateServiceData = await serviceController.updateService(serviceData);
  console.log(updateServiceData);
  return res.status(200).json({
    name: updateServiceData.name
  });
};
module.exports = {
  handleCreateService: handleCreateService,
  handleGetAllService: handleGetAllService,
  handleDeleteService: handleDeleteService,
  handleUpdateService: handleUpdateService
};