var User = require("../models/user");
var Plan = require("../models/plan");

module.exports = function (router) {
  var planRoute = router.route("/plans");

  planRoute.get(async (req, res) => {
    const query = req.query; // Get the query parameters from the request

    const filter = {}; // Create an empty filter object
    const options = {}; // Create an empty options object
    if (query.where) {
      try {
        const filterObject = JSON.parse(query.where);
        Object.assign(filter, filterObject);
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Bad Request", data: "Invalid filter JSON" });
      }
    }

    options.limit = 100;
    // Limit the number of results (default: 100 for tasks and unlimited for users)
    if (query.limit) {
      const limit = parseInt(query.limit);
      if (!isNaN(limit)) {
        options.limit = limit;
      }
    }

    Plan.find(filter, null, options, (err, plans) => {
      if (err) {
        res.status(500).json({ message: "Server Error", data: null });
        return router;
      }
      res.status(200).json({ message: "OK", data: plans });
      return router;
    });
  });

  // POST a new plan
  planRoute.post(async (req, res) => {
    var { name, author, stops } = req.body;
    if (!author) {
      res
        .status(400)
        .json({ message: "Bad Request", data: "Author is required" });
      return router;
    }
    const newPlan = new Plan(req.body);
    try {
      var existingUser = await User.findById(author);
      if (!existingUser) {
        res
          .status(406)
          .json({ message: "Not Acceptable", data: "Author Not Found" });
        return router;
      }
    } catch (err) {
      res
        .status(406)
        .json({ message: "Not Acceptable", data: "Author Not Found" });
      return router;
    }
    await User.findByIdAndUpdate(author, {
      $push: { myPlans: newPlan._id },
    }).catch((err) => {
      console.log(err);
    });
    await newPlan.save();
    res.status(201).json({ message: "Created", data: newPlan });
    return router;
  });

  return router;
};
