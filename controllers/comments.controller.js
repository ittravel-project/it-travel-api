const createError = require('http-errors');
const Comment = require ('../models/comment.model');

module.exports.create = (req, res, next) => {
    const comment = new Comment ({
        text: req.body.text,
        post: req.params.postId
    });
    comment.save()
        .then(()=> res.status(201).json(comment))
        .catch(next);
}

module.exports.delete = (req, res, next) => {
    Comment.findByIdAndDelete(req.params.id)
        .then(comment => {
            if (!comment) {
                throw createError(404, 'Comment not found')
            } else {
                res.status(204).json();
            }
        })
        .catch(next)
}

module.exports.update = (req, res, next)=> {
    Comment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators:true})
        .then(comment =>{
            if (!comment) {
                throw createError (404, "Comment not found")
            }else {
                res.json (comment)
            }
        })
        .catch(next)
}

