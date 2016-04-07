//ID used for recognition. Use this to retrive a specifc post information
var topic_id = document.getElementById("recognition_tag").getAttribute("value");
//Get the information of this topic
document.getElementById("topic").innerHTML += topic_id;
$.post("/topics/"+topic_id,
    function(data){
    	data = JSON.parse(data);
    	//document.getElementById("description").innerHTML += data.topic.description;
    	for (var i in data.result){
	    	document.getElementById("content").innerHTML +=
	    	'<div class="post">\
				<div class="metadata">\
					<img align="right" class="ava" src="'+data.result[i].src+'" alt="Mountain View" style="width:40px;height:40px;"></img>\
				</div>\
			<text class="cont"><a href="/posts/'+data.result[i]._id.valueOf()+'">'+data.result[i].title+'</a></br></br></br></text>\
			<div class="botbar"><text ><button class="vote">Upvote</button>('+data.result[i].upvote+'), <a href="">'+data.result[i].downvote+'</a>(20), <a href="">Created at '+data.result[i].time+'</a></text></div>\
			</div>\
			</br>'
		}
    });
function followTopic(){
	var data = {"username":checkCookie(),"new_topic":topic_id};
	$.post("/followtag/",data,function(data,status){
		alert("success!")});
}

function rate(){
	var rating = 0;
	if(document.getElementById("1").checked){
		rating = 1;
	}
	else if(document.getElementById("2").checked){
		rating = 2;
	}
	else if(document.getElementById("3").checked){
		rating = 3;
	}
	else if (document.getElementById("4").checked){
		rating = 4;
	}
	else if (document.getElementById("5").checked){
		rating = 5
	}
	else{
		alert("Please Vote First");
		return;
	}
	$.get("/",function(data){
		alert("Sccuess!");
	})
}