//Importing necessary node module!
var express=require('express');
var app=express();
var mongoose = require('mongoose')
var morgan=require('morgan');
var bodyParser=require('body-parser');
var methodOverride=require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var connectMongo = require('connect-mongo')(session);
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

//Importing custom environment(development || production) configuration module
var config=require('./config/config.js');

//Connecting to mongoDB
mongoose.connect(config.dbURL);

//Setting up static file directory to be used by Express.
app.use(express.static(__dirname+'/public'));
//Setting up morgan logger to log all the request to console.
app.use(morgan('dev'));

//Setting up session for storing user info
app.use(cookieParser());
var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
	//dev specific settings
	app.use(session({secret:config.sessionSecret}));
}else{
	// production specific  settings
	app.use(session({
		secret:config.sessionSecret,
		store:new connectMongo({
			mongoose_connection:mongoose.connections[0],
			stringify:true
		})
	}))
}

//Social login settings using Passport module.
app.use(passport.initialize());
app.use(passport.session());

//Setting up parser
app.use(bodyParser.urlencoded({'extended':true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

app.use(methodOverride());

//Creating a mongoose model for tasks
//Creating mongoose schema for logged in users
var loginUser = new mongoose.Schema({
		profileID:String,
		fullname:String,
		email:String,
		profilePic:String,
		todo_tasks:[{
			task:String,
			status:Boolean
		}]
});
var listUser= mongoose.model('listUser',loginUser);
//Importing custom passportAuth.js module.
require('./auth/passportAuth.js')(passport, FacebookStrategy, config, listUser,mongoose);
//Importing custom routes module.
require('./routes/routes.js')(app, express, passport,listUser,mongoose);


//Use port by reading to environment variable(this will be helpful during producrion) 
app.listen(process.env.PORT || 3000, function(){
	console.log("Server started listening on:",(process.env.PORT||3000));
});
