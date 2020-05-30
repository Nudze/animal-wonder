const express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	flash = require("connect-flash"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override");

const app = express();

const Animal = require("./models/animal"),
	Comment = require("./models/comment"),
	User = require("./models/user");

const animalsRoutes = require("./routes/animals"),
	commentsRoutes = require("./routes/comments"),
	indexRoutes = require("./routes/index");

mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost/amazing_animals", { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

// Passport configuration
app.use(
	require("express-session")({
		secret            : "Animals are too amazing to ignore",
		resave            : false,
		saveUninitialized : false
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/animals", animalsRoutes);
app.use("/animals/:id/comments", commentsRoutes);

app.listen(process.env.PORT || 3000, () => {
	console.log("Server has started.");
});
