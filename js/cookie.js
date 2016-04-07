//Set a cookie given name, value, and expiration date
function setCookie(cname, cvalue, exdays) {
    alert("Setting Cookie");
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
//Get a value of a specific name from the cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
//Check if a "username" cookie exists
function checkCookie() {
    var username=getCookie("username");
    if (username!="") {
        return username;
    }else{
        return null;
    }
}
function checkCookieID() {
    var username=getCookie("session_id");
    if (username!="") {
        return username;
    }else{
        return null;
    }
}
//Sign out Google account
function signOut() {
    alert("singing Out");
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}
//Delete website cookie, including sigining out google account if exists
function deleteCookie(){
    signOut();
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    location.reload() 
}



