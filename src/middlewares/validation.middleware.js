const { check, body  } = require('express-validator');
const EMAIL = check('email').notEmpty().exists().trim().isEmail().withMessage("Wrong Email");
const PASSWORD = check('password').notEmpty().exists().trim().isLength({ min: 6 }).withMessage("Wrong Password");
const CONFIRM_PASSWORD = check('confirmPassword').notEmpty().exists().trim().isLength({ min: 6 }).withMessage("Wrong Password");
const OTP = check('otp').notEmpty().exists().trim().isLength({ min: 4 }).withMessage("Wrong OTP");
const PROMPT = check('prompt').notEmpty().exists().trim().withMessage("Wrong prompt");
const RATIO = check('ratio').notEmpty().exists().trim().withMessage("Wrong ratio");
const NUMBER_OF_IMAGES = check('numberOfImages').notEmpty().exists().trim().withMessage("Wrong number of images");
const QUANTITY = check('quantity').notEmpty().exists().trim().withMessage("Wrong quantity");
const IMAGE_LINK = check('imageLink').notEmpty().exists().trim().withMessage("Wrong image link");
const CART_ID = check('cartId').notEmpty().exists().trim().isMongoId().withMessage("Wrong id");
const ID = check('_id').notEmpty().exists().trim().isMongoId().withMessage("Wrong id");
const IDS = check('ids').isArray({ min: 1 });
const MONGO_ID = check('ids.*').not().isArray().isMongoId().withMessage("Wrong id");
const NAME = check('name').notEmpty().exists().trim().withMessage("Wrong name");
const AVATAR = check('avatar').notEmpty().exists().trim().withMessage("Wrong avatar");

module.exports.validateRegistrationApi = [
    EMAIL,
    PASSWORD,
    CONFIRM_PASSWORD
]

module.exports.validateVerifyOtpApi = [
    EMAIL,
    OTP
]

module.exports.validateResendOtpApi = [
    EMAIL
]

module.exports.validateLoginApi = [
    EMAIL, 
    PASSWORD
]

module.exports.validateForgotPasswordApi = [
    EMAIL
]

module.exports.validateForgotPasswordVerifyOtpApi = [
    EMAIL,
    OTP
]

module.exports.validateResetPasswordApi = [
    EMAIL,
    OTP,
    PASSWORD,
    CONFIRM_PASSWORD
]

module.exports.validateImageGenerationApi = [
    PROMPT,
    RATIO,
    NUMBER_OF_IMAGES,
]

module.exports.validateAddToCartApi = [
    PROMPT,
    RATIO,
    QUANTITY,
    IMAGE_LINK
]

module.exports.validateUpdateCartApi = [
    CART_ID,
    RATIO,
    QUANTITY,
]

module.exports.validaterRemoveCartApi = [
    ID
]

module.exports.validaterMakeOrderApi = [
    IDS,
    MONGO_ID
]

module.exports.validateRegisterAdminApi = [
    NAME,
    EMAIL,
    PASSWORD,
    CONFIRM_PASSWORD,
    AVATAR
]

module.exports.validateLoginAdminApi = [
    EMAIL,
    PASSWORD,
]