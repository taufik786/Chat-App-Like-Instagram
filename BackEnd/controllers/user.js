const User = require('../models/userModel');

module.exports = {
    async GetAllUsers(req, res){
        await User.find({})
        .populate('posts.postId')
        .populate('following.userFollowed')
        .populate('followers.follower')
        .populate('chatList.receiverId')
        .populate('chatList.msgId')
        .then((result) => {
            res.status(200).json({message: 'All Users', result})
        }).catch(err => {
            res.status(500).json({message: 'Error occured'})
        })
    },
    async GetUser(req, res){
        await User.findOne({_id: req.params.id})
        .populate('posts.postId')
        .populate('following.userFollowed')
        .populate('followers.follower')
        .populate('chatList.receiverId')
        .populate('chatList.msgId')
        .then((result) => {
            res.status(200).json({message: 'User by id', result})
        }).catch(err => {
            res.status(500).json({message: 'Error occured'})
        })
    },
    async GetUserByname(req, res){
        await User.findOne({username: req.params.username})
        .populate('posts.postId')
        .populate('following.userFollowed')
        .populate('followers.follower')
        .populate('chatList.receiverId')
        .populate('chatList.msgId')
        .then((result) => {
            res.status(200).json({message: 'User by username', result})
        }).catch(err => {
            res.status(500).json({message: 'Error occured'})
        })
    },
}