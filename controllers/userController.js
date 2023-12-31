const AppError=require('./../utils/appError');
const catchAsync=require('./../utils/catchAsync');
const User=require('./../models/userModels');
const factory=require('./handleFactory');

const filterObj = (Obj, ...allowedFields)=>{
    const newObj={};
    Object.keys(Obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el]=Obj[el];
    });
    return newObj;
}

exports.getMe = (req,res,next) => {
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async(req,res,next)=>{
    // 1) Create Error if user posts password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword',400));
    }
    
    // 2) Filter out unwanted fields names that are not allowed to be updated
    const filteredBody=filterObj(req.body,'name','email');
    
    // 3) Update user doocument
    const updatedUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new: true,
        runValidators: true     
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{ active : false });
    
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.createUser = (req,res,next)=>{
    res.status(500).json({
        status: 'error',
        message:'This route is not defined. Try /signup'
    });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);