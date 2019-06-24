const mongoose = require ('mongoose')

const commentSchema = new mongoose.Schema({
    text:{
        type:String,
        required:'text is required',
        min:3,
        max:100
    }, 

    posts: {
        type:mongoose.Types.ObjectId,
        ref: 'Post',
        required:true
    }
},{
    timestamps: true,
    toJSON: {
        virtuals:true,
        transform:function(doc,ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;     
        }
    }
})

const Comment = mongoose.model ('Comment', commentSchema)
module.exports = Comment 