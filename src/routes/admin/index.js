const express = require('express');
const router = express.Router();
const adminController = require("../../controllers/admin.controller");
const { check } = require('../../middlewares/check.middleware');
const { authenticateToken } = require('../../middlewares/authorization.middleware');
const validation = require("../../middlewares/validation.middleware");

// router.post('/register', validation.validateRegisterAdminApi, check, adminController.addAdmin);
router.post('/login', validation.validateLoginAdminApi, check, adminController.login);
// router.post('/free-allotment', adminController.addFreeAllotment);
// router.post('/price', adminController.addPrice);
// router.post('/buy-allotment', adminController.addBuyAllotment);
router.get('/statistics', adminController.getStatistics);
router.get('/users', adminController.getAllUsers);
router.get('/orders', adminController.getAllOrders);

module.exports = router;
