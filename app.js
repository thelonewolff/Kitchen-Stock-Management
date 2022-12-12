var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash")
    session = require("express-session"),
	User        = require("./models/user"),
    methodOverride = require("method-override");
	router = express.Router(),
	MongoClient = require("mongodb").MongoClient;


require('dotenv').load();
    
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const databaseUri = 'mongodb+srv://rajshubam820:10december@cluster0.5npfidt.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(databaseUri,{ useFindAndModify: false, useNewUrlParser: true ,useUnifiedTopology: true },function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("Successfully connected to database");
	}
});
app.set('trust proxy', 1);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hello, welcome to ynamic Stock Management",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(session({
// cookie:{
//     secure: true,
//     maxAge:60000
//        },
// // store: new RedisStore(),
// secret: 'secret',
// saveUninitialized: true,
// resave: false
// }));
const firebaseConfig = {
    "type": "service_account",
    "project_id": "kitchenstockmanagemet",
    "private_key_id": "37a860e2e4dbca59713f7f8974960103634013c0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCgB5BzuQgcStUC\nTjF8QvSVt1br4+EckFm6cGQUBLmdRpnQ2V8J3hRjlTKNG9qJMowhwC26LDzHrZB7\n+Ggbqt8Go0jFykq2veMYFssR2LaUWW7k0vy8dDoxcpiuMBwe6CMIA6GlCFqD243t\noac1T4FYpFTRtZ0ckJjU+XnICkr/Bqk4PKXyZzGtHlBWutn9zM/uMc/bn1/p1YYX\ne00jdxZrgwytAsxvHQmhcZ4n9RFHsfToJ+r/t3kCheq8ebtyeFJjfQYwTJ6dvbCS\ninVhTntevYGOrZoHpPsbuHqL8eeuGrFatN7wNsVFxRPWvL9cM5csLMXOrdxE21vF\nDpgp+dp3AgMBAAECggEAR4Mp17TjfXUpXCbiMUPgdbkg5DgIxFFzb3/DETkNU02V\n9gD1Wfz+goPNO8arMW0/tuNg69XR8W9L5kJbD6YblSVJo22jVqdjgMPKynZcHM4c\nYrAwVezghnFN7mU8Y8lbwjyRMyUZAdyOv5biGE4noJuK9c3hYD7ztRSpCa4j1nOI\nAyUBQ8yAem0p95z8hvZKlV9AsADxWP9KZ1XYzF+cPuMyzfuDSA/yQTIKkMH0m5C0\nngThSgCIhVppz8SWCZUs4FY1j/KG+Jt1jFikpOQwwdh+4oqQWcIWX+IV7VFlKSXD\nTra9c9pMw9bXw5kAcDZwdzIeC+ovfMblY762A3hk5QKBgQDTFVmu2Anyfei+aGuL\nc9/btMVa8IibDapScFrbZ9Bu3vJZUWqtxSJ47qIRE+dA95CUwSP2cDVYspf4kfnz\nE8DCluaxKslvQvesaV+7M65tRtKOHBlwkrInfXCnST876D9sH3I2+7Ksg0kkkiTd\nDzVJopzyYHjfYoapAVrWLqIFJQKBgQDCFRWDHygO8lIsGhYV4gjOujWpa5aWwmKi\nmG0ZbD36K9OYdrzBnyaYrZA8cBlSnkqtImrnBpvuHMJHGB4DhTmDeDUYdx32Vrfa\npoF2UdvrBfcn9LAig3NmdCXv6SeCxHRIG4iekhQtZ7/M9qiWkboKg0ax1VNCcndL\nbKbaej6kawKBgQCv6xxKPpzTryG5BteSamkH93l/V/XRm6r2d9MRBk1NCZva2qLY\n3fHj7aW+K+NQXsLtZqYtLckX+gfzzt0MO8sroY3z25/zjVFTLKLvJpxZUGwMqdh9\n3JSDmuS3VrFPoTiySObscgqwAd6EjxQP9CvKCa9ZxRMXwUpPMeTdmhHHzQKBgBzn\nRuzgFvci31nyCJf5sZYX5SX1/9cz27ybNqQymohHPpvWEwZCzVyvfGuDxkGnkTd3\niLQfJ9muLsCnttCPZqFNpZqfIrcs8vR9F4qnZjj6CnTI2/JH4UfAxGWWM2wmFasn\nbpEu8BJTAR1lHnZN/YbTRhP10RB0O4/f/nlK+0lBAoGBAJXFzOHgC0+4J6zuBVcn\n4mJPIPWeWHKOGphP/Dc2ev1cUGwfKK6+82O2B1T0zDJI+TmT6Ydqcr7PFaU8215k\nwf/ghC8BMAlw/XVqeD0qeEuH42Idfzwarrsl6L+F9ARHxUZNLqnnWC9UwQBRZpRE\nKHAzfBvHVWVXXr56g84WXD8/\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-890mn@kitchenstockmanagemet.iam.gserviceaccount.com",
    "client_id": "106103848215296252004",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-890mn%40kitchenstockmanagemet.iam.gserviceaccount.com"
  }
  

var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: "https://kitchenstockmanagemet-default-rtdb.firebaseio.com"
});

var db=admin.database();
var stock=db.ref("Kitchen Stock Management");

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


app.get("/", function(req, res){
    res.render("landing");
});

app.get("/login", function(req,res){
	res.render('login',{page:'login'});
})

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: ("/profile"),
        failureRedirect: "/login" 
    }), function(req, res){
});

app.get("/profile",function(req,res){
    var val
    stock.once('value',function(snap){
            res.render("profile1",{val:snap.val()})
        })        
})

app.get("/signup",function(req,res){
	res.render("signup");
})

app.post("/signup",function(req,res){
	 var newUser = new User({username: req.body.username, email:req.body.email});
     User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
			// req.flash("error",err);
            return res.render("signup");
        }
		 res.redirect("/login");
        // passport.authenticate("local")(req, res, function(){
        //    res.redirect("/login");
        // });
    });
})

app.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/");
});

app.get("*",function(req,res){
	res.send("The page you are looking for does not exist!")})

function isLoggedIn(req, res, next){
        if(req.isAuthenticated())
		{
            return 1;
        }
        // req.flash("error", "You must be signed in to do that!");
        res.redirect("/login");
    };

// app.listen(process.env.PORT, function(){
//    console.log("The Server Has Started!");
// });


app.listen(3000,function(){
   console.log("The Server Has Started!");
});