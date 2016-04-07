

function uVote(post_id){

    alert(post_id);
    item = document.getElementById(post_id+"upvote");
    var upload = {"username":checkCookie()};
    $.post("/posts/"+post_id+"/upvote", upload, function(data){
        var result = JSON.parse(data);
        if(result.result == "0"){
            alert("Can not vote more than once!");
            return;
        }
        else{
            //alert(item.getAttribute('score'));
            item.innerHTML = "Upvotes (" +String(parseInt(item.getAttribute('score'))+1)+")";
        }
    });

};


function dVote(post_id){

    alert(post_id);
    item = document.getElementById(post_id+"downvote");
    var upload = {"username":checkCookie()};
    $.post("/posts/"+post_id+"/downvote", function(data){
        var result = JSON.parse(data);
        if(result.result == "0"){
            alert("Can not vote more than once!");
            return;
        }
        else{
            item.innerHTML = "Downvotes (" +String(parseInt(item.getAttribute('score'))+1)+")";
        }
    });
};
        


function comment(ele, item){
    
    var upload = {"username":checkCookie()};
    if(upload.username !== null){
        
        $.post("/posts/"+ele+"/comments", function(data){
            //alert("here2");
            var result = JSON.parse(data);
            //alert(result.result.length);
            
         

            var id = ele;
            //alert(id);

            var check_value = document.getElementsByClassName("check");

            va = document.getElementById(id+'3').getAttribute("value");

            for(var i = 0, length = check_value.length; i <= length; i++){

                if(va == "OFF"){
                    var elements = document.getElementById(id+"2");
                    elements.style.display = 'block';

                    var elements1 = document.getElementById(id);
                    elements1.style.display = 'block';

                    var elements2 = document.getElementById(id+'3');
                    elements2.setAttribute('value', 'ON');

                    if(elements2.getAttribute('view') == 'NOT'){
                        elements2.setAttribute('view','YES');
                        for(var i=0; i<result.result.length; i++){
                            appendNewComment(result.result[i],item);
                        }
                    }

                }
                else{
                    var elements = document.getElementById(id+"2");
                    elements.style.display = 'none';
                    
                    var elements1 = document.getElementsByClassName("modal");
                    for(var i = 0, length = elements1.length; i < length; i++) {
                          elements1[i].style.display = 'none';
                    }
                
                    var elements2 = document.getElementById(id+'3');
                    elements2.setAttribute('value', 'OFF');

                }
            }
        });

   }
   else{
        alert('You have to login in order to comment');
   }

}



    function send(ele, item){
        //alert(ele);
        
        var userCookie = {"username":checkCookie()};
        var curr_user = userCookie.username;
        var new_input = document.getElementById(ele+'input').value;
        if(new_input.length == 0){
            alert("What is your review for this? Please type something on the comment shell~ :)");
            
        }else{
            var time = new Date();
            var par = document.createElement("P"); // Create a <p> node
            var t1 = document.createTextNode(time);// Create a text node
            par.appendChild(t1);

            var element1 = document.getElementById(item);
            element1.appendChild(par);
                                              // Append the text to <p>
            var user_n = curr_user;
            var pa = document.createElement("P");  // Create a <p> node
            var t0 = document.createTextNode(user_n); // Create a text node
            pa.appendChild(t0);     
            pa.style.background = 'white';                        
            var img = document.createElement('img');
            img.style.height='60px';
            img.style.width='60px';
            src=person.result[0].user_profile;
            img.src = src;  

            var t = document.createTextNode("  :      " +new_input); // Create a text node
            pa.appendChild(t);

            element1.appendChild(img);
            element1.appendChild(pa);

            var send_to_server = {"author":checkCookie(), "text": new_input, "post_type": JSON.stringify(["reply"]), "reply_to": ele , "topics": JSON.stringify([])};
            //alert("here");
            $.post("/p", send_to_server,function(data){
                //alert("yes");
                var result = JSON.parse(data);
                alert(result.result);
            
            });
            $('.Input_text').val('');

        }
    
 }


    function appendNewComment(data, item){
        var new_input = data.text;

        var time = data.created_at;
        //alert(time);
        var par = document.createElement("P"); // Create a <p> node
        var t1 = document.createTextNode(time);// Create a text node
        par.appendChild(t1);

        var element1 = document.getElementById(item);
        element1.appendChild(par);// Append the text to <p>
                                  

        var user_n = data.author;
        var pa = document.createElement("P");    // Create a <p> node
        var t0 = document.createTextNode(user_n);// Create a text node
        pa.appendChild(t0);     
        pa.style.background = 'white';                        
        var img = document.createElement('img');
        img.style.height='60px';
        img.style.width='60px';
        //src=data.user_profile;
        src=person.result[0].user_profile;
        img.src = src;  

        var t = document.createTextNode("  :      " +new_input);// Create a text node
        pa.appendChild(t);

        element1.appendChild(img);
        element1.appendChild(pa);

        //$('.Input_text').val('');

    }
    var person = {"result":[
    {
        _id: "1998",
        username: "Hongwei1",
        user_profile: "http://zt.comicyu.com/UploadFiles/DMZT/2009/11/20091120135629.jpg",
        "comments":"这部电影真好看",
        "time":"2015/6/7"
    },
    {
        _id: "19982",
        username: "Hongwei2",
        user_profile: "http://science-all.com/images/apple/apple-02.jpg",
        "comments":"主角演的真不错",
        "time":"2015/6/8"
    }
    ]};


