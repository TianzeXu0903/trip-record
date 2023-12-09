var User = require('../models/user');
var Post = require('../models/post');


module.exports = function (router) {
    var postRoute = router.route('/posts/:id');
    postRoute.get(async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                res.status(404).json({ message: "Not Found", data: null });
                return router;
            }
            res.status(200).json({ message: "OK", data: post });
            return router;
        }
        catch (err) {
            res.status(404).json({ message: "Not Found", data: null });
            return router;
        }
    });


    postRoute.put(async (req, res) => {
        var { title, content, createTime, author, authorName, tags, pictures } = req.body;

        if (!author) {
            res.status(400).json({ "message": "Bad Request", "data": "Author is required" });
            return router;
        }

        try {
            await Post.findByIdAndUpdate(req.params.id, { $set: { "title": title, "content": content, "createTime": createTime, "author": author, "authorName": authorName, "tags": tags, "pictures": pictures } });
            res.status(200).json({ message: "OK", data: "Post Update Finish" });
            return router;
        }
        catch (err) {
            res.status(500).json({ message: "Server Error", data: null });
            return router;
        }
    });



    postRoute.delete(async (req, res) => {
        try {
            var post = await Post.findByIdAndRemove(req.params.id);
            if (!post) {
                res.status(404).json({ message: "Not Found", data: null });
                return router;
            }
        }
        catch (error) {
            res.status(404).json({ message: "Not Found", data: null });
            return router;
        }
        if (post.author != "") {
            try {
                await User.findByIdAndUpdate(post.author, { $pull: { "myPosts": req.params.id } });
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