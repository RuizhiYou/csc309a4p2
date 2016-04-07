

// delarcing some global variables
var found = '0';
var reviews_result = [];
var questions_result = [];
var replies_result = [];
var result_array = [];
var check = false;



var port = Number(process.env.PORT || 3000);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var intersect = require('intersect');
var async = require('async');


var http = require('http'),
     fs = require('fs'),
     URL = require('url');

//Load all the css files
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resource', express.static(path.join(__dirname, 'resource')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/home', express.static(path.join(__dirname, 'home')));


app.use(bodyParser.urlencoded({extended: false}));

// Connect to the db

MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
  	assert.equal(null, err);

	// Create the server
	app.listen(port,function(){
	  console.log("Started on PORT 3000");
	})

	app.get('/', function(req, res){
		fs.readFile('home.html', function(err, html){
			if (err) {
				throw err;
				return;
			}	
			res.write(html);
			res.end();	
		});
	});



	//search topic
	app.get('/search*', function(req, res){
		//get the topic from the url

		found = '0';
		reviews_result = [];
		questions_result = [];
		var topic = req.path.split('/')[2].trim();
		while (topic.includes('+')){
			topic = topic.replace('+', ' ');
		}
		var postsCol = db.collection('posts');
		var topicsCol = db.collection('topicsCol');

		var result = '';
		//find all posts containing that topic in the topics array field

		if (topic.indexOf(" ") > -1){
			console.log("ABCD");
			var matched_posts_array = postsCol.find({title: {$eq: topic}}).toArray();
			matched_posts_array.then(function(matched_posts_array){
				var i;
				for (i=0; i<matched_posts_array.length; i++){
					var post = matched_posts_array[i];
					if (post.type == 'review'){
						reviews_result.push({'post': post.title, 'id': post._id});
					} else if (post.type == 'question'){
						questions_result.push({'post': post.title, 'id': post._id});
				
					}
					
				}
				result = JSON.stringify({'found': '0', 'reviews': reviews_result, 'questions': questions_result});
				res.end(result);
			});

		// does not contain a space, so its a single word
		} else {
			//try to find the topic in the topics database 
			var topic_matches_array = topicsCol.find({topic_id: topic}).toArray();
			// try to find the posts that are related to that topic
			var matched_posts_array = postsCol.find({title: {$regex: ".*"+topic+".*"}}).toArray();
			topic_matches_array.then(function(topic_matches_array){
				if (topic_matches_array.length > 0){
					console.log('1\n');
					found = topic;
				} 			
			});
			matched_posts_array.then(function(matched_posts_array){
				var i;
				//console.log(matched_posts_array);
				for (i=0; i<matched_posts_array.length; i++){
					var post = matched_posts_array[i];
					if (post.type == 'review'){
						reviews_result.push({'post': post.title, 'id': post._id});
					} else if (post.type == 'question'){
						questions_result.push({'post': post.title, 'id': post._id});
					}
				}	
				result = JSON.stringify({'found': found, 'reviews': reviews_result, 'questions': questions_result});
				res.end(result);		
			});
		}
	});




	app.post('/users*', function(req, res){
		var user_id = req.path.split('/')[2].trim();
		var link = req.path.split('/')[3].trim();
		var postsCol = db.collection('posts');
		var usersCol = db.collection('users');
		console.log(user_id);
		if (link == 'show'){
			var user = usersCol.find({'username': user_id}).toArray();
			user.then(function(user){
				var location = user[0].location;
				var occupation = user[0].occupation;
				var hobby = user[0].hobby;
				var signature = user[0].signature;
				var src = user[0].src;
				
				var data = JSON.stringify({"location": location, "occupation": occupation, "hobby": hobby, "signature": signature, 'src': src});
				console.log(data);
				res.end(data);
			});
		} else if (link == 'save'){
			usersCol.update({'username': user_id}, {$set: {'occupation': req.body.occupation, 'location': req.body.location, 'hobby': req.body.hobby, 'signature': req.body.signature}});
		} else if (link == 'reset'){
			console.log("IN");
			var user = usersCol.findOne({"username": user_id});
			user.then(function(user){
				if (user.password == req.body.old_password){
					var d = new Date();
    				var n = d.getTime();
					if((req.body.session_id == user.session_id) && ((parseInt(user.session_id)-n<3600000 ))){
						usersCol.update({"username": user_id}, {$set: {password: req.body.new_password}});
						res.end('success');
					}
					
				} else {
					console.log('ELSE');
					res.end('failure');
				}
			});
		}
	});


	
	//receive view user profile request

	app.get('/users*', function(req, res){
		var user_id = req.path.split('/')[2].trim();
		var link = req.path.split('/')[3].trim();
		var postsCol = db.collection('posts');
		var usersCol = db.collection('users');
		reviews_result = [];
		questions_result = [];
		replies_result = [];
		result_array = [];
		result = '';

		if (link == 'feed'){
			var tens = req.path.split('/')[4].trim();
			var user = usersCol.findOne({'username': user_id});
			var user_topics = [];

			user.then(function(user){
				user_topics = user.topics;
			});
			var posts = postsCol.find();
			var j = 0;
			var k;
			posts = posts.sort({_id: -1});
			posts = posts.toArray();
			posts.then(function(posts){
				for (k=0; k<posts.length; k++){
					post = posts[k];
					post_topics = post.topics;
					console.log(k);
					var i;
					if (post_topics){
						for (i=0; (i<post_topics.length && j<(10+parseInt(tens))); i++){
							if (user_topics.indexOf(post_topics[i]) > -1){
								j++;
								post.target_topic = post_topics[i];
								result_array.push(post);
							}
							//console.log(reviews_result);
						}
					}
					if (j >= (10+parseInt(tens))){
						console.log('end');
						break;
					}
				}
				result = JSON.stringify({'result': result_array.slice(tens)});
				res.end(result);
			});
		// if the request is to show a user's profile
		} else if (link == 'show'){
			res.write("<div id='recognition_tag' value='"+user_id+"' ></div>");
			fs.readFile('public/user.html', function(err, html){
				if (err) {
					throw err;
					return;
				}
				console.log("1234");
				res.write(html);
				res.end();
			});
		} else if (link == 'questions'){
			var user = usersCol.findOne({'username': user_id});
			var questions_array = [];
			user.then(function(user){
				questions_array = user.questions;
				async.each(questions_array, function(post_id, callback){
					var post = postsCol.findOne({'_id':ObjectId(post_id)});
					post.then(function(post){
						questions_result.push(post);
						callback();
					});
				}, function(err){
					res.end(JSON.stringify({'posts': questions_result}));
				});
			});
		} else if (link == 'answers'){
			var user = usersCol.findOne({'username': user_id});
			var replies_array = [];
			user.then(function(user){
				replies_array = user.replies;
				var index;
				async.each(replies_array, function(reply_id, callback){
					var reply = postsCol.findOne({_id: ObjectId(reply_id)});
					reply.then(function(reply){
						replies_result.push(reply);
						callback();
					});
				}, function(err){
					res.end(JSON.stringify({'posts': replies_result}));
				});
			});
		} else if (link == 'followers'){
			var user = usersCol.findOne({'username': user_id});
			var followers_array = [];
			user.then(function(user){
				res.write(JSON.stringify({'followers': user.followers}));
			});
		} else if (link == 'followings'){
			var user = userCsol.findOne({'username': user_id});
			user.then(function(user){
				res.write(JSON.stringify({'followings': user.followings}));
			});
		} else if (link == 'topics'){
			var user = usersCol.findOne({'username': user_id});
			user.then(function(user){
				res.end(JSON.stringify({'topics': user.topics}));
			})
		} else if (link == 'recommend'){
			var user = usersCol.findOne({'username': user_id});
			var final_result = [];
			user.then(function(user){
				var topics = user.topics;
				if (topics.length <=0){
					res.end('0');
				}
				async.each(topic_ids, function(topic_id, callback){
					result = {};
					var topic = topicsCol.findOne({'topic_id': topic_id});
					topic.then(function(topic){
						temp = [];
						var keys_array = Object.keys(topic.similarity);
						var i;
						for (i=0; i<keys_array.length; i++){
							var key = keys_array[i];
							temp.push({key : topic.similarity[key]});
						}
						result[topic_id] = temp;
						final_result.push(result);
						callback();
					});
				}, function(err){
					if(err){return console.log(err);}
					res.end(JSON.stringify({'res': final_result}));
				});				
			});
		}
	});











	// recieve new topic following request
	app.post('/followtag', function(req, res){
		var usersCol = db.collection('users');
		var user = usersCol.find({username: req.body.username}).toArray();
		var user_id = req.body.username;
		var sim = 0;
		var topicsCol = db.collection('topicsCol');
		var topic = req.body.new_topic;
		var sim_dict = {};
		//if a user is following tags already
		// then get that array and insert a new element
		user.then(function(user){
			var topic_array = user[0].topics;
			var current
			if (topic_array.length > 0){
				var i, j;
				var new_topic = topicsCol.findOne({'topic_id': topic})
				var old_size;
				new_topic.then(function(new_topic){
					old_size = new_topic.followed_by.length;
					for (i=0; i<topic_array.length; i++){
						other_topic = topic_array[i];
						other_topic_promise = topicsCol.findOne({'topic_id': other_topic});
						other_topic_promise.then(function(other_topic_promise){
							var other_topic_size = other_topic_promise.followed_by.length;
							var common_users = intersect(new_topic.followed_by, other_topic_promise.followed_by).length;
							var sim = common_users/Math.sqrt((old_size+1) * (other_topic_size));
							var key1 = "sim." + other_topic;
							var query1 = {};
							query1[key1] = sim;
							var key2 = "sim." + new_topic;
							var query2 = {};
							query2[key2] = sim;
							topicsCol.update({'topic_id': new_topic}, {$set: query1});
							topicsCol.update({'topic_id': other_topic}, {$set: query2});
						});

					}

				});
				topic_array.push(req.body.new_topic);
			//if the user is not following anything, 
			// make a new array
			} else {
				topic_array = [req.body.new_topic];
			}
			// update the users database
			usersCol.update({username: req.body.username}, {$set: {topics: topic_array}}, {upsert: true});
			// need to create/update the topics database
			topicsCol.update({'topic_id': req.body.new_topic}, {$push: {"followed_by": req.body.username}});
			res.end('1');
		});

	});


	// recieve new post content.
	app.post('/p', function(req, res){
		//create the database if it does not exist
		db.createCollection('posts', {strict:true}, function(err, collection){});
		// find the posts db
		var postsCol = db.collection('posts');
		var usersCol = db.collection('users');
		// find the topics db
		db.createCollection('topicsCol', {strict:true}, function(err, collection){});
		var topicsCol = db.collection('topicsCol');
		// get the fields sent from client-side
		console.log(req.body);
		var post_type_array = JSON.parse(req.body.post_type);
		var post_type = post_type_array[0];
		var topics_array = JSON.parse(req.body.topics);
		var title = req.body.title;
		var text = req.body.text;
		var author = req.body.author;
		var reply_to;
		var replies;
		var rating;
		var upvotes = 0;
		var downvotes = 0;
		var upvoted_by = [];
		// set ratig to -1 if its not a review
		if (post_type_array[0] == 'review'){
			rating = post_type_array[1];
			reply_to = '';
			replies = [];
		} else if (post_type_array[0] == 'question'){
			rating = '-1';
			reply_to = '';
			replies = [];
		} else if (post_type_array[0] == 'reply'){
			rating = '-1';
			topics = [];
			reply_to = req.body.reply_to;
		}


		console.log("Topics: ");
		console.log(topics_array);
		for (var i=0; i<topics_array.length; i++){
			topicsCol.update({"topic_id": topics_array[i]}, {"topic_id": topics_array[i], "followed_by": [], "similarity": {}}, {upsert: true});
		}

		
		console.log("Title: " + title + "\nType: " + post_type + "\nRating: " + rating + "\nTopics: " + topics_array + "\nText: " + text.trim());


		postsCol.insert({'title': title, 'type': post_type, 'rating': rating, 'topics': topics_array, 'text': text.trim(), 
			'author': author, 'replies': replies, 'reply_to': reply_to, 'upvotes':upvotes, 'upvoted_by': upvoted_by, 'downvotes': downvotes}, function(err, obj){
				if (obj['ops'][0].type == 'reply'){
					postsCol.update({_id:ObjectId(obj['ops'][0].reply_to)}, {$push: {replies: obj['ops'][0]._id.valueOf()}});
					usersCol.update({'username': author}, {$push: {replies: obj['ops'][0]._id.valueOf()}});
				} else if (obj['ops'][0].type == 'question'){
					usersCol.update({'username': author}, {$push: {questions: obj['ops'][0]._id.valueOf()}});
				} else if (obj['ops'][0].type == 'review'){
					usersCol.update({'username': author}, {$push: {reviews: obj['ops'][0]._id.valueOf()}});
				}
				res.end(JSON.stringify({'post_id': obj['ops'][0]._id.valueOf()}));
				postsCol.update({_id: ObjectId(obj['ops'][0]._id)}, {$set: {created_at: Date(obj['ops'][0]._id.getTimestamp())}});
		});
	});


	// receive register request
	app.post('/register',function(req,res){
		// Create the database if it does not exist
  		db.createCollection('users', {strict:true}, function(err, collection){});
  		// find the users db
  		var usersCol = db.collection('users');
  		// get the fields	
		var username = req.body.username;
		var password = req.body.password;
		var email = req.body.email;
		// Try to find the tuple within the collection
		var matches = usersCol.find({'username':username}).toArray();
		matches.then(function(matches){
			//console.log(matches);
			//console.log(matches.length);

			//if not found, write into the database
			if (matches.length <= 0){
				console.log("User name = "+username+", password is "+password);
				usersCol.insert({'username': username, 'password': password, 'topics': [], 'upvoted_post': [], 'email': email, 'location': 'Not known', 'occupation': 'Not known', 
					'hobby': 'Not known', 'signature':'Not known', 'src':'icon1.png', 'questions':[], 'reviews':[], 'replies':[], 'following':[],'session_id':'0','followers':[]});
				res.end("1"); //success
			} else {
			//otherwise, return with code '0'
				res.end("0"); //failed
			};
		});
	});

	app.post('/login', function(req, res){
		//get the database
		var usersCol = db.collection('users')
		// get the fields
		var username = req.body.username;
		var password = req.body.password;

		//check if the username exists
		var matches = usersCol.find({'username':username});
		// array for easier checking
		var matchesArray = matches.toArray();
		matchesArray.then(function(matchesArray){
			// if there are no such username then
			if (matchesArray.length <= 0){
				// notify client 
				res.end("0"); //failed
			} else {
			// if the username exists, check password
				console.log(matchesArray[0].username);
				if (matchesArray[0].password == password){
					var d = new Date();
    				var n = d.getTime();
					var session_id = n;
					usersCol.update({'username': username}, {$set: {'session_id': session_id}});
					res.end(String(session_id)); //success
				} else {
					res.end("0"); //failed
				}

			}
		});

	})


	//Respond topic get/post request
	// get is used to initialize the html
	// post is used for transfering data back to html
	app.get('/topics*', function(req, res){
		var topic = req.path.split('/')[2].trim();
		console.log(topic);
		res.write("<div id='recognition_tag' value='"+topic+"' ></div>");
		fs.readFile('public/topic.html', function(err, html){
			if (err) {
				throw err;
				return;
			}
			res.write(html);
			res.end();
		});
	});

	app.post('/topics*', function(req, res){
		var topic = req.path.split('/')[2].trim();
		result_array = [];
		result = '';
		postsCol = db.collection('posts');
		matched_posts = postsCol.find({topics: {$eq: topic}}).toArray();
		matched_posts.then(matched_posts, function(matched_posts){
			for (var i=0; i<matched_posts.length; i++){
				result_array.push(matched_posts[i]);
			}
			result = JSON.stringify({'result': result_array});
			res.end(result);
		});

	});





	app.get('/posts/*/*', function(req, res){
		var post_id = req.path.split('/')[2];
		var action = req.path.split('/')[3];
		console.log(post_id);
		console.log(action);
		if (action == 'show'){
			console.log("IN");
			res.write("<div id='recognition_tag' value='"+post_id+"' ></div>");
			fs.readFile('public/question.html', function(err, html){
				if (err) {
					throw err;
					return;
				}
				res.write(html);
				res.end();
			});
		}
	});



	app.post('/posts/*/*', function(req, res){
		var post_id = req.path.split('/')[2];
		var action = req.path.split('/')[3];
		var username = req.body.username;
		reviews_result = [];
		questions_result = [];
		replies_result = [];
		result_array = [];
		result = '';
		usersCol = db.collection('users');
		postsCol = db.collection('posts');
		if (action == 'upvote'){
			var post_promise = postsCol.find({_id: ObjectId(post_id)}).toArray();
			var user_promise = usersCol.find({'username': username}).toArray();
			post_promise.then(function(post_promise){
				var post = post_promise[0];
				if (post.upvoted_by.indexOf(username) > -1){
					res.end('0');
				} else {
					postsCol.update({_id: ObjectId(post_id)}, {$push: {upvoted_by: username}, $inc: {upvotes: 1}});
					user_promise.then(function(user_promise){
						var user = user_promise[0];
						usersCol.update({'username': username}, {$push: {upvoted_post: post_id}});
						res.end('1');
					});
				}
			});
		} else if (action == 'downvote'){
			var post_promise = postsCol.find({_id: ObjectId(post_id)}).toArray();
			var user_promise = usersCol.find({'username': username}).toArray();
			post_promise.then(function(post_promise){
				var post = post_promise[0];
				if (post.upvoted_by.indexOf(username) > -1){
					res.end('0');
				} else {
					postsCol.update({_id: ObjectId(post_id)}, {$inc: {downvotes: 1}});

				}
			});
		} else if (action == 'comments'){
			var post = postsCol.findOne({_id: ObjectId(post_id)});
			post.then(function(post){
				var reply_ids = post.replies;
				var i;

				async.each(reply_ids, function(reply_id, callback){
					var reply = postsCol.findOne({_id: ObjectId(reply_id)});
					reply.then(function(reply){
						replies_result.push(reply);
						callback();
					});
				}, function(err){
					if(err){return console.log(err);}
					res.end(JSON.stringify({'result': replies_result}));
				});
			});




		} else if (action == 'show'){
			console.log("IN2");
			var post = postsCol.findOne({_id: ObjectId(post_id)});
			post.then(function(post){
				res.end(JSON.stringify({'result': post}));
			});
		}

	});
	
	//    /admin/posts
	app.get('/admin/posts', function(req, res){
		var postsCol = db.collection('posts');
		all_posts = postsCol.find().toArray();
		all_posts.then(function(all_posts){
			res.end(JSON.stringify({'posts': all_posts}));
		});
	});
	//    /admin/users

	app.get('/admin/users', function(req, res){
		var usersCol = db.collection('users');
		all_users = usersCol.find().toArray();
		all_users.then(function(all_users){
			console.log(all_users);
			res.end(JSON.stringify({'users': all_users}));
		});
	});
	//    /admin/delete/user_id
	app.get('/admin/deleteuser/*', function(req, res){
		var user_id = req.path.split('/')[3];
		var usersCol = db.collection('users');
		usersCol.remove({'username': user_id});
	});
	//    /admin/delete/post_id
	app.get('/admin/deletepost/*', function(req, res){
		var post_id = req.path.split('/')[3];
		var postsCol = db.collection('posts');
		postsCol.remove({'_id': ObjectId(post_id)});
	});
	// post
	//    /admin/users  -> change password

	app.post('/admin/modifyusers', function(req, res){
		var usersCol = db.collection('users');
		var user_id = req.body.user_id;
		var new_password = req.body.password;
		usersCol.update({'username': user_id},{$set: {'password': new_password}});
	});
	//    /admin/posts  -> change title/content
	app.post('/admin/modifyposts', function(req, res){
		console.log("modifypost");
		var postsCol = db.collection('posts');
		var id = req.body.id;
		var title = req.body.title;
		var content = req.body.content;
		postsCol.update({_id: ObjectId(id)}, {$set: {'title': title, 'text': content}});
	});
	//

	app.get('/admin/init', function(res, req){

	});



});