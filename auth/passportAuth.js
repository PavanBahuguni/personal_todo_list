module.exports = function(passport, FacebookStrategy, config, userModel, mongoose){
	
	
	passport.serializeUser(function(user, done){
		done(null, user.id)
	});
	
	passport.deserializeUser(function(userID, done){
		userModel.findById(userID, function(err, user){
			done(err, user);
		})
	});		

	passport.use(new FacebookStrategy({
		clientID: config.facebook.appId,
		clientSecret: config.facebook.appSecret,
		callbackURL: config.facebook.callBackURL,
		profileFields:['id', 'displayName', 'photos', 'email']
	}, function(accessToken, refreshToken, profile, done){
		//check if the user exist in db
		//If not create and return the profile
		//If exist return the profile
		userModel.findOne({'profileID':profile.id}, function(err, result){
			if(result){
				done(null, result);
			}else{
				//Create a new user in mongoDB
				var newUser= new userModel({
					profileID:profile.id,
					fullname:profile.displayName,
					email:profile.emails[0].value,
					profilePic:profile.photos[0].value||''
				});
				newUser.save(function(err){
					done(null,newUser);
				})
			}
		})
	}));
}