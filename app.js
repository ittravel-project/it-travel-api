const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors')

const passport = require ('passport');

require('./configs/db.config')
require('./configs/passport.config')
const session = require('./configs/session.config')
const cors = require('./configs/cors.config')

const postsRouter = require('./routes/post.routes');
const commentsRouter = require('./routes/comments.routes');
const authRouter = require('./routes/auth.routes');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors)
app.use(session)
app.use(passport.initialize())
app.use(passport.session())

app.use ((req, res, next)=> {
    res.locals.session = req.user;
    next()
})

app.use('/posts/:postId', commentsRouter);
app.use('/posts', postsRouter);
app.use ('/', authRouter);

app.use((req, res, next)=>{
    next(createError(404))
})

app.use((req, res, next)=>{
    console.error(error)
    res.status(error.status || 500)
    const data = {}

    if (error instanceof mongoose.Error.ValidationError){
        res.status(400)
        data.errors={}
        Object.keys(error.errors).forEach(field => data.errors[field] = error.errors[field].message)
    } else if (error instanceof mongoose.Error.CastError){
        res.status(404)
        error.message = 'Resource not found'
    }
    data.mesage = error.message
    res.json(data)
})


module.exports = app;