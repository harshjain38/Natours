// const AppError = require('../utils/appError');
// const catchAsync=require('./../utils/catchAsync');
const Review=require('./../models/reviewModels');
const factory=require('./handleFactory');

exports.setTourUserIds = (req,res,next) => {
    if(!req.body.user) req.body.user=req.user.id;
    if(!req.body.tour) req.body.tour=req.params.tourId;
    next();
}

exports.getReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);