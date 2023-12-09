var User = require('../models/user');
var Plan = require('../models/plan');


module.exports = function (router) {
    var planRoute = router.route('/plans/:id');
    planRoute.get(async (req, res) => {
        try {
            const plan = await Plan.findById(req.params.id);
            if (!plan) {
                res.status(404).json({ message: "Not Found", data: null });
                return router;
            }
            res.status(200).json({ message: "OK", data: plan });
            return router;
        }
        catch (err) {
            res.status(404).json({ message: "Not Found", data: null });
            return router;
        }
    });

    planRoute.delete(async (req, res) => {
        try {
            var plan = await Plan.findByIdAndRemove(req.params.id);
            if (!plan) {
                res.status(404).json({ message: "Not Found", data: null });
                return router;
            }
        }
        catch (error) {
            res.status(404).json({ message: "Not Found", data: null });
            return router;
        }
        if (plan.author != "") {
            try {
                await User.findByIdAndUpdate(plan.author, { $pull: { "myPlans": req.params.id } });
            }
            catch (err) {
                res.status(500).json({ message: "Server Error", data: null });
            }
        }
        res.status(200).json({ message: "OK", data: "Delete Finish" });
        return router;
    });

    return router;
}