var User = require("../models/user");

module.exports = function (router) {
  var userValidationRoute = router.route("/login");
  // GET all users

  //Validate if Login account existed.
  userValidationRoute.post(async (req, res) => {
    console.log("success");
    var { email, password } = req.body;
    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      return res.status(404).json({ message: "The user is not existed" });
    }
    if (email === existedUser.email && password === existedUser.password) {
      res
        .status(200)
        .json({ message: "Sign In Successfully", data: existedUser });
    } else {
      res.status(401).json({ message: "The password is wrong" });
    }

    return router;
  });

  return router;
};
