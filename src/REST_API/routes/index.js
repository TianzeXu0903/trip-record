/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));
    app.use("/api/users", require("./users.js")(router));
    app.use("/api/tasks", require("./posts.js")(router));
    app.use("/api/plans", require("./plans.js")(router));
    app.use("/api/spots", require("./spots.js")(router));
    app.use("/api/login", require("./login.js")(router));
    app.use("/api/users/:id", require("./userId.js")(router));
    app.use("/api/posts/:id", require("./postId.js")(router));
    app.use("/api/plans/:id", require("./planId.js")(router));
    app.use("/api/spots/:id", require("./spotId.js")(router));
};