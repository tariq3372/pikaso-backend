const { ROLE } = require("../constants");
const BuyAllotmentModel = require("../models/buyAllotment.model");
const FreeAllotment = require("../models/freeAllotment.model");
const HistoryModel = require("../models/history.model");
const OrderModel = require("../models/order.model");
const PriceModel = require("../models/price.model");
const UserModel = require("../models/user.model");
const UserBuyAllotment = require("../models/userBuyAllotment");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AdminModel = require("../models/admin.model");

// module.exports.addAdmin = async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword, avatar } = req.body;
//     if (password != confirmPassword) {
//       return res.status(400).send({
//         success: false,
//         message: "Password and Confirm Password is not same",
//         isPasswordMessage: true,
//       });
//     }
//     const salt = await bcrypt.genSalt(6);
//     const hash = await bcrypt.hash(password, salt);
//     // const { TOKEN_KEY } = process.env;
//     // const token = jwt.sign({ email, name }, TOKEN_KEY);
//     const data = {
//       name: name,
//       email: email,
//       password: hash,
//       avatar: avatar,
//       createdAt: new Date()
//     }
//     const admin = new AdminModel(data).save();
//     return res.status(200).send({
//       success: true,
//       message: "Account created successfully",
//     })
//   } catch (err) {
//     console.log("addAdmin catch error", err);
//     return res.status(500).send({
//       error: true,
//       message: "Internal server error",
//     });
//   }
// };

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email: email });
    if(admin) {
      const isValidPassword = await bcrypt.compare(password, admin?.password);
      if(isValidPassword) {
        const { TOKEN_KEY } = process.env;
        const token = jwt.sign({ email: admin?.email, name: admin?.name }, TOKEN_KEY, { expiresIn: "24h" });
        const updateAdmin = await AdminModel.findOneAndUpdate({ _id: admin?._id }, { token: token }, { new: true });
        if(updateAdmin) {
          return res.status(200).send({
            success: true,
            message: "successed",
            token: updateAdmin?.token
          })
        } else {
          return res.status(500).send({
            error: true,
            message: "Internal server error",
          });
        }
      } else {
        return res.status(400).send({
          success: false,
          message: "Incorrect Username or Password",
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "User Does Not Exists",
        isNotUserMessage: true,
      });
    }
  } catch(err) {
    console.log("login catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
}

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

// module.exports.addPrice = async (req, res) => {
//     try {
//         const { cost, ratio } = req.body;
//         const data = {
//             ratio: ratio,
//             cost: cost,
//             isDeleted: false,
//             createdAt: new Date()
//         }
//         const result = await PriceModel.create(data);
//         if (result) {
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
//         console.log("addPrice catch error", err);
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

module.exports.getStatistics = async (req, res) => {
  try {
    // TODO:
    // Get Counts
    // Get All Users
    // Get All Users who buy tries
    // Get All Orders
    const users = await UserModel.countDocuments({ isVerified: true });
    const orders = await OrderModel.countDocuments();
    const userBuyTries = await UserBuyAllotment.countDocuments();
    const totalGeneratedImages = await HistoryModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $size: "$images" } },
        },
      },
    ]);
    const totalImages =
      totalGeneratedImages.length > 0 ? totalGeneratedImages[0].total : 0;
    return res.status(200).send({
      success: true,
      users,
      orders,
      userBuyTries,
      totalImages,
    });
  } catch (err) {
    console.log("getStatistics catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const totalUsers = await UserModel.countDocuments({ isVerified: true });
    const users = await UserModel.find(
      { isVerified: true },
      {
        password: 0,
        dob: 0,
        country: 0,
        otp: 0,
        token: 0,
        freeAllotmentId: 0,
        freeAllotmentUsage: 0,
        modifiedAt: 0,
      }
    )
      .limit(Number(limit))
      .skip(Number(page) * Number(limit));
    return res.status(200).send({
      success: true,
      users,
      totalUsers,
    });
  } catch (err) {
    console.log("getAllUsers catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.getAllOrders = async (req, res) => {
  try {
    // status 0 = "All orders"
    // status 1 = "Pending orders"
    // status 2 = "Completed orders"
    const { status, limit, page } = req.query;
    let query = {};
    if (status != 0) {
      query.status =
        status == 1 ? "Pending" : status === 2 ? "Completed" : null;
    }
    const totalOrders = await OrderModel.countDocuments(query);
    const orders = await OrderModel.aggregate([
      { $match: query },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "carts",
          localField: "cartId",
          foreignField: "_id",
          as: "cart",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          cost: 1,
          status: 1,
          shipping: 1,
          createdAt: 1,
          "user.name": 1,
          "user.email": 1,
          "user.phoneNumber": 1,
          "cart.images": 1,
          "cart.quantity": 1,
          "cart.prompt": 1,
          "cart.ratio": 1,
        },
      },
      { $skip: Number(page) * Number(limit) },
      { $limit: Number(limit) },
    ]);
    return res.status(200).send({
      success: true,
      orders,
      totalOrders,
    });
  } catch (err) {
    console.log("getAllUsers catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};
