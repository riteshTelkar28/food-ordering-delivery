import express from 'express';
import cookieParser from 'cookie-parser';
import userRouter from './router/userRouter.js';
import adminRouter from './router/adminRouter.js';

var app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set("views","views");
app.set("view engine","ejs");

app.use(express.static('public'));
app.use(cookieParser());

app.get("/",(request,response)=>{
    response.render("home.ejs");
});

app.use("/user",userRouter);
app.use("/admin",adminRouter);

app.listen(3000,()=>{
    console.log("server connection successfull");
})