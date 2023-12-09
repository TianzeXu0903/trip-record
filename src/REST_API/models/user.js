var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    myPosts: [String],
    myPlans: [String],
    myTravelHistory: [
        {
            _id: false,
            province: {
                type: String,
            },
            pictures: [
                {
                    type: String
                }
            ]
        }
    ]
});

module.exports = mongoose.model('User', UserSchema);