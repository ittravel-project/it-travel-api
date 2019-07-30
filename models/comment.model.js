const mongoose = require ('mongoose')

const commentSchema = new mongoose.Schema({
    name: {
        type: String
    },
    text: {
        type: String,
        min: 3,
        max: 100
    }, 
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    time : { 
        type : Date, 
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            ret.id = doc._id;
            delete ret._id;
            delete ret.__v;
            return ret;     
        }
    }
})

const Comment = mongoose.model ('Comment', commentSchema)
module.exports = Comment 