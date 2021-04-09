var cards;
//this is a json call for chrome and edge since they can keep up
var jsonreq= $.getJSON("cards.json", function(result) {
    cards = result["cards"];
});
if (cards==undefined){
//This here is a sync call because mozilla cant keep up
var xmlhttp = new XMLHttpRequest();
var url = "cards.json";
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.responseText);
        cards = result["cards"];
    }
};
xmlhttp.open("GET", url, false);
xmlhttp.send();
}
function checkcardexists(name){
   var i =0;
   var data="";
   do {
       if(cards[i]["name"]==name){
           data= cards[i];
       }
       i = i + 1;
     } while (i < cards.length);
   if (data==""){
       return false;
   }
   else{
       return true;
   } 
}
function getsomethingbyname(name,something) {
    //gets something by given name
    var i =0;
    do {
        if(cards[i]["name"]==name){
            return cards[i][something];
        }
        i = i + 1;
      } while (i < cards.length);
 }
 function getdatabyid(id) {
    //gets data by given id
    var i =0;
    do {
        if(cards[i]["id"]==id){
            return cards[i];
        }
        i = i + 1;
      } while (i < cards.length);
 }
 function getnamebyid(id) {
    //gets name by given id
    var i =0;
    do {
        if(cards[i]["id"]==id){
            return cards[i]["name"];
        }
        i = i + 1;
      } while (i < cards.length);
 }
 function getdatabyname(name) {
    //gets data by given name
    var i =0;
    do {
        if(cards[i]["name"]==name){
            return cards[i];
        }
        i = i + 1;
      } while (i < cards.length);
 }
 function getcolorbyname(name) {
    //gets color by given name
    return getsomethingbyname(name,"color");
 }
 function getattackbyname(name) {
    //gets attack by given name
    return getsomethingbyname(name,"attack");
 }
 function getarmorbyname(name) {
    //gets armor by given name
    return getsomethingbyname(name,"armor");
 }
 function gethealthbyname(name) {
    //gets health by given name
    return getsomethingbyname(name,"health");
 }
 function getgoldcostbyname(name) {
    //gets goldcost by given name
    return getsomethingbyname(name,"goldcost");
 }
 function getmanacostbyname(name) {
    //gets manacost by given name
    return getsomethingbyname(name,"manacost");
 }
 function getsignaturebyname(name) {
    //gets signature by given name
    return getsomethingbyname(name,"signature");
 }
 function getspecialactionbyname(name) {
    //gets special action by given name
    return getsomethingbyname(name,"specialaction");
 }
 function getidbyname(name) {
    //gets id by given name
    return getsomethingbyname(name,"id");
 }
 function getbountybyname(name) {
    //gets bounty by given name
    return getsomethingbyname(name,"bounty");
 }
 function getchargesbyname(name) {
    //gets charges by given name
    return getsomethingbyname(name,"charges");
 }
 function geteffectdescbyname(name) {
    //gets effectdesc by given name
    return getsomethingbyname(name,"effectdesc");
 }
 function gettypebyname(name) {
    //gets type by given name
    return getsomethingbyname(name,"type");
 }
 function checkifherobyname(name){
     if(gettypebyname(name)=="hero"){
         return true;
     }
     else{
         return false;
     }
 }
 function getlorebyname(name) {
    //gets lore by given name
    return getsomethingbyname(name,"lore");
 }
 function getabilitiesbyname(name) {
    //gets abilities by given name
    // it also deletes unactive ones
    var abilities =getsomethingbyname(name,"abilities");
    var newabilities=[];
    var i =0;
    var a =0;
    do {
        if(abilities[i]["active"]==true){
            newabilities[a]=abilities[i];
            a=a+1
        }
        i = i + 1;
      } while (i < abilities.length);
    return newabilities;
 }
 