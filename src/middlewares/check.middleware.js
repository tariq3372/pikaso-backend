const { validationResult } = require('express-validator');
module.exports.check = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                message: "Parameters Invalid",
                // errors
            })
        }
        else {
            next()
        }
    }
    catch(err) {
        console.log("check internal server error", err);
        return res.status(500).send({
            error: true,
            message: "Internal Server Error"
        })
    }
}
