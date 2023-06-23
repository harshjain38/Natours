const AppError=require('./../utils/appError');

const handleCastErrorDB = error => {
    const message= `Invalid ${error.path}: ${error.value}.`;
    return new AppError(message,400);
}

const handleDuplicateFieldsDB = error => {
    const message= `Duplicate Field value "${error.keyValue.name}". Please use another value.`;
    return new AppError(message,400);
}

const handleValidationErrorDB = error => {
    const errors=Object.values(error.errors).map(el => el.message);
    const message= `Invalid Input Data. ${errors.join('. ')}.`;
    return new AppError(message,400);
}

const handleJWTError=()=>{
    return new AppError('Invalid token! Please log in again!',401);
}

const handleJWTExpiredError=()=>{
    return new AppError('Token Expired! Please log in again!',401);
}

const sendErrorDev=(err,req,res)=>{
    // A) API
    if(req.originalUrl.startsWith('/api')){
        return res.status(err.statusCode).json({
            error: err,
            status: err.status,
            message: err.message,
            stack: err.stack
        });
    }
    // B) Rendered Website
    res.status(err.statusCode).render('error',{
        title: 'Something went wrong!',
        msg: err.message
    });
}

const sendErrorProd=(err,req,res)=>{
    // A) API
    if(req.originalUrl.startsWith('/api')){
        // Operational, Trusted Error : Send to client
        if(err.isOperational){
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        // Programming or other unknown error: don't leak error details
        console.error('Error 🤯',err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
    // B) Rendered Website
    // Operational, Trusted Error : Send to client
    if(err.isOperational){
        return res.status(err.statusCode).render('error',{
            title: 'Something went wrong!',
            msg: err.message
        });
    }
    // Programming or other unknown error: don't leak error details
    console.error('Error 🤯',err);
    return res.status(err.statusCode).render('error',{
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });
}

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.status=err.status || 'error';

    if(process.env.NODE_ENV==='development'){
        sendErrorDev(err,req,res);
    }
    else if(process.env.NODE_ENV==='production'){
        let error;
        if(err.name==='CastError') error=handleCastErrorDB(err); 
        else if(err.code===11000) error=handleDuplicateFieldsDB(err); 
        else if(err.name==='ValidationError') error=handleValidationErrorDB(err); 
        else if(err.name==='JsonWebTokenError') error=handleJWTError(); 
        else if(err.name==='TokenExpiredError') error=handleJWTExpiredError();  
        else error=err;
        sendErrorProd(error,req,res);
    }
}