

var user_id = checkCookie();
 //user_id = document.getElementById("recognition_tag").getAttribute("value");

$.get("/users/" + user_id + '/recommend', function(data,status){

var similarity = data;
	similarity = JSON.parse(similarity);

//begin
	var u = "/users/" + user_id + "/topics";
	$.get(u,function(data1,status){
		data1 = JSON.parse(data1);
		data1 = data1.topics;
		var topic_user_follow = data1;
		var recommanded_topics = [];

		for (var p=0;p<topic_user_follow.length;p++){
		// assume this user follows the topic called t2, then find t2 first and find the topic 
		// which is the most similar with t2
			var t2 = topic_user_follow[p];
			var length = similarity.length;

			for (var i = 0; i < length; i++){
				var keys = Object.keys(similarity[i]);
				var key = keys[0];
				if (t2 == key){
					var arr = similarity[i][key];

					var max_topic = Object.keys(arr[0])[0];
					var max_topic_simi = arr[0][max_topic];
					for (var j=0; j<arr.length; j++){
						var this_topic = Object.keys(arr[j])[0];
						var this_topic_simi = arr[j][this_topic];
						if (this_topic_simi > max_topic_simi){
							max_topic = this_topic;
							max_topic_simi = this_topic_simi;
						}
					}
					var has_appeared = false;
					var in_topics_followed = false;
					for(var q=0;q<recommanded_topics.length;q++){
						if (recommanded_topics[q] == max_topic){
							has_appeared = true;
						}
					}		
					for (var w=0;w<topic_user_follow.length;w++){
						if (topic_user_follow[w] == max_topic){
							in_topics_followed = true;
						}
					}

					if (has_appeared == false && in_topics_followed == false){
						recommanded_topics.push(max_topic);
					}
				}
			}
		}
		recommanded_topics = topic_user_follow;

		for (var i=0; i<recommanded_topics.length;i++){
			var url = "/users/" + user_id + "/topics";

			$.get(url,function(data,status){

   				data = JSON.parse(data);
    			data = data.topics;
    			var output = "&nbsp;&nbsp;&nbsp;&nbsp;Topics:<br>"; 
    			for (var i=0;i<data.length;i++){
    				output += '&nbsp;&nbsp;&nbsp;&nbsp;' + data[i] + '<br>';
    			}
	      		document.getElementById("recommend_area").innerHTML = output;	    	
	      	});	
		}
  	});	



//end

/*
// I changed this line to 3 
//	for (var i=0;i<recommanded_topics.length;i++){
	for (var i=0;i<3;i++){
		var url = "http://localhost:3000/topics/" + recommanded_topics[i];



		var this_topic = recommanded_topics[i];
		// gonna use get
		$.get(url,function(data,status){
//	      	document.getElementById("topic_info").innerHTML = data;

//		var title = 'title';

			var title = data.title;
		    var div = document.createElement('div');
		    div.id = 'article_' + i;
		    div.className = 'article';
		    document.getElementById('recommandation').appendChild(div);
			title = document.createTextNode(title);
			var para = document.createElement("p");
			para.appendChild(title);
			para.className = 'question_end';
			para.style.fontSize = '30';

		    document.getElementById(div.id).appendChild(para);

		    var u = "http://localhost:3000/search/" + title;
		    $.get(u,function(topic_data,topic_status){
		    	reviews = topic_data.reviews;
		    	questions = topic_data.questions;
		    	for (var i=0;i<3;i++){
		    		var question_post = questions[i].post;
		    		var question_id = questions[i].id;
		    		alert(question_post);
		    	}

		    });	


	    });	




	}

*/

});





