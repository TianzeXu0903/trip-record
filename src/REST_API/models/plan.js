var mongoose = require('mongoose');

var PlanSchema = new mongoose.Schema({
    name: String,
    author: String,
    stops: [
        {
            _id: false,
            spot: {
                type: String
            },
            spotName: {
                type: String
            },
            startTime: {
                type: Date,
            },
            endTime: {
                type: Date
            },
            note: {
                type: String
            }
        }
    ]
});

module.exports = mongoose.model('Plan', PlanSchema);