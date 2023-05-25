const BuyAllotmentModel = require('../models/buyAllotment.model');
const FreeAllotment = require('../models/freeAllotment.model');
const SettingModel = require('../models/setting.model');

// module.exports.addFreeAllotment = async (req, res) => {
//     try {
//         const data = {
//             limit: 3,
//             createdAt: new Date()
//         }
//         const result = await FreeAllotment.create(data)
//         return res.status(200).send({
//             success: true,
//             message: "FreeAllotment Added Successfully",
//             data: result
//         })
//     }
//     catch (err) {
//         console.log("addFreeAllotment catch error", err);
//         return res.status(500).send({
//             error: true,
//             message: "Internal server error"
//         })
//     }
// }

// module.exports.addSetting = async (req, res) => {
//     try {
//         const { cost, ratio } = req.body;
//         const data = {
//             ratio: ratio,
//             cost: cost,
//             isDeleted: false,
//             createdAt: new Date()
//         }
//         const setting = await SettingModel.create(data);
//         if (setting) {
//             return res.status(200).send({
//                 message: "sucessfully added",
//                 success: true
//             })
//         } else {
//             return res.status(500).send({
//                 message: "Internal server error",
//                 error: true
//             })
//         }

//     } catch (err) {
//         console.log("addSetting catch error", err);
//         return res.status(500).send({
//             error: true,
//             message: "Internal server error"
//         })
//     }
// }

// module.exports.addBuyAllotment = async (req, res) => {
//     try {
//         const { limit } = req.body;
//         const data = {
//             limit: limit,
//             isDeleted: false,
//             createdAt: new Date(),
//             modifiedAt: new Date()
//         }
//         const buyAllotment = await BuyAllotmentModel.findOneAndUpdate({ isDeleted: false }, { isDeleted: true }, { new: true });
//         const newBuyAllotment = await BuyAllotmentModel.create(data);
//         return res.status(200).send({
//             success: true,
//             message: "New Limit Added Successfully"
//         })
       
//     } catch(err) {
//         console.log("addBuyAllotment catch error", err);
//         return res.status(500).send({
//             error: true,
//             message: "Internal server error"
//         })
//     }
// }