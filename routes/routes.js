module.exports=function(app, express, passport, listUser, mongoose){

	var router=express.Router();
	
	function securePages(req, res, next){
		if(req.isAuthenticated()){
			next();
		}else{
			res.redirect('/');
		}
	}
	//GET route is used to fetch all the tasks from mongoDB and return the tasks in JSON format to the user.
	router.get('/rest/tasks',securePages, function(req, res){
		//Query mongoDB to fetch the user along with tasks.
		listUser.findOne({profileID:req.user.profileID}).lean().exec(function(err, data){
			//Check if there are any errors while running query
			if(err)
				res.send(err)
			//Return the tasks fetched from mongoDB in JSON format
			console.log(data.todo_tasks);
			res.json(data);
		});
	});

	//POST route is used to create new task which is sent and send back list of all tasks,
	router.post('/rest/tasks',securePages, function(req, res){
		//Create new task with the data recieved as part of POST request
		listUser.findOne({profileID:req.user.profileID}, function(err, data){
			data.todo_tasks.push({task:req.body.text,status:false});
			data.save(function(err){
				console.log('Data inserted succesfully!');
				res.json(data);
			});
			
			});
	});
		
	
	
	//DELETE route to remove a task with a perticular from list.
	router.delete('/rest/task/:task_id',securePages,function(req, res){
		listUser.findOne({profileID:req.user.profileID}, function(err, data){
			data.todo_tasks.pull({_id:req.params.task_id});
			data.save(function(err){
				console.log('Data deleted succesfully!');
			});
			res.json(data);
		});
	});
	
	//Route to display the frontend page
	router.get('/', function(req, res){
		res.sendfile('./public/index.html');	
	});
	router.get('/tasks', securePages, function(req, res){
		res.sendfile('./public/task_list.html');	
	});	
	router.get('/logout',function(req, res, next){
		req.logout();
		res.redirect('/');
	});
	router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email']} ));
	router.get('/auth/facebook/callback', passport.authenticate('facebook',{
		successRedirect: '/tasks',
		failureRedirect: '/',
		scope:['email']
	}))
	
	app.use('/', router);

	function getJSON(arrayID,arrayText) {    
    	var JSON = "[";
    	//should arrayID length equal arrayText lenght and both against null
    	if (arrayID != null && arrayText != null && arrayID.length == arrayText.length) {
        	for (var i = 0; i < arrayID.length; i++) {
            	JSON += "{";
            	JSON += "text:'" + arrayText[i] + "',";
            	JSON += "id:'" + arrayID[i] + "'";
				JSON += "},";
        	}
		}
    	JSON += "]"
    	JSON = Function("return " + JSON + " ;");
    	return JSON();
	}
}