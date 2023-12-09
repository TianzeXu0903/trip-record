var User = require("../models/user");
var Post = require("../models/post");


module.exports = function (router) {
    var userRoute = router.route("/users");

    // GET all users
    const provincesInChina = ["Beijing", "Shanghai", "Tianjin", "Chongqing", "Hebei", "Shanxi", "Inner Mongolia", "Liaoning", "Jilin", "Heilongjiang", "Jiangsu", "Zhejiang", "Anhui", "Fujian", "Jiangxi", "Shandong", "Henan", "Hubei", "Hunan", "Guangdong", "Guangxi", "Hainan", "Sichuan", "Guizhou", "Yunnan", "Tibet", "Shaanxi", "Gansu", "Qinghai", "Ningxia", "Xinjiang", "Taiwan", "Hong Kong", "Macao", "Nanhaizhudao"];


    // POST a new user
    userRoute.post(async (req, res) => {
        var { name, email, password, myPosts, myPlans, myTravelHistory } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(403).json({ "message": "Forbidden", "data": "Email already exists." });
            return router;
        }

        const defaultProvinceData = provincesInChina.map(province => ({
            province,
            pictures: []
        }));

        const newUser = new User(req.body);
        newUser.myTravelHistory = defaultProvinceData;
        await newUser.save();
        res.status(201).json({ "message": "Created", "data": newUser });
        return router;
    });



    return router;
}