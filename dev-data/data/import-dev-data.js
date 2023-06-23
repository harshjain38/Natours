const fs=require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const Tour=require('./../../models/tourModels');
const User=require('./../../models/userModels');
const Review=require('./../../models/reviewModels');

dotenv.config({ path: './config.env' });

const db=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(db,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('Connection Successful!'));

const tours= JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
const users= JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));
const reviews= JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));

const importData = async() => {
    try{
        await Tour.create(tours);
        await User.create(users,{validateBeforeSave:false});
        await Review.create(reviews);
        console.log('Data loaded!');
    }
    catch(err){
        console.log(err);
    }
    process.exit();
};

const deleteData = async() => {
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data deleted!');
    }
    catch(err){
        console.log(err);
    }
    process.exit();
};

if(process.argv[2]==='--import'){
    importData();
}
else if(process.argv[2]==='--delete'){
    deleteData();
}