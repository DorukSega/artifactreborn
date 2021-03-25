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
document.addEventListener('contextmenu', event => event.preventDefault()) //disables right click
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
    
    //$("iframe").css("width",window.innerWidth);
    //$("iframe").css("height",window.innerHeight);
    $(".cardbackground").show();
    $(".handcardbackground").show();
    $(".attackcontainer").show();
    $(".armorcontainer").show();
    $(".healthcontainer").show();
    //$(".impshell").hide();
    //console.log(window.innerWidth)
    //console.log(window.innerHeight)
}
function gamestart() { 
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
    //var element = getelementbycords(player,combat,slot); for other functions
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