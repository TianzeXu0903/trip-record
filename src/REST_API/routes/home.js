var secrets = require('../config/secrets');
var User = require('../models/user');

module.exports = function (router) {

    var homeRoute = router.route('/');
    homeRoute.get(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });

    return router;
}