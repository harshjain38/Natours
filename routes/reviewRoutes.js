const express= require('express');
const reviewController=require('./../controllers/reviewController');
const authController=require('./../controllers/authController');

const router=express.Router({mergeParams: true});

router.use(authController.protect);

router
    .route('/')
    .get(reviewController.getReviews)
    .post(
        authController.ristrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(authController.ristrictTo('user','admin'),reviewController.updateReview)
    .delete(authController.ristrictTo('user','admin'),reviewController.deleteReview);
 
module.exports=router; 