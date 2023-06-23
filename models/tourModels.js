const mongoose=require('mongoose');
const slugify=require('slugify');

const tourSchema=new mongoose.Schema({
    name:{
        type : String,
        required : [true,'A tour must have a name.'],
        unique : true,
        trim: true ,
        maxLength: [40,'A tour must have less than or equal to 40 characters.'],
        minLength: [10,'A tour must have more than or equal to 10 characters.']
    },
    slug: String,
    duration:{
        type: Number,
        required :  [true,'A tour must have a duration.']
    },
    maxGroupSize:{
        type: Number,
        required :  [true,'A tour must have a group size.']
    }, 
    difficulty :{
        type: String,
        required :  [true,'A tour must have a difficulty.'],
        enum: {
            values: ['easy','medium','difficult'],
            message: 'Difficulty is either: easy,medium,difficult'
        }
    }, 
    secretTour :{
        type: Boolean,
        default: false
    },
    ratingsAverage : {
        type : Number,
        default : 4.5,
        min: [1.0,'Rating must be above 1.0'],
        max: [5.0,'Rating must be below 5.0'],
        set: val => Math.round(val*10)/10
    },
    ratingsQuantity : {
        type : Number,
        default : 0
    },
    price : {
        type : Number,
        required : [true,'A tour must have a price.']
    },
    priceDiscount :{
        type: Number,
        validate:{
            validator: function(val){
                // this only points to current object on new object creation.
                return val<this.price;
            },
            message: 'Discount ({VALUE}) should be less than price'
        }
    },
    summary:{
        type: String,
        trim : true,
        required : [true,'A tour must have a summary.']
    },
    description:{
        type: String,
        trim : true,
        required : [true,'A tour must have a description.']
    },
    imageCover:{
        type: String,
        required : [true,'A tour must have a cover image.']
    },
    images: [String],
    createdAt:{
        type: Date,
        default: Date.now(),
        select : false
    },
    startDates: [Date],
    startLocation:{
        type:{
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates:[Number],
        address: String,
        description: String
    },
    locations:[
        {
            type:{
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates:[Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

tourSchema.index({price:1,ratingsAverage: -1});
tourSchema.index({slug:1}); 
tourSchema.index({startLocation:'2dsphere'});

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
});

// Virtual Populate
tourSchema.virtual('reviews',{
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

// Document Middlewares: runs before .save() and .create() and not for .update()
tourSchema.pre('save',function(next){
    this.slug=slugify(this.name , {lower:true});
    next();
});
// tourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// });

// Embedding Guides to tours
// tourSchema.pre('save',async function(next){
//     const guidePromises=this.guides.map(async id =>await User.findById(id));
//     this.guides=await Promise.all(guidePromises);
//     next();
// });


// Query Middlewares
tourSchema.pre(/^find/,function(next){
    this.find({secretTour: { $ne : true }});
    next();
});
// tourSchema.post(/^find/,function(doc,next){
//     console.log(doc);
//     next();
// });
tourSchema.pre(/^find/,function(next){
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });
    next();
});


// Aggregation Middlewares
// tourSchema.pre('aggregate',function(next){
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//     next();
// });

const Tour = mongoose.model('Tour',tourSchema);
module.exports = Tour;