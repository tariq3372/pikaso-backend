const express = require('express');
const router = express.Router();
const userController = require("../../controllers/user.controller");
const validation = require("../../middlewares/validation.middleware");
const { check } = require('../../middlewares/check.middleware');
const { authenticateToken } = require('../../middlewares/authorization.middleware');

router.post('/register', validation.validateRegistrationApi, check, userController.register);
router.post('/verify', validation.validateVerifyOtpApi, check, userController.verifyOtp);
router.post('/resend', validation.validateResendOtpApi, check, userController.resendOtp);
router.post('/login', validation.validateLoginApi, check, userController.login);

// Forgot Password Flow
router.post('/forgot/password', validation.validateForgotPasswordApi, check, userController.forgotPassword);
router.post('/forgot/password/verify', validation.validateForgotPasswordVerifyOtpApi, check, userController.verifyForgotPasswordOtp);
router.post('/reset/password', validation.validateResetPasswordApi, check, userController.resetPassword);

// flag api for user data
router.get('/flag', authenticateToken, userController.userData);

// Buy Tries Flow
router.post('/buy-tries', authenticateToken, userController.buyTries);

// Image Generation flow
router.post('/image-generation', authenticateToken, validation.validateImageGenerationApi, check, userController.imageGeneration);
router.post('/beta-image-generation', validation.validateImageGenerationApi, check, userController.imageGenerationOneTime);

// Cart Flow
router.get('/cart', authenticateToken, userController.getCart);
router.post('/add-cart', authenticateToken, validation.validateAddToCartApi, check, userController.addToCart);
router.post('/update-cart', authenticateToken, validation.validateUpdateCartApi, check, userController.updateCart);
router.delete('/remove-cart/:_id', authenticateToken, validation.validaterRemoveCartApi, check, userController.removeCart);

// order flow
router.post('/make-order', authenticateToken, validation.validaterMakeOrderApi, check, userController.makeOrder);


module.exports = router;
