//This function will retrive all the user information from server and display it.
function getusers(){
	$.get("/admin/users", function(data){
		data = JSON.parse(data);
		data = data.users;
		for (var i in data){
			var posts = document.getElementById("users");
			posts.innerHTML += '<div id="'+data[i].username+'">\
						username<input type="text" value="'+data[i].username+'" id="'+data[i].username+'u'+'"></input>password<input type="text" value="'+data[i].password+'" id="'+data[i].username+'p'+'">\
						<button onclick="deleteuser(\''+data[i].username+'\')">Delete</button>\
						<button onclick="modifyuser(\''+data[i].username+'\')">Apply</button>\
					</div>';
		}
	});
}
function initialize(){
	$.get("/admin/init",function(data){
		alert("success!");
	});
}
//This function will retrive all the posts information from server and display it.
function getposts(){
	$.get("/admin/posts", function(data){
		data = JSON.parse(data);
		data = data.posts;
		for (var i in data){
			var posts = document.getElementById("posts");
			posts.innerHTML += '<div id="'+data[i]._id.valueOf()+'">\
						title<input type="text" value="'+data[i].title+'" id="'+data[i]._id.valueOf()+'t'+'"></input>content<input type="text" value="'+data[i].text+'" id="'+data[i]._id.valueOf()+'c'+'">\
						<button onclick="deletepost(\''+data[i]._id.valueOf()+'\')">Delete</button>\
						<button onclick="modifypost(\''+data[i]._id.valueOf()+'\')">Apply</button>\
					</div>';
		}
	});
}
//This function will delete a specific post based on its id
function deletepost(id){
	$.get("/admin/deletepost/"+id,function(data){
		alert("success!");
	});
}
//This function update a post's information based on its id
function modifypost(id){
	alert(id);
	$.post("/admin/modifyposts/",{"id":id,"title":document.getElementById(id+'t').value,"content":document.getElementById(id+"c").value});
}
//This function will delete a specific user based on its id
function deleteuser(id){
	$.get("/admin/deleteuser/"+id,function(data){
		alert("success!");
	});
}
//This function update a user's information based on its id
function modifyuser(id){
	var pswd = (document.getElementById(id+"p").value);
	pswd = MD5(pswd);
	$.post("/admin/modifyusers/",{"user_id":id,"password":pswd});
	location.reload();
}