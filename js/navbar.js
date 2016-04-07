//If cookie exists, udpate the up-right corner login information.
if (checkCookie() != null){
    document.getElementById('sta').innerHTML = '<a href="javascript:deleteCookie()" ><font color="white">'+checkCookie()+'</font></a>';
}

$(document).ready(function(){
    //When searched button on the Nav bar clicked
    var sub_button = $("#sub_button");
    sub_button.click(function(){
        document.getElementById("TopicTitle").innerHTML = "Topic: ";
        document.getElementById("QuestionTitle").innerHTML = "Question: ";
        document.getElementById("ArticleTitle").innerHTML = "Article: ";
        document.getElementById("bar").focus();
        var content = $('#bar').val();
        //If search bar is empty, do nothing
        if (content == ""){
            return;
        }
        //Replace all the space for the Internet data transition
        while(content.includes(' ')){
            content = content.replace(' ','+');
        }
        //Send GET request to server to search
        $.get("/search/"+
        content,
        function(data,status){
            //alert("Data: " + data + "\nStatus: " + status);
            var jsondata = JSON.parse(data);
            //If Topic  found
            if (jsondata.found != "0"){
                document.getElementById("TopicTitle").innerHTML += ("<a href=''>   "+jsondata.found+"</a>");
            }
            else{
                document.getElementById("TopicTitle").innerHTML += (" No Result")
            }
            //If Question found
            if (jsondata.questions.length){
                for (var i in jsondata.question){
                    document.getElementById("QuestionTitle").innerHTML += ("<a href='' id="+jsondata.questions[i].id+">   "+jsondata.questions[i].post+"</a>");
                }
            }
            else{
                    document.getElementById("QuestionTitle").innerHTML += ("No Result");
            }
            //If review found
            if (jsondata.reviews.length){
                for (var i in jsondata.reviews){
                    document.getElementById("ArticleTitle").innerHTML += ("<a href='' id="+jsondata.reviews[i].id+">   "+jsondata.reviews[i].post+"</a>");
                }
            }
            else{
                document.getElementById("ArticleTitle").innerHTML += ("No Result");
            }
        });
    });
});

/*SearchBar Mask Effect*/
function show(){
    var div_obj = $("#pop-div");
        var posLeft = ($(window).width() - div_obj.width()) / 5;
        var posTop = 50;
  
        //Adding and Showing Mask
        $("<div id='mask'></div>").addClass("mask")     
                                  .appendTo("body")   
                                  .fadeIn(200); 
                                  
        div_obj.css({"top": posTop , "left": posLeft}).fadeIn(); 
}
//Search result pop up
document.getElementById("bar").onfocus=function(){
    show();
}
//Input bar on input event, simultaneously search the result
document.getElementById("bar").oninput=function(){
    document.getElementById("TopicTitle").innerHTML = "Topic: ";
    document.getElementById("QuestionTitle").innerHTML = "Question: ";
    document.getElementById("ArticleTitle").innerHTML = "Article: ";
    var content = $('#bar').val();
    if (content == ""){
        return;
    }
    while(content.includes(' ')){
    content = content.replace(' ','+');
    }

    $.get("/search/"+
    content,
    function(data,status){
    //alert("Data: " + data + "\nStatus: " + status);
    var jsondata = JSON.parse(data);
    if (jsondata.found != "0"){
        var url = '/topics/'+jsondata.found;
        document.getElementById("TopicTitle").innerHTML += ("<a href=' "+url+"'>"+jsondata.found+"</a>");
    }
    else{
        document.getElementById("TopicTitle").innerHTML += (" No Result")
    }
    if (jsondata.questions.length){
        for (var i in jsondata.questions){
            var url = '/posts/'+jsondata.questions[i].id+'/show';
            document.getElementById("QuestionTitle").innerHTML += ("<a href='"+url+"' id="+jsondata.questions[i].id+">   "+jsondata.questions[i].post+"</a>");
        }
    }
    else{
            document.getElementById("QuestionTitle").innerHTML += ("No Result");
    }
    if (jsondata.reviews.length){
        for (var i in jsondata.reviews){
            var url = '/posts/'+jsondata.reviews[i].id+'/show';
            document.getElementById("ArticleTitle").innerHTML += ("<a href='"+url+"' id="+jsondata.reviews[i].id+">   "+jsondata.reviews[i].post+"</a>");
        }
    }
    else{
        document.getElementById("ArticleTitle").innerHTML += ("No Result");
    }
    });
}
//If out of focus, fade out the mask and the pop up window
document.getElementById("bar").onblur=function(){
    $("#mask").fadeOut();
    $("#pop-div").fadeOut();
    $(".mask").fadeOut();                
}
