const path=require('path');
const express= require('express');
const morgan = require('morgan');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const cookieParser=require('cookie-parser'); 

const AppError=require('./utils/appError');
const globalErrorHandler=require('./controllers/errorController');

const viewRouter=require('./routes/viewRoutes');
const tourRouter=require('./routes/tourRoutes');
const userRouter=require('./routes/userRoutes');
const reviewRouter=require('./routes/reviewRoutes');

const app=express();

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

// 1) Global Middlewares

// Serving Static files
app.use(express.static(path.join(__dirname,'public')));

// Set Security HTTP headers
app.use(helmet({
    contentSecurityPolicy: false,
}));

// Development Blogging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));    // Using Third Party Middlewares
}

// Limit Requests
const limiter=rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: 'Too many requests from this IP, try again in an hour!'
});
app.use('/api',limiter);

// Body Parser, reading data from body to req.body
app.use(express.json({limit:'10kb'}));
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Prevent Parameter Pollution
app.use(hpp({
    whitelist: ['duration','ratingsAverage','ratingsQuantity','maxGroupSize','difficulty','price']
}));

// Test Middlewares
// app.use((req,res,next)=>{
//     console.log('Hello from the middleware!');
//     next();
// });
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    next();
});

// 2) Routes
app.use('/',viewRouter);
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);

app.all('*',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
});

app.use(globalErrorHandler);
module.exports=app;