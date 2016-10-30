# personal_todo_list
===========================================================================
## This project is built on top of https://github.com/PavanBahuguni/to_do_list

personal_todo_list is a simple application where the user can login using facebook and add tasks to be done and remove tasks that are done.
It is developed in MEAN(MongoDB, ExpressJS, AngularJS, nodeJS).

You can find the demo app at https://todo-tasks.herokuapp.com/


#How to run:
1. Download and Install nodejs from https://nodejs.org/en/download/<br>

2. Clone this Project.</br>

3. Change current working directory to project directory and run the command.</br> 
      $ npm install
    <br/>This will install all the necessary modules.
    
5. Create a mongodb database and add the url in development.js. development.js should look something like this.
     <br/> {
	     <br/> "dbURL":"//dbuser:dbpassword@ds063946.mlab.com:63946/to-do-list"
  	   <br/>}<br/>
    Here i have used mlab which is a mongo as provider.
6. Create a facebook app and provide the appId, secret key and callback url in development.json and production.json.

4. Open http://localhost:3000 to run the app.
