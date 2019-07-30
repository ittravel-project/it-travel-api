const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
const URL_PATTERN = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name needs at least 3 characters'],
        trim: true
    },
    email: {
        type: String,
        required: 'Email is required',
        unique: true,
        lowercase: true,
        trim: true,
        match: [EMAIL_PATTERN, 'Invalid email pattern']
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    city: {
        type: String,
        required: [
            function() { return !this.social.googleId && !this.social.facebookId },
            'City is required'
        ],
    },
    description: {
        type: String
    },
    social: {
        googleId: String,
        facebookId: String
    },
    avatarURL: {
        type: String,
        match: [URL_PATTERN, 'Invalid avatar URL pattern']
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = doc._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    }
});

userSchema.pre('save', function (next) {
const user = this;

if (!user.isModified('password')) {
    next();
} else {
    bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
            return bcrypt.hash(user.password, salt)
                .then(hash => {
                user.password = hash;
                next();
                })
        })
        .catch(next)
    }
});

userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;