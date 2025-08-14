//require env
if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
// console.log(process.env.CLOUD_API_SECRET);

//express required
const express = require("express");
const  app = express();
const port = 8080;

//EJS Required
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));

//required EJS_MATE
const ejsMate = require("ejs-mate");
app.engine('ejs',ejsMate);

//required method override
const methodOverride = require("method-override");
app.use(methodOverride('_method'));

//for public folder used
app.use(express.static(path.join(__dirname,"/public")));

//required wrapasync folder
const ExpressError = require("./utils/ExpressError.js");

//--- session required
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

//---passport require-----//
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// //mongoose required & MODELS FOLDERS
const mongoose = require("mongoose");

//-------------required Router folder for routes-------------//
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbURL = process.env.ATLASTDB_URL;
main()
    .then(()=>{
        console.log("Connection Successful");
    })
    .catch((err)=>{
        console.log(err);
    });
    
async function main(){
    await mongoose.connect(dbURL);
}

const store =  MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () =>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//---------middleware for flash message---------//
app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

// //----------
// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email:"abc123@gmail.com",
//         username:"delt-student",
//     });

//     let register = await User.register(fakeUser,"helloword");
//     res.send(register);
// });


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });

//-------------MIDDLEWEARS--------------//
app.use((err,req,res,next)=>{
    let {statusCode = 500 , message = "Something is wrong"} = err;
    res.render("listings/error.ejs", {message,statusCode});
    // res.status(statusCode).send(message);
});


app.listen(port,()=>{
    console.log(`Server is Litening to port:${port}`);
});