const Joi = require('joi');

const Post = require('../models/postModels');
const User = require('../models/userModel');

module.exports = {

    // Add Post
    AddPost(req, res) {
        const schema = Joi.object().keys({
            post: Joi.string().required()
        });
        let { error } = schema.validate(req.body);
        if (error && error.details) {
            return res.status(500).json({ msg: error.details })

        }
        const body = {
            user: req.user._id,
            username: req.user.username,
            post: req.body.post,
            created: new Date()
        }

        Post.create(body)
            .then(async (post) => {
                await User.update({
                    _id: req.user._id
                },
                    {
                        $push: {
                            posts: {
                                postId: post._id,
                                post: req.body.post,
                                created: new Date()
                            }
                        }
                    })
                res.status(200).json({ message: 'Post Created', post })
            }).catch(err => {
                res.status(500).json({ message: 'Error occured' })
            })
    },

    // get all posts
    async GetAllPosts(req, res) {
        try {
            const posts = await Post.find({})
                .populate('user')
                .sort({ created: -1 });

            const top = await Post.find({totalLikes: {$gte: 2 }})  // gte - gtreter than equal
                .populate('user')
                .sort({ created: -1 });


            return res.status(200).json({ message: 'All posts', posts, top })
        } catch (err) {
            return res.status(500).json({ message: 'Error Occured', posts })
        }
    },
    
    // Add Like
    async AddLike(req, res) {
        const postId = req.body._id;
        await Post.update(
            {
                _id: postId,
                "likes.username": {$ne: req.user.username}
            }, {
            $push: {
                likes: {
                    username: req.user.username
                }
            },
            $inc: { totalLikes: 1 }
        }).then(() => {
            res.status(200).json({ message: 'You liked the post' });
        }).catch(err => {
            res.status(500).json({ message: 'error occurred' })
        }
        );
    },
    // Add Comment
    async AddComment(req, res) {
        const postId = req.body.postId;
        await Post.update(
            {
                _id: postId
            }, 
            {
            $push: {
                comments: {
                    userId: req.user._id,
                    username: req.user.username,
                    comment: req.body.comment,
                    createdAt: new Date()
                }
            }
        }).then(() => {
            res.status(200).json({ message: 'Comment added to post' });
        }).catch(err => {
            res.status(500).json({ message: 'error occurred!' })
        }
        );
    },

    // Get Post
    async GetPost(req, res){
        await Post.findOne({_id: req.params.id})
        .populate('user')
        .populate('comments.userId')
        .then((post) => {
            res.status(200).json({message: 'Post Found', post})
        })
        .catch(err => 
            res.status(404).json({message: 'Post Not Found', post})
        )
    }

};