const mongoose = require('mongoose')

const URL_PATTERN = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

const postSchema = new mongoose.Schema({
    title :{
        type:String,
        required:true
    },
    city: {
        type: String,
        required: 'City is required',
    },
    attachment: {
        type: String,
        match: [URL_PATTERN, 'Invalid url pattern'],
        required:true,
        validate: [validateAttachments, 'Post needs at least one attachment'],
    },
    message: {
        type:String,
        required:['Message is required']
    },
    creater: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals:true,
        transform:function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;     
        }
    }
})

function validateAttachments(attachments) {
    return attachments && attachments.length >= 1
}

postSchema.virtual('comments', {
    ref: 'Comment', 
    localField: '_id',
    foreignField:'post',
    options: { sort: { createdAt: -1 } }
})

const Post = mongoose.model ('Post', postSchema)
module.exports = Post