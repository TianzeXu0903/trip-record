var mongoose = require('mongoose');

var SpotSchema = new mongoose.Schema({
    name: String,
    province: String,
    city: String,
    description: String,
    pictures: [String],
    link: String
});

module.exports = mongoose.model('Spot', SpotSchema);