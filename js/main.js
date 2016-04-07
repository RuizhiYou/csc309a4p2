var screen_height = $(window).height();
var cur_y = $(window).scrollTop();
var cur_screen = $(window).height();
var cur_index = 0;
var posts = [];
var page = 0;
var flag = 1;
//Execute at the begining
// make an ajax call to the server and fetch the next 10 posts, then update
var url = "/users/"+checkCookie()+"/feed/"+page;
$.get(url, function(data){
	data = JSON.parse(data);
	if (data.result.length == 0){
		if (flag){
			document.getElementById("content").innerHTML += '		<div class="post">\
			<text class="title">No More Feed  </text></br>\
			<text class="cont">This is the last article</br></br></br></text>\
			</div>'
			flag = 0;
		}
		return;
 	}
	else{
		page+=10;
		data = data.result;
		for (var i in data){
			var type;
			if(data[i].type=="review"){
				type = "Review";
			}
			else{
				type = "Question";
			}
			generator(data,type,i);
		}
	}
});

//Exceute after scrolling
$(window).scroll(function(){
     if($(window).scrollTop() + window.innerHeight > $(document).height() - 100)
    {
      	// make an ajax call to the server and fetch the next 10 posts, then update
      	var url = "/users/"+checkCookie()+"/feed/"+page;
       	$.get(url, function(data){
       		data = JSON.parse(data);
 			if (data.result.length == 0){
 				if (flag){
	 				document.getElementById("content").innerHTML += '		<div class="post">\
					<text class="title">No More Feed  </text></br>\
					<text class="cont">This is the last article</br></br></br></text>\
					</div>'
					flag = 0;
				}
 				return;
 			}
 			else{
 				page+=10;
 				data = data.result;
 				var type
 				for (var i in data){
 					if(data[i].type=="review"){
 						type = "Review";
					}
					else{
						type = "Question";
					}
					generator(data,type,i);
 				}
 			}
 		});
     }
});

//This function generates a post displayed on the HTML based on given data.
function generator(data,type,i){
	document.getElementById("content").innerHTML += '<div class="post">\
			<div class="metadata">\
				<text> New '+type+' added to Topic:<a href="/topics/'+data[i].target_topic+'">'+data[i].target_topic+'</a>, posted by <a href="/users/'+data[i].author+'/show">'+data[i].author+'</a></text>\
				<img align="right" class="ava" src="icon2.png" alt="Mountain View" style="width:40px;height:40px;"></img>\
			</div>\
		<text class="title"><a href="/posts/'+data[i]._id.valueOf()+'/show">'+data[i].title+'</a> </text></br>\
		<text class="cont">'+data[i].text+'</br></br></br></text>\
\
		<div>\
			<a><button class="uvButton" onClick="uVote(\''+data[i]._id.valueOf()+'\')"><a id="'+data[i]._id.valueOf()+'upvote" score="'+data[i].upvotes+'">Upvote ('+data[i].upvotes+')</a></button></a>,\
			<a><button class="dvButton" onClick="dVote(\''+data[i]._id.valueOf()+'\')"><a id="'+data[i]._id.valueOf()+'downvote" score="'+data[i].downvotes+'">Downvote ('+data[i].downvotes+')</a></button></a>, <label class="check" id="'+data[i]._id.valueOf()+'3" value2="'+data[i]._id.valueOf()+'" for="toggle" onClick="comment(\''+data[i]._id.valueOf()+'\', \''+data[i]._id.valueOf()+'comment\')" value="OFF" view="NOT"><button>Show recently comments</button></label>  \
			<div id="'+data[i]._id.valueOf()+'" class="modal"><h2>Recently comments by other users... </h2><p id="'+data[i]._id.valueOf()+'comment" class="new_cc"></p> </div>\
		</div>\
\
		<div class="Main">     \
	         <div class="Input_Box" id="'+data[i]._id.valueOf()+'2">     \
	           	<textarea class="Input_text"  id="'+data[i]._id.valueOf()+'input"></textarea>     \
	           	<div class="faceDiv"></div>     \
	           	<div for="toggle" class="Input_Foot" > <a class="imgBtn" ></a><a class="postBtn" id="value" onClick="send(\''+data[i]._id.valueOf()+'\',\''+data[i]._id.valueOf()+'comment\')">Send</a> </div> \
	    	</div>     \
        </div> \
		</div>';

}