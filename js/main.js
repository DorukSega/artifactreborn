var isdeploying=false;
var iscombating=false;
var isshopping=false;
var turn=0;
//Player 0 Hand Card Slots
var p0hslot1 ="";
var p0hslot2="";
var p0hslot3="";
var p0hslot4="";
var p0hslot5="";
var p0hslot6="";
var p0hslot7="";
var p0hslot8="";
var p0hslot9="";
var p0hslot10="";
var p0hslot11="";
var p0hslot12="";
var cards;
var jsonreq= $.getJSON("cards.json", function(result) {
     cards = result["cards"];
});

//disables right click document.addEventListener('contextmenu', event => event.preventDefault()) 
function error(nmbr){
    console.log("Error "+nmbr);
}
var elem = document.documentElement;
function gofullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem = window.top.document.body; //To break out of frame in IE
        elem.msRequestFullscreen();
      }
}
function load(){
    
    console.log(getlorebyname("Luna"));
    aiversusgamerules() //for now
    $(".cardbackground").show();
    $(".handcardbackground").show();
    $(".attackcontainer").show();
    $(".armorcontainer").show();
    $(".healthcontainer").show();
    $(".handattackcontainer").show();
    $(".handarmorcontainer").show();
    $(".handhealthcontainer").show();
    $(".handicon").show();
    //$(".impshell").hide();
    //console.log(window.innerWidth)
    //console.log(window.innerHeight)
}
function gamelogic() { 

    //Shuffle Phase
    //Deploy Phase
    //Combat Phase
    //Shop Phase
    
}
function aiversusgamerules() { 
    //Add 3 gold at start
    addgold(1,3);
    addgold(0,3);
    
 }

 
function getopponent(player){
    //Gets the id of opponent
    if (player==1){
        return 0;
    } else if (player==0){
        return 1;
    } else {
        error("player number input for getopponent is wrong");
        return 0;
    }
}
function gettarget(player,combat,slot){
    //Gets target card on board as element
    var element = getelementbycords(getopponent(player),combat,slot); 
    return element;
}
function getgold(player){
    //gets gold via given player id
    if ($.isNumeric(player)==true){
        var goldamount = $(".p"+player+"goldcontainer").children(".goldamount").text();
        return goldamount;
    }
    else{
        error("player number input for getgold is wrong");
        return 0;
    }
}
function addgold(player,amount){
    //adds gold via given player id
    if ($.isNumeric(player)==true && $.isNumeric(amount)==true){
        var goldamount = $(".p"+player+"goldcontainer").children(".goldamount").text();
        var newamount = parseInt(goldamount) +parseInt(amount);
        $(".p"+player+"goldcontainer").children(".goldamount").text(newamount)
        return "Added "+(newamount) +" Gold";
    }
    else{
        error("input for addgold is wrong");
        return 0;
    }
}
function gettowerhealth(player,combat){
    //gets tower health via given player id and combat number
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true){
        var towerhealth = $(".player"+player+"towers").children(".tower"+combat).text();
        return towerhealth;
    }
    else{
        error("input for gettowerhealth is wrong");
        return 0;
    }
}
function getelementbycords(player,combat,slot) { 
    //returns element directly, will be user to turn variables into one quickly. 
    //var element = getelementbycords(player,combat,slot); //for other functions
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true){
        var element = $(".p"+player+"board").children(".combat"+combat).children(".slot"+slot).children(".cardbackground");
        return element
    }else{
        error("input for getelementbycords is wrong");
        return 0;
    }
}
function getplayername(player) { 
    //gets playername from playerarea
    //in future make it so it gets from variable in code maybe
    if ($.isNumeric(player)==true){
        return $(".Player"+player+"Area").text();
    }
    else{
        error("player id input for getplayername is wrong");
        return 0;
    }
}
function changeplayername(player,name){
    //changes player name, currently only visually
    if ($.isNumeric(player)==true){
        $(".Player"+player+"Area").children(".playerarea").text(name);
    }
    else{
        error("player id input for changeplayername is wrong");
    }
}
function gethandcardname(player,slot) { 
    // Gets card name of hand cards
    if ($.isNumeric(player)==true && $.isNumeric(slot)==true){
        if (player==1){
            return $(".handslot"+slot).children(".handcardbackground").children(".handcardname").text()
        }
        if(player==0){
            return window["p0hslot"+slot];
        }
    }
    else{
        error("slot input for gethandcardname is wrong");
    }
 }
function getemptycardslots(){
    //this doesnt work. suppose to return emptycardslots
    var slotnmbrs= [];
    var combatnmbrs=[];
    var playernmbrs=[];
    var i;
    $(".cardbackground:hidden").parent().each(function(i,val) {
        slotnmbrs[i]=val.className;
    });
    $(".cardbackground:hidden").parent().parent().each(function(i,val) {
        combatnmbrs[i]=val.className;
        
    });
    $(".cardbackground:hidden").parent().parent().parent().each(function(i,val) {
        playernmbrs[i]=val.className;
        console.log(i);
    });
    //console.log(playernmbrs);
    //console.log(combatnmbrs);
    return slotnmbrs;
}
function getcardadjent(slotnumber) {
    //gets slot numbers of given slot's adjents 
   if (slotnumber>1 & slotnumber<7 ){
       var slots = [(slotnumber-1),(slotnumber+1)];
       return  slots;
   } else if(slotnumber == 7){       
       var slots = [6];
       return  slots;
   } else if(slotnumber == 1){
       var slots = [2];
       return  slots;
   } else{
       error("slot number for getcardadjent is wrong");
       return 0;
   }
 }
 function getmodifierbycords(player,combat,slot,modifier) {
    //gets modifier by given cords
    var element = getelementbycords(player,combat,slot);
    var modifieramount= element.children(".bottomofthecard").children("."+modifier+"container").children("."+modifier).text();
    
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
 