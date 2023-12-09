var User = require('../models/user');
var Post = require('../models/post');


module.exports = function (router) {
    var userRoute = router.route('/users/:id');
    userRoute.get(async (req, res) => {
        const query = req.query; // Get the query parameters from the request

        const filter = {}; // Create an empty filter object
        const options = {};
        if (query.where) {
            try {
                const user = await User.findById(req.params.id);
                if (!user) {
                    res.status(404).json({ message: "Not Found", data: null });
                    return router;
                }
                const filterObject = JSON.parse(query.where);
                Object.assign(filter, filterObject);
                if (filterObject.province) {
                    const searchString = filterObject.province;
                    const provinceData = user.myTravelHistory.find(entry => entry.province === searchString);
                    const provincePictures = provinceData.pictures;
                    res.status(200).json({ message: "OK", data: provincePictures });
                }
            }
            catch (err) {
                res.status(404).json({ message: "Not Found", data: null });
                return router;
            }
        }
        else {
            try {
                const user = await User.findById(req.params.id);
                if (!user) {
                    res.status(404).json({ message: "Not Found", data: null });
                    return router;
                }
                res.status(200).json({ message: "OK", data: user });
                return router;
            }
            catch (err) {
                res.status(404).json({ message: "Not Found", data: null });
                return router;
            }
        }
    });


    userRoute.put(async (req, res) => {
        var { name, email, password, myPosts, myPlans, province, pictures } = req.body;
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                res.status(404).json({ message: "Not Found", data: null });
                return router;
            }
        }
        catch (err) {
            res.status(404).json({ message: "Not Found", data: null });
            return router;
        }
        if (name) {
            try {
                await User.findByIdAndUpdate(req.params.id, { $set: { "name": name } });
                res.status(200).json({ message: "OK", data: "User Name Update Finish" });
                return router;
            }
            catch (err) {
                res.status(500).json({ message: "Server Error", data: null });
                return router;
            }
        }
        if (password) {
            try {
                await User.findByIdAndUpdate(req.params.id, { $set: { "password": password } });
                res.status(200).json({ message: "OK", data: "User Password Update Finish" });
                return router;
            }
            catch (err) {
                res.status(500).json({ message: "Server Error", data: null });
                return router;
            }
        }
        if (myPosts) {
            try {
                await User.findByIdAndUpdate(req.params.id, { $set: { "myPosts": myPosts } });
                res.status(200).json({ message: "OK", data: "User's Posts Update Finish" });
                return router;
            }
            catch (err) {
                res.status(500).json({ message: "Server Error", data: null });
                return router;
            }
        }
        if (myPlans) {
            try {
                await User.findByIdAndUpdate(req.params.id, { $set: { "myPlans": myPlans } });
                res.status(200).json({ message: "OK", data: "User's Travel Plans Update Finish" });
                return router;
            }
            catch (err) {
                res.status(500).json({ message: "Server Error", data: null });
                return router;
            }
        }
        if (province && pictures) {
            try {
                const user = await User.findById(req.params.id);
                if (!user) {
                    res.status(404).json({ message: "Not Found", data: null });
                    return router;
                }
                const existingProvince = user.myTravelHistory.find(entry => entry.province === province);
                if (existingProvince) {
                    // If the province exists, append the new pictures to its array
                    existingProvince.pictures = existingProvince.pictures.concat(pictures);
                }
                await user.save();
                res.status(200).json({ message: "OK", data: null });
            }
            catch (err) {
                console.log(err);
            }
        }

    });


    userRoute.delete(async (req, res) => {
        const query = req.query; // Get the query parameters from the request

        const filter = {}; // Create an empty filter object
        if (query.where) {
            try {
                const user = await User.findById(req.params.id);
                if (!user) {
                    res.status(404).json({ message: "Not Found", data: null });
                    return router;
                }
                const filterObject = JSON.parse(query.where);
                Object.assign(filter, filterObject);
                if (filterObject.province && filterObject.picture) {
                    const searchString = filterObject.province;
                    const pictureUrl = filterObject.picture;
                    const updatedTravelHistory = user.myTravelHistory.map(entry => {
                        if (entry.province === searchString) {
                            // Remove the specific URL from the pictures array
                            entry.pictures = entry.pictures.filter(url => url !== pictureUrl);
                        }
                        return entry;
                    });
                    user.myTravelHistory = updatedTravelHistory;
                    await user.save();
                    res.status(200).json({ message: "OK", data: null });
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            try {
                const user = await User.findByIdAndRemove(req.params.id);
                if (!user) {
                    res.status(404).json({ message: "Not Found", data: null });
                    return router;
                }
            }
            catch (error) {
                res.status(404).json({ message: "Not Found", data: null });
                return router;
            }
            res.status(200).json({ message: "OK", data: "Delete Finish" });
            return router;
        }
    });

    return router;
}