const createError = require('http-errors');
const User = require('../models/user.model')
const passport = require('passport')
const MAX_USERS = 200

module.exports.register = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
          if (user) throw createError(409, 'User already registered')
          else return new User(req.body).save()
      })
      .then(user => res.status(201).json(user))
      .catch(next);
}

module.exports.login = (req, res, next) => {
  passport.authenticate('auth-local', (error, user, message) => {
      if (error) next(error) 
      else if (!user) throw createError(401,message)
      else {
          req.login(user, error => {
              if (error) next(error)
              else res.status(201).json(user)
          })
      }
  }) (req, res, next)
}

module.exports.logout = (req, res, next) => {
  req.logout();
  res.status(204).json();
}

module.exports.getProfile = (req, res, next) => {
  res.json(req.user);
}

module.exports.editProfile = (req, res, next) => {
  delete req.body.email;

  const user = req.user;
  Object.keys(req.body).forEach(prop => user[prop] = req.body[prop]);
  if(req.file) user.avatarURL = req.file.secure_url;

  user.save()
      .then(user => res.status(201).json(user))
      .catch(next)
}

module.exports.getUser = (req, res, next) => {
  User.find(req.params.userId)
  .populate('posts')
    .then(user => {
      if (!user) {
        throw createError(404, 'User not found')
      } else {
        res.json(user)
      }
    })
    .catch(next)
}

module.exports.getUserList = (req, res, next) => {
  User.find() 
    .sort({
        createdAt:-1
    })
    .limit(MAX_USERS)
    .then (users => res.json(users))
    .catch(next)
}

module.exports.loginWithIDPCallback = (req, res, next) => {
  const { idp } = req.params; 
  passport.authenticate(`${idp}-auth`, (error, user) => {
    if (error) {
      next(error);
    } else {
      req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.redirect('https://s-cape.herokuapp.com/home')
        }
      })
    }
  })(req, res, next);
}