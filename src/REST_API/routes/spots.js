var User = require("../models/user");
var Post = require("../models/post");
var Spot = require("../models/spot")


module.exports = function (router) {
    var spotRoute = router.route('/spots');

    spotRoute.get(async (req, res) => {
        const query = req.query; // Get the query parameters from the request

        const filter = {}; // Create an empty filter object
        const options = {}; // Create an empty options object
        if (query.where) {
            try {
                const filterObject = JSON.parse(query.where);
                Object.assign(filter, filterObject);
            } catch (err) {
                return res.status(400).json({ message: "Bad Request", data: "Invalid filter JSON" });
            }
        }

        options.limit = 100;
        if (query.limit) {
            const limit = parseInt(query.limit);
            if (!isNaN(limit)) {
                options.limit = limit;
            }
        }

        if (query.count === 'true') {
            Spot.countDocuments(filter, (err, count) => {
                if (err) {
                    res.status(500).json({ message: "Server Error", data: null });
                    return router;
                }
                res.status(200).json({ message: "OK", data: count });
                return router;
            });
        }
        else {
            Spot.find(filter, null, options, (err, spots) => {
                if (err) {
                    res.status(500).json({ message: "Server Error", data: null });
                    return router;
                }
                res.status(200).json({ message: "OK", data: spots });
                return router;
            });
        }
    });

    // POST a new spot
    spotRoute.post(async (req, res) => {
        var { name, province, city, description, pictures, link } = req.body;

        const newSpot = new Spot(req.body);
        await newSpot.save();
        res.status(201).json({ "message": "Created", "data": newSpot });
        return router;
    });

    return router;

}