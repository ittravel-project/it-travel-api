const User = require('../models/user.model');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FBStrategy = require('passport-facebook').Strategy;


passport.serializeUser((user, next) => {
    next(null, user.id);
});
  
passport.deserializeUser((id, next) => {
    User.findById(id)
      .then(user => next(null, user))
      .catch(next)
});
  
passport.use('auth-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, next) => {
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
            next(null, false, 'Invalid email or password')
            } else {
                return user.checkPassword(password)
                .then(match => {
                    if (!match) {
                        next(null, false, 'Invalid email or password')
                    } else {
                        next(null, user)
                    }
                })
            }
        })
    .catch(error => next(error))
}));

passport.use('google-auth', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
  }, authenticateOAuthUser));

passport.use('fb-auth', new FBStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.FB_CB_URL || '/auth/facebook/callback',
    profileFields: ['id', 'emails']
}, authenticateOAuthUser));
  
function authenticateOAuthUser(accessToken, refreshToken, profile, next) {
    const provider = `${profile.provider}Id`;
    const socialId = profile.id;
    const name = profile.displayName;
    const email = profile.emails ? profile.emails[0].value : undefined;
    const avatarURL = profile.picture || profile.photos && profile.photos[0].value;

    if (profile.provider === 'facebook') {
        provider = 'facebookId'
    } else if (profile.provider === 'google') {
        provider = 'googleId';
    } else {
        next();
    }

    User.findOne({
        $or: [
        { email: email },
        { [`social.${provider}`]: socialId }
        ]
    })
    .then(user => {
        if (user) {
            next(null, user);
        } else if (!user) {
            user = new User({
            name: name,
            email: email,
            password: Math.random().toString(35),
            social: {
                [provider]: socialId
            },
            avatarURL: avatarURL
            })
            return user.save()
            .then(user => next(null, user))
        }
    })
    .catch(error => next(error))
}