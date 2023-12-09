var User = require('../models/user');
var Spot = require('../models/spot');


module.exports = function (router) {
    var spotRoute = router.route('/spots/:id');
    spotRoute.get(async (req, res) => {
        try {
            const spot = await Spot.findById(req.params.id);
            if (!spot) {
                res.status(404).json({ message: "Not Found", data: null });
                return router;
            }
            res.status(200).json({ message: "OK", data: spot });
            return router;
        }
        catch (err) {
            res.status(404).json({ message: "Not Found", data: null });
            return router;
        }
    });


    return router;
}