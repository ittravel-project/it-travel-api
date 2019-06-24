const createError = require('http-errors');
const Post = require('../models/post.model')

module.exports.existsPost=(req,res,next)=>{
   Post.findById(req.params.postId)
   .then(post=>{
       if(!post){
           throw createError (404, 'Post not found')
       } else {
           next()
       }
   })
   .catch(next)
}