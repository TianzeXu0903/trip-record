var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: String,
    content: String,
    createTime: Date,
    author: String,
    authorName: String,
    tags: [String],
    pictures: [String]
});

module.exports = mongoose.model('Post', PostSchema);