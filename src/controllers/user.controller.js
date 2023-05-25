const { ROLE } = require("../constants");
const { generateOtp, sendMail } = require("../helper");
const FreeAllotmentModel = require("../models/freeAllotment.model");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HistoryModel = require("../models/history.model");
const CartModel = require("../models/cart.model");
const SettingModel = require("../models/setting.model");
const { generateImageApi } = require("../api");
const { Types } = require("mongoose");
const orderModel = require("../models/order.model");
const BuyAllotmentModel = require("../models/buyAllotment.model");
const UserBuyAllotment = require("../models/userBuyAllotment");

module.exports.register = async (req, res) => {
  try {
    // TODO:
    // 1 Check if user already exists
    // 2 Check if password and confirm password is same
    // 3 Generate otp send and send to user email
    // 4 Get the free allotment id from collection
    // 5 Bcrypt and salt the password
    // 6 Set the data and store

    const { email, password, confirmPassword } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists?.isVerified === true) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
        isEmailExistsMessage: true,
      });
    }
    if (password != confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Password and Confirm Password is not same",
        isPasswordMessage: true,
      });
    }
    const otp = generateOtp();
    const params = {
      to: email,
      otp: otp,
    };
    const sendEmail = await sendMail(params);
    const freeAllotment = await FreeAllotmentModel.findOne();
    const salt = await bcrypt.genSalt(6);
    const hash = await bcrypt.hash(password, salt);
    const data = {
      email,
      otp,
      password: hash,
      freeAllotmentId: freeAllotment?._id,
      freeAllotmentUsage: 0,
      isVerified: false,
      createdAt: new Date(),
    };
    const user = await User.findOneAndUpdate({ email: email }, data, {
      upsert: true,
      new: true,
    });
    return res.status(200).send({
      success: true,
      message: "Registration Done Successfully",
    });
  } catch (err) {
    console.log("register catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.verifyOtp = async (req, res) => {
  try {
    // TODO:
    // 1 Get the user data from db
    // 2 Check if otp matches
    // 3 Generate jwt token
    // 4 set data and update the user data in db
    const { email, otp } = req.body;
    const { TOKEN_KEY } = process.env;
    const user = await User.findOne({ email: email });
    if (user) {
      if (otp === user?.otp) {
        const token = jwt.sign({ email: email, role: ROLE.USER }, TOKEN_KEY, {
          expiresIn: "24h",
        });
        const updatedUser = await User.findOneAndUpdate(
          { email },
          { token: token, isVerified: true, modifiedAt: new Date() },
          { new: true }
        );
        return res.status(200).send({
          success: true,
          message: "User Verified",
          token: updatedUser?.token,
          email: updatedUser?.email,
          isVerified: updatedUser?.isVerified,
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "Invalid otp",
          isOtpMessage: true,
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "User Does Not Exists",
        isNotUserMessage: true,
      });
    }
  } catch (err) {
    console.log("verifyOtp catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.resendOtp = async (req, res) => {
  try {
    // TODO:
    // 1 Generate otp
    // 2 send to user email
    // 3 update user data in db

    const { email } = req.body;
    const otp = generateOtp();
    const user = await User.findOneAndUpdate(
      { email },
      { otp: otp, modifiedAt: new Date() }
    );
    if (user) {
      const params = {
        to: email,
        otp: otp,
      };
      const sendEmail = await sendMail(params);
      if (sendEmail) {
        return res.status(200).send({
          success: true,
          message: "Otp Send Successfully",
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "Service Unavailable",
          isEmailServiceMessage: true,
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "User Does Not Exists",
        isNotUserMessage: true,
      });
    }
  } catch (err) {
    console.log("resendOtp catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    // TODO:
    // 1 Get the user from db
    // 2 Compare the user password
    // 3 Generate token
    // 4 Update user db
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        const { TOKEN_KEY } = process.env;
        const token = jwt.sign({ email: email, role: ROLE.USER }, TOKEN_KEY, {
          expiresIn: "24h",
        });
        const updatedUser = await User.findOneAndUpdate(
          { email },
          { token: token, modifiedAt: new Date() },
          { new: true }
        );
        return res.status(200).send({
          success: true,
          message: "Login successfully",
          token: updatedUser.token,
          isVerified: updatedUser.isVerified,
          freeAllotmentUsage: updatedUser.freeAllotmentUsage,
          email: updatedUser.email,
        });
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
  } catch (err) {
    console.log("login catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

// Forgot Password Flow Starts
module.exports.forgotPassword = async (req, res) => {
  try {
    // TODO:
    // 1 Generate otp
    // 2 send to user email
    // 3 update user data in db

    const { email } = req.body;
    const otp = generateOtp();
    const user = await User.findOneAndUpdate(
      { email },
      { otp: otp, modifiedAt: new Date() }
    );
    if (user) {
      const params = {
        to: email,
        otp: otp,
      };
      const sendEmail = await sendMail(params);
      if (sendEmail) {
        return res.status(200).send({
          success: true,
          message: "Otp Send Successfully",
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "Service Unavailable",
          isEmailServiceMessage: true,
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "User Does Not Exists",
        isNotUserMessage: true,
      });
    }
  } catch (err) {
    console.log("forgotPassword catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    //TODO:
    // 1 Get user data
    // 2 Verify otp
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      if (otp === user?.otp) {
        return res.status(200).send({
          success: true,
          message: "Otp Verified",
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "Invalid otp",
          isOtpMessage: true,
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "User Does Not Exists",
        isNotUserMessage: true,
      });
    }
  } catch (err) {
    console.log("verifyForgotPasswordOtp catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    // TODO:
    // Check if user exists
    // Match both password
    // Generate token
    // Update db
    const { email, otp, password, confirmPassword } = req.body;
    const user = await User.findOne({ email: email, otp: otp });
    if (user) {
      if (password === confirmPassword) {
        const { TOKEN_KEY } = process.env;
        const token = jwt.sign({ email: email, role: ROLE.USER }, TOKEN_KEY, {
          expiresIn: "24h",
        });
        const updatedUser = await User.findOneAndUpdate(
          { _id: user?._id },
          { token: token, modifiedAt: new Date(), isVerified: true },
          { new: true }
        );
        return res.status(200).send({
          success: true,
          message: "Successed",
          data: {
            email: updatedUser?.email,
            token: updatedUser?.token,
            isVerified: updatedUser.isVerified,
          },
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "Password and Confirm Password is not same",
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "User Does Not Exists",
        isNotUserMessage: true,
      });
    }
  } catch (err) {
    console.log("resetPassword catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.userData = async (req, res) => {
  try {
    // fing how many carts user have with pending status
    const { token } = req.app.locals;
    if (token) {
      const user = await User.findOne({ token });
      if (user) {
        const carts = await CartModel.countDocuments({
          userId: user?._id,
          status: "Pending",
        });
        return res.status(200).send({
          success: true,
          carts,
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "User Does Not Exists",
          isNotUserMessage: true,
        });
      }
    } else {
      return res.status(403).send({
        success: false,
        message: "Not Authorized",
      });
    }
  } catch (err) {
    console.log("userData catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.buyTries = async (req, res) => {
  try {
    const { token } = req.app.locals;
    if(token) {
      const user = await User.findOne({ token: token });
      if(user) {
        const userBuyAllotment = await UserBuyAllotment.findOneAndUpdate({ userId: user._id, isCompleted: false }, { isCompleted: true });
        const buyAllotmentModel = await BuyAllotmentModel.findOne({ isDeleted: false });
        const data = {
          userId: user?._id,
          buyAllotmentId: buyAllotmentModel?._id,
          buyAllotmentUsage: 0,
          isCompleted: false,
          createdAt: new Date(),
          modifiedAt: new Date()
        }
        const newUserBuyAllotment = await UserBuyAllotment.create(data);
        return res.status(200).send({
          success: true,
          message: "Internal server error"
        })
      } else {
        return res.status(400).send({
          success: false,
          message: "User Does Not Exists",
          isNotUserMessage: true,
        });
      }
    } else {
      return res.status(403).send({
        success: false,
        message: "Not Authorized",
      });
    }
  } catch (error) {
    console.log("buyTries catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
}

// Generation Flow
module.exports.imageGeneration = async (req, res) => {
  try {
    // TODO:
    // 1- Get user
    // 2- Check usage
    // 3- Update User data
    const { prompt, ratio, numberOfImages, style } = req.body;
    const { token } = req.app.locals;
    if (token) {
      const user = await User.findOne({ token: token });
      if (user) {
        const freeAllotment = await FreeAllotmentModel.findOne();
        const buyAllotment = await BuyAllotmentModel.findOne({
          isDeleted: false,
        });
        const userBuyAllotment = await UserBuyAllotment.findOne({
          userId: user?._id,
          isCompleted: false,
        });

        if (!freeAllotment || !buyAllotment) {
          console.log("freeAllotment Or BuyAllotment DB Issue");
          return res.status(500).send({
            error: true,
            message: "Internal Server Error",
          });
        }

        if (
          freeAllotment?.limit > user?.freeAllotmentUsage ||
          buyAllotment?.limit > userBuyAllotment?.buyAllotmentUsage
        ) {
          let userUpdate;
          let userBuyAllotmentUpdate;
          if (freeAllotment.limit > user?.freeAllotmentUsage) {
            userUpdate = await User.findOneAndUpdate(
              { _id: user?._id },
              {
                freeAllotmentUsage: user?.freeAllotmentUsage + 1,
                modifiedAt: new Date(),
              },
              { new: true }
            );
          } else if (
            buyAllotment?.limit > userBuyAllotment?.buyAllotmentUsage
          ) {
            userBuyAllotmentUpdate = await UserBuyAllotment.findOneAndUpdate(
              { userId: user?._id, isCompleted: false },
              {
                buyAllotmentUsage: userBuyAllotment?.buyAllotmentUsage + 1,
                modifiedAt: new Date(),
              },
              { new: true }
            );
          }
          const setting = await SettingModel.findOne({
            isDeleted: false,
            ratio: ratio,
          });
          if (setting) {
            let data;
            // TODO:
            // Call Araby.ai api's here
            try {
              // const result = await generateImageApi(
              //   prompt,
              //   ratio,
              //   numberOfImages,
              //   style
              // );
              data = {
                prompt: prompt,
                ratio: ratio,
                // images: result.data.urls,
                images: [
                  "https://arabai-images.s3.me-south-1.amazonaws.com/202305-1712-1110-33f0ab99-19e5-421c-9cc4-2b08cd3902de_1684311070.jpeg",
                  "https://arabai-images.s3.me-south-1.amazonaws.com/202305-1712-1111-19b340b5-523f-4af3-8b4f-0221ec18d213_1684311071.jpeg",
                  "https://arabai-images.s3.me-south-1.amazonaws.com/202305-1712-1112-3bfb903d-9ab3-4d20-84ce-19c46f48ecce_1684311072.jpeg",
                  "https://arabai-images.s3.me-south-1.amazonaws.com/202305-1712-1113-0b84828f-9dc6-4401-aa23-b121c2c9884d_1684311073.jpeg",
                ],
                userId: user?._id,
                createdAt: new Date(),
              };
              if (userUpdate) {
                data.freeAllotmentUsage = userUpdate?.freeAllotmentUsage;
                data.freeAllotmentLimit = freeAllotment?.limit;
              } else if (userBuyAllotmentUpdate) {
                data.userBuyAllotmentUsage =
                  userBuyAllotmentUpdate?.buyAllotmentUsage;
                data.buyAllotmentLimit = buyAllotment?.limit;
              }
            } catch (err) {
              console.log("error araby ai api", err);
              return res.status(500).send({
                message: "Internal server error",
                hint: "external",
                error: true,
              });
            }

            const history = await HistoryModel.create(data);
            data.cost = setting?.cost;
            return res.status(200).send({
              success: true,
              data,
            });
          } else {
            return res.status(500).send({
              message: "Internal server error setting model",
              error: true,
            });
          }
        } else {
          return res.status(405).send({
            success: false,
            message: "Action Not Allowed",
          });
        }
      } else {
        return res.status(400).send({
          success: false,
          message: "User Does Not Exists",
          isNotUserMessage: true,
        });
      }
    } else {
      return res.status(403).send({
        success: false,
        message: "Not Authorized",
      });
    }
  } catch (err) {
    console.log("imageGeneration catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.imageGenerationOneTime = async (req, res) => {
  try {
    const { prompt, ratio, numberOfImages, style } = req.body;
    const data = {
      prompt: prompt,
      ratio: ratio,
      images:"https://arabai-images.s3.me-south-1.amazonaws.com/202305-1712-1112-3bfb903d-9ab3-4d20-84ce-19c46f48ecce_1684311072.jpeg",
      createdAt: new Date(),
    };
    return res.status(200).send({
      success: true,
      data
    })
  } catch (err) {
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
}

// Cart Flow
module.exports.getCart = async (req, res) => {
  try {
    const { token } = req.app.locals;
    if (token) {
      const user = await User.findOne({ token: token });
      if (user) {
        const allCart = await CartModel.aggregate([
          {
            $match: { userId: user?._id, status: "Pending" },
          },
          {
            $group: {
              _id: null,
              userId: { $first: "$userId" },
              costPerQuantity: { $first: "$costPerQuantity" },
              quantity: { $first: "$quantity" },
              status: { $first: "$status" },
              prompt: { $first: "$prompt" },
              ratio: { $first: "$ratio" },
              images: { $first: "$images" },
              createdAt: { $first: "$createdAt" },
              totalCost: { $sum: "$cost" },
              items: { $push: "$$ROOT" },
            },
          },
          {
            $project: {
              totalCost: { $round: ["$totalCost", 2] },
              items: 1,
            },
          },
        ]);
        return res.status(200).send({
          success: true,
          message: "succeed",
          allCart,
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "User does not exist",
          isNotUserMessage: true,
        });
      }
    } else {
      return res.status(403).send({
        success: false,
        message: "Not Authorized",
      });
    }
  } catch (err) {
    console.log("updateCart catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.addToCart = async (req, res) => {
  try {
    const { quantity, prompt, imageLink, ratio } = req.body;
    const { token } = req.app.locals;
    if (token) {
      const user = await User.findOne({ token: token });
      if (user) {
        const setting = await SettingModel.findOne({
          isDeleted: false,
          ratio: ratio,
        });
        if (setting) {
          const data = {
            userId: user?._id,
            cost: Number((quantity * setting?.cost).toFixed(2)),
            costPerQuantity: Number((setting?.cost).toFixed(2)),
            quantity: quantity,
            status: "Pending",
            prompt: prompt,
            ratio: ratio,
            images: imageLink,
            createdAt: new Date(),
          };
          const cart = await CartModel.create(data);
          if (cart) {
            return res.status(200).send({
              success: true,
              message: "Added Successfully",
            });
          } else {
            return res.status(500).send({
              message: "Internal server error setting model",
              error: true,
            });
          }
        } else {
          return res.status(500).send({
            message: "Internal server error setting model",
            error: true,
          });
        }
      } else {
        return res.status(400).send({
          success: false,
          message: "User does not exist",
          isNotUserMessage: true,
        });
      }
    } else {
      return res.status(403).send({
        success: false,
        message: "Not Authorized",
      });
    }
  } catch (err) {
    console.log("addToCart catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.updateCart = async (req, res) => {
  try {
    const { cartId, quantity, ratio } = req.body;
    const setting = await SettingModel.findOne({
      isDeleted: false,
      ratio: ratio,
    });
    if (setting) {
      const newCost = Number((quantity * setting?.cost).toFixed(2));
      const cart = await CartModel.findOneAndUpdate(
        { _id: cartId },
        { cost: newCost, quantity: quantity, costPerQuantity: setting?.cost },
        { new: true }
      );
      if (cart) {
        return res.status(200).send({
          success: true,
          message: "cart updated Successfully",
        });
      } else {
        return res.status(500).send({
          message: "Internal Server Error",
          error: true,
        });
      }
    } else {
      return res.status(500).send({
        message: "Internal server error setting model",
        error: true,
      });
    }
  } catch (err) {
    console.log("updateCart catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports.removeCart = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log("_id", _id);
    const cart = await CartModel.deleteOne({ _id: _id });
    if (cart.deletedCount === 1) {
      return res.status(200).send({
        message: "cart deleted successfully",
        success: true,
      });
    } else {
      return res.status(500).send({
        error: true,
        message: "Internal server error",
      });
    }
  } catch (err) {
    console.log("removeCart catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

// Order Flow
module.exports.makeOrder = async (req, res) => {
  try {
    //TODO:
    // get cart id from user
    // find the carts where cart id and status is pending
    // create order and then update all cart for that user
    const { ids } = req.body;
    const convertedIds = ids.map((id) => new Types.ObjectId(id));
    const carts = await CartModel.aggregate([
      {
        $match: { _id: { $in: convertedIds }, status: "Pending" },
      },
      {
        $group: {
          _id: "null",
          userId: { $first: "$userId" },
          costPerQuantity: { $first: "$costPerQuantity" },
          quantity: { $first: "$quantity" },
          status: { $first: "$status" },
          prompt: { $first: "$prompt" },
          ratio: { $first: "$ratio" },
          images: { $first: "$images" },
          createdAt: { $first: "$createdAt" },
          totalCost: { $sum: "$cost" },
          items: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          totalCost: { $round: ["$totalCost", 2] },
          items: 1,
        },
      },
    ]);
    if (carts?.length) {
      const updatedCart = await CartModel.updateMany(
        { _id: convertedIds, status: "Pending" },
        { status: "Completed" }
      );
      if (updatedCart?.modifiedCount > 0) {
        const data = {
          userId: carts[0]?.items[0]?.userId,
          cost: carts[0]?.totalCost,
          cartId: carts[0]?.items?.map((item) => item?._id),
          status: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const order = await orderModel.create(data);
        if (order) {
          return res.status(200).send({
            success: true,
            message: "Order created successfully",
          });
        } else {
          return res.status(500).send({
            error: true,
            message: "Order not completed",
          });
        }
      } else {
        return res.status(500).send({
          error: true,
          message: "Cart is not updated",
        });
      }
    } else {
      return res.status(500).send({
        error: true,
        message: "There is no carts",
      });
    }
  } catch (err) {
    console.log("makeOrder catch error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};
