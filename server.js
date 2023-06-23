const mongoose=require('mongoose');
const dotenv=require('dotenv');

process.on('uncaughtException',err => {
    console.log("Uncaught Exception! 😣 Shutting Down...");
    console.log(err.name,err.message);
    process.exit(1);
});

const app=require('./app');
dotenv.config({ path: './config.env' });

const db=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(db,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('Connection Successful!'));


const port= 3000;
const server=app.listen(port,()=>{
    console.log(`App is listening on port ${port}...`);
}); 

process.on('unhandledRejection',err => {
    console.log("Unhandled Rejection! 😣 Shutting Down...");
    console.log(err.name,err.message);
    server.close(()=>{
        process.exit(1);
    });
});