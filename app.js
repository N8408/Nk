
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const user = require("./routes/user.js");
const session = require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const multer  = require('multer');
const { error } = require("console");

const dbUrl=process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
}
main()
    .then(() => {
        console.log("Database is connected");
    }).catch((err) => {
        console.log(err);
    });

    mongoose.connect(dbUrl, {
  connectTimeoutMS: 50000, // 20 seconds
});

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO STORE",error);
});

const sessionOpt = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOpt));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")))
app.engine("ejs", ejsMate);
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",user);

app.listen(8080, () => {
    console.log("App listening on port 8080");
});

app.get('/', (req, res) => {
  res.render('home');  // or sendFile() for static HTML
});


// app.get("/", (req, res) => {
//     res.send("App is working.....");
// });

// app.get("/demouser", async (req, res) => {
//     try {
//         let existingUser = await User.findOne({ username: "delta-student" });
//         if (existingUser) {
//             return res.send("Demo user already exists.");
//         }

//         let fakeUser = new User({
//             email: "student@gmail.com",
//             username: "delta-student",
//         });

//         let newUser = await User.register(fakeUser, "helloworld");

//         res.send(newUser);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });


app.use((err, req, res, next) => {
    let { statusCode = 404, message = "Something went wrong!" } = err;
    res.render("./listings/error.ejs", { message });
    // res.send("Something went wrong!");
});

