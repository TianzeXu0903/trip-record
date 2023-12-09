var User = require("../models/user");
var Post = require("../models/post");


module.exports = function (router) {
    var postRoute = router.route('/posts');

    postRoute.get(async (req, res) => {
        const query = req.query; // Get the query parameters from the request

        const filter = {}; // Create an empty filter object
        const options = {}; // Create an empty options object
        if (query.where) {
            try {
                const filterObject = JSON.parse(query.where);
                Object.assign(filter, filterObject);
                if (filterObject.title) {
                    const searchString = filterObject.title;
                    delete filter.title;
                    filter.$or = [
                        { title: { $regex: new RegExp(`.*${searchString}.*`, 'i') } },
                    ];
                }
                if (filterObject.tags) {
                    const searchString = filterObject.tags;
                    delete filter.tags;
                    filter.$or = filter.$or || [];
                    filter.$or.push({ tags: { $elemMatch: { $regex: new RegExp(`.*${searchString}.*`, 'i') } } });
                }
            } catch (err) {
                return res.status(400).json({ message: "Bad Request", data: "Invalid filter JSON" });
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

        if (query.count === 'true') {
            Post.countDocuments(filter, (err, count) => {
                if (err) {
                    res.status(500).json({ message: "Server Error", data: null });
                    return router;
                }
                res.status(200).json({ message: "OK", data: count });
                return router;
            });
        }
        else {
            Post.find(filter, null, options, (err, posts) => {
                if (err) {
                    res.status(500).json({ message: "Server Error", data: null });
                    return router;
                }
                res.status(200).json({ message: "OK", data: posts });
                return router;
            });
        }
    });

    // POST a new post
    postRoute.post(async (req, res) => {
        var { title, content, createTime, author, authorName, tags, pictures } = req.body;
        if (!author) {
            res.status(400).json({ "message": "Bad Request", "data": "Author is required" });
            return router;
        }
        const newPost = new Post(req.body);
        if (!createTime) {
            newPost.createTime = new Date();
        }
        try {
            var existingUser = await User.findById(author);
            if (!existingUser) {
                res.status(406).json({ message: "Not Acceptable", data: "Author Not Found" });
                return router;
            }
        }
        catch (err) {
            res.status(406).json({ message: "Not Acceptable", data: "Author Not Found" });
            return router;
        }
        await User.findByIdAndUpdate(author, { $push: { "myPosts": newPost._id } }).catch(err => {
            console.log(err);
        });
        await newPost.save();
        res.status(201).json({ "message": "Created", "data": newPost });
        return router;
    });

    return router;

}