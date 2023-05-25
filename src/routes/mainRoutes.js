const { API_V1, USER, ADMIN } = require('../constants');
const user = require('./user')
const admin = require('./admin')

module.exports = (app) => {
    app.use(`${API_V1}${USER}`, user);
    app.use(`${API_V1}${ADMIN}`, admin);
}