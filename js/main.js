var isdeploying=false;
var iscombating=false;
var isshopping=false;
var turn=0;
var shoplevel=0;
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
var handcardamount=12; //for future, different rules and so on
//this is a json call for chrome and edge since they can keep up
var jsonreq= $.getJSON("cards.json", function(result) {
    cards = result["cards"];
});
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
//document.addEventListener('contextmenu', event => event.preventDefault()); //disables right click
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
    aiversusgamerules() //for now
    drawcard("Legion Standard Bearer");
    drawcard("Cursed Satyr");
    drawcard("Back For More");
    drawcard("Keefe the Bold");
    drawcard("Timbersaw");
    drawcard("Crystal Maiden");
    drawcard("The Omexe Arena");
    drawcard("Stonehall Cloak");
    drawcard("Luna");
    placecard(1,1,2,"Timbersaw");
    placecard(1,1,3,"Luna");
    placecard(1,1,4,"Melee Creep");
    placecard(1,1,5,"Legion Standard Bearer");
    placecard(1,1,7,"Crystal Maiden");
    placecard(0,1,3,"Keefe the Bold");
    placecard(0,1,4,"Melee Creep 0");
    placecard(0,1,5,"Luna");
    placecard(0,1,6,"Melee Creep 0");
    //undrawcard(2);
    //drawcard("Keefe the Bold");
    //$(".cardbackground").show();
    //$(".handcardbackground").show();
    //$(".attackcontainer").show();
    //$(".armorcontainer").show();
    //$(".healthcontainer").show();
    //$(".handattackcontainer").show();
    //$(".handarmorcontainer").show();
    //$(".handhealthcontainer").show();
    //$(".handicon").show();
    getlastopenhandslot()
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
    modifyalltowerhealth(60);
    addgold(1,3);
    addgold(0,3);
 }
function placecard(player,combat,slot,name){
    var element = getelementbycords(player,combat,slot);
    if (checkcardexists(name)==true){
            var mainid= getidbyname(name);
            modifycardcolor(player,combat,slot,getcolorbyname(name))
            var type= gettypebyname(name);
            element.children(".cardart").attr("src","css/card_art/full_art/"+mainid+".png");
            element.show();
            //element.children(".cardart").css("height","98px");
            // >> attack armor health <<
            var attack = getattackbyname(name);
            var armor = getarmorbyname(name);
            var health = gethealthbyname(name);
            element.children(".bottomofthecard").children(".attackcontainer").children(".attack").text(attack);
            element.children(".bottomofthecard").children(".attackcontainer").show();
            if (armor!=0){
                element.children(".bottomofthecard").children(".armorcontainer").children(".armor").text(armor);
                element.children(".bottomofthecard").children(".armorcontainer").show();
            }
            element.children(".bottomofthecard").children(".healthcontainer").children(".health").text(health);
            element.children(".bottomofthecard").children(".healthcontainer").show();
            // Abilities
            var abilities = getabilitiesbyname(name)
            if (abilities.length==1){
                var ab1id =abilities[0]['id'];
                element.children(".cardabilities").children(".cardfirstab").children(".cardabicon").attr("src","css/card_art/mini_icons/"+ab1id+".png");
                element.children(".cardabilities").children(".cardfirstab").show();
            }
            else if (abilities.length==2){
                var ab1id =abilities[0]['id'];
                var ab2id =abilities[1]['id'];
                element.children(".cardabilities").children(".cardfirstab").children(".cardabicon").attr("src","css/card_art/mini_icons/"+ab1id+".png");
                element.children(".cardabilities").children(".cardsecondab").children(".cardabicon").attr("src","css/card_art/mini_icons/"+ab2id+".png");
                element.children(".cardabilities").children(".cardfirstab").show();
                element.children(".cardabilities").children(".cardsecondab").show();
            } 
            //these can be used later
            if (type=="hero"){
                
            }
            else if(type=="creep"){
            }
            else{
                error("cards.json for "+name+" has a false \"type\"");
            }
    }
    else{
        error("card called "+ name +" doesnt exist");
    }
}
//for zoom
$(document).ready(function() {
   // $(".c1").zoomTarget();
   // $(".c2").zoomTarget();
   // $(".c3").zoomTarget();
});
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
function modifytowerhealth(player,combat,amount){
    //modifies tower health via given player id and combat number
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true){
       $(".player"+player+"towers").children(".tower"+combat).children(".outershell").children(".tower").text(amount);
    }
    else{
        error("input for gettowerhealth is wrong");
        return 0;
    }
}
function addtowerhealth(player,combat,amount){
    //adds tower health via given player id and combat number
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true){
       $(".player"+player+"towers").children(".tower"+combat).children(".outershell").children(".tower").text(parseInt(amount)+parseInt(gettowerhealth(player,combat)));
    }
    else{
        error("input for gettowerhealth is wrong");
        return 0;
    }
}
function modifyalltowerhealth(amount){
    //modifies tower health via given number
    modifytowerhealth(1,1,amount);
    modifytowerhealth(1,2,amount);
    modifytowerhealth(1,3,amount);
    modifytowerhealth(0,1,amount);
    modifytowerhealth(0,2,amount);
    modifytowerhealth(0,3,amount);
}
function drawcard(name){
    var slot = getlastopenhandslot();
    if (checkcardexists(name)==true){
        if (slot!="none" ){
            var element = gethandcardfromslot(slot);
            var mainid= getidbyname(name);
            modifyhandcardcolor(slot,getcolorbyname(name));
            var type= gettypebyname(name);
            element.children(".handcardart").attr("src","css/card_art/full_art/"+mainid+".png");
            element.children(".handcardname").text(name);
            element.children(".handcardname").css("font-size",(22-(name.length*0.3))+"px"); //auto scales font size
            
            element.show();
            element.children(".handcardart").css("height","220px");
            if (type=="hero"){
                element.children(".handicon").attr("src","css/card_art/hero_icons/"+mainid+".png");
                element.children(".handicon").show();
                element.children(".handiconback").show();
                element.children(".handiconback").css("height","24px");
                element.children(".handiconback").attr("src","css/gfx/GreyCircle.png");
                // >> attack armor health <<
                var attack = getattackbyname(name);
                var armor = getarmorbyname(name);
                var health = gethealthbyname(name);
                element.children(".handbottomofthecard").children(".handattackcontainer").children(".handattack").text(attack);
                element.children(".handbottomofthecard").children(".handattackcontainer").show();
                if (armor!=0){
                    element.children(".handbottomofthecard").children(".handarmorcontainer").children(".handarmor").text(armor);
                    element.children(".handbottomofthecard").children(".handarmorcontainer").show();
                }
                element.children(".handbottomofthecard").children(".handhealthcontainer").children(".handhealth").text(health);
                element.children(".handbottomofthecard").children(".handhealthcontainer").show();
                // Abilities
                var abilities = getabilitiesbyname(name)
                if (abilities.length==1){
                    var ab1id =abilities[0]['id'];
                    element.children(".handabilities").children(".handfirstab").children(".handabicon").attr("src","css/card_art/mini_icons/"+ab1id+".png");
                    element.children(".handabilities").children(".handfirstab").show();
                }
                else if (abilities.length==2){
                    var ab1id =abilities[0]['id'];
                    var ab2id =abilities[1]['id'];
                    element.children(".handabilities").children(".handfirstab").children(".handabicon").attr("src","css/card_art/mini_icons/"+ab1id+".png");
                    element.children(".handabilities").children(".handsecondab").children(".handabicon").attr("src","css/card_art/mini_icons/"+ab2id+".png");
                    element.children(".handabilities").children(".handfirstab").show();
                    element.children(".handabilities").children(".handsecondab").show();
                } 
            }
            else if(type=="creep"){
                element.children(".handiconback").show();
                element.children(".handcardeffect").show();
                element.children(".handcardeffect").text(geteffectdescbyname(name))
                element.children(".handiconback").css("height","37px");
                element.children(".handiconback").css("top","-8px");
                element.children(".handcardmanacost").css("font-size",31+"px");
                element.children(".handcardmanacost").text(getmanacostbyname(name));
                element.children(".handcardmanacost").show();
                element.children(".handiconback").attr("src","css/gfx/mana_bg_small.png");
                element.children(".handcardeffect").css("background-image","url(gfx/cardcreep_translucent.png);");
                // >> attack armor health <<
                var attack = getattackbyname(name);
                var armor = getarmorbyname(name);
                var health = gethealthbyname(name);
                element.children(".handbottomofthecard").children(".handattackcontainer").children(".handattack").text(attack);
                element.children(".handbottomofthecard").children(".handattackcontainer").show();
                if (armor!=0){
                    element.children(".handbottomofthecard").children(".handarmorcontainer").children(".handarmor").text(armor);
                    element.children(".handbottomofthecard").children(".handarmorcontainer").show();
                }
                element.children(".handbottomofthecard").children(".handhealthcontainer").children(".handhealth").text(health);
                element.children(".handbottomofthecard").children(".handhealthcontainer").show();
            }
            else if(type=="spell"){
                element.children(".handiconback").show();
                element.children(".handcardeffect").show();
                element.children(".handcardeffect").text(geteffectdescbyname(name));
                element.children(".handcardeffect").css("height","100px");
                element.children(".handcardart").css("height","153px"); 
                element.children(".handcardeffect").css("background-image","url(gfx/cardspell_opaque.png);");
                element.children(".handcardeffect").css("bottom","14px");
                element.children(".handiconback").css("height","37px");
                element.children(".handiconback").css("top","-8px");
                element.children(".handcardmanacost").css("font-size",31+"px");
                element.children(".handcardmanacost").text(getmanacostbyname(name));
                element.children(".handcardmanacost").show();
                element.children(".handiconback").attr("src","css/gfx/mana_bg_small.png");
                
            }
            else if(type=="imp"){
                element.children(".handiconback").show();
                element.children(".handcardeffect").show();
                element.children(".handcardeffect").text(geteffectdescbyname(name));
                element.children(".handcardeffect").css("height","100px");
                element.children(".handcardart").css("height","153px"); 
                element.children(".handcardeffect").css("background-image","url(gfx/cardspell_opaque.png);");
                element.children(".handcardeffect").css("bottom","14px");
                element.children(".handiconback").css("height","37px");
                element.children(".handiconback").css("top","-8px");
                element.children(".handcardmanacost").css("font-size",31+"px");
                element.children(".handcardmanacost").text(getmanacostbyname(name));
                element.children(".handcardmanacost").show();
                element.children(".handiconback").attr("src","css/gfx/mana_bg_small.png");
            }
            else if(type=="item"){
                element.children(".handiconback").show();
                element.children(".handcardeffect").show();
                element.children(".handcardeffect").text(geteffectdescbyname(name));
                element.children(".handcardeffect").css("height","100px");
                element.children(".handcardart").css("height","153px"); 
                element.children(".handcardeffect").css("background-image","url(gfx/carditem_back.png);");
                element.children(".handcardeffect").css("bottom","14px");
                element.children(".handiconback").css("height","37px");
                element.children(".handiconback").css("top","-8px");
                element.children(".handcardmanacost").css("font-size",31+"px");
                element.children(".handcardmanacost").text(getmanacostbyname(name));
                element.children(".handcardmanacost").show();
                element.children(".handiconback").attr("src","css/gfx/mana_bg_small.png");
                element.children(".handcardgoldcost").show();
                element.children(".handcardgoldcost").text(getgoldcostbyname(name));
            }
            else{
                error("cards.json for "+name+" has a false \"type\"");
            }
        }
        else{
            error("Hand is full"); //maybe storage system here
        }
    }
    else{
        error("card called "+ name +" doesnt exist");
    }
}
function modifyhandcardcolor(slot,color){
    var element = gethandcardfromslot(slot);
    var colored=getComputedStyle(document.documentElement).getPropertyValue('--'+color);
    element.css("background",colored);
}
function undrawcard(slot) { 
    //undraws cards, use for playing a card
    //might wanna find a way to make them go 11 9 7 5 3 1 2 4 6 8 10 12
    if (parseInt(slot)!=handcardamount){
        i=parseInt(slot);
        while (i<handcardamount) {
            var card1 = gethandcardfromslot(i+1);
            var card2 = gethandcardfromslot(i);
            card2.html(card1.html());
            modifyhandcardcolor( i , getcolorbyname( gethandcardname(1,i+1) ) );
            i= i+1;
        }
        clearcard(getlastopenhandslot()-1);
    }
    else{
        clearcard(slot)
    }
 }
 function clearcard(slot){
    var element = gethandcardfromslot(slot);
    element.hide();
    element.children(".handabilities").children(".handfirstab").hide();
    element.children(".handabilities").children(".handsecondab").hide();
    element.children(".handiconback").hide();
    element.children(".handcardmanacost").hide();
    element.children(".handcardgoldcost").hide();
    element.children(".handcardeffect").hide();
    element.children(".handicon").hide();
    element.children(".handbottomofthecard").children(".handattackcontainer").hide();
    element.children(".handbottomofthecard").children(".handarmorcontainer").hide();
    element.children(".handbottomofthecard").children(".handhealthcontainer").hide();
 }
 function movehandcard(from,to){
    var card1 = gethandcardfromslot(from);
    var card2 = gethandcardfromslot(to);
    card2.html(card1.html());
    modifyhandcardcolor( to , getcolorbyname( gethandcardname(1,from) ) );
    clearcard(from);
 }
function getlastopenhandslot(){
    if ($(".handcardbackground:hidden").length){
        var a=12
    $(".handcardbackground:hidden").parent().each(function(i,val) {
        var id = parseInt(val.className.replace("handslot", ""));
        if (id>a){
        }
        else{
            a=id
        }
    });
    return a;
    }
    else{
        return "none";
    }
}
function gethandcardfromslot(slot) { 
    //returns element directly, will be user to turn variables into one quickly. 
    //var element = gethandcardfromslot(slot); //for other functions which are for player 1
    if ($.isNumeric(slot)==true){
        var element = $(".handslot"+slot).children(".handcardbackground");
        return element;
    }else{
        error("input for gethandcardfromslot is wrong");
        return 0;
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
function getelementbycords(player,combat,slot) { 
    //returns element directly, will be user to turn variables into one quickly. 
    //var element = getelementbycords(player,combat,slot); //for other functions
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true){
        var element = $(".p"+player+"board").children(".combat"+combat).children(".slot"+slot).children(".cardbackground");
        return element;
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
 function getidbycords(player,combat,slot){
    var element = getelementbycords(player,combat,slot);
    var id= element.children(".cardart").attr("src");
    id = id.replace("css/card_art/full_art/","");
    id = id.replace(".png","")
    return id;
 }
 function getnamebycords(player,combat,slot){
    return getnamebyid(getidbycords(player,combat,slot));
 }
 
 function getmodifierbycords(player,combat,slot,modifier) {
    //gets modifier by given cords
    var element = getelementbycords(player,combat,slot);
    var modifieramount= element.children(".bottomofthecard").children("."+modifier+"container").children("."+modifier).text();
    return modifieramount;
 }
 function changemodifierbycords(player,combat,slot,modifier,amount) {
    //changes modifier by given cords
    var element = getelementbycords(player,combat,slot);
    element.children(".bottomofthecard").children("."+modifier+"container").children("."+modifier).text(amount);
 }
 function addtomodifierbycords(player,combat,slot,modifier,amount) {
    //adds to modifier by given cords
    var element = getelementbycords(player,combat,slot);
    element.children(".bottomofthecard").children("."+modifier+"container").children("."+modifier).text(parseInt(getmodifierbycords(player,combat,slot,modifier))+parseInt(amount));
 }
 function getcolorbycords(player,combat,slot) { 
    return getcolorbyname(getnamebycords(player,combat,slot));
  }
  function modifycardcolor(player,combat,slot,color) { 
    var element = getelementbycords(player,combat,slot);
    var color2=getComputedStyle(document.documentElement).getPropertyValue('--'+color)
    element.css("background",color2);
  }
  //cords
  function getmanacostbycords(player,combat,slot) {
    //gets manacost by given cords
    return getmanacostbyname(getnamebycords(player,combat,slot));
 }
 function getsignaturebycords(player,combat,slot) {
    //gets signature by given cords
    return getsignaturebyname(getnamebycords(player,combat,slot));
 }
 function getspecialactionbycords(player,combat,slot) {
    //gets special action by given cords
    return getspecialactionbyname(getnamebycords(player,combat,slot));
 }
 function getbountybycords(player,combat,slot) {
    //gets bounty by given cords
    return getbountybyname(getnamebycords(player,combat,slot));
 }
 function getchargesbycords(player,combat,slot) {
    //gets charges by given cords
    return getchargesbyname(getnamebycords(player,combat,slot));
 }
 function geteffectdescbycords(player,combat,slot) {
    //gets effectdesc by given cords
    return geteffectdescbyname(getnamebycords(player,combat,slot));
 }
  function getgoldcostbycords(player,combat,slot) { 
    return getgoldcostbyname(getnamebycords(player,combat,slot));
   }
  function gettypebycords(player,combat,slot) { 
    return gettypebyname(getnamebycords(player,combat,slot));
  }
 function getattackbycords(player,combat,slot) { 
    return getmodifierbycords(player,combat,slot,"attack");
  }
  function getarmorbycords(player,combat,slot) { 
    return getmodifierbycords(player,combat,slot,"armor");
  }
  function gethealthbycords(player,combat,slot) { 
    return getmodifierbycords(player,combat,slot,"health");
  }
  function getotalhealthbycords(player,combat,slot) { // this is health plus armor
    return parseInt(gethealthbycords(player,combat,slot))+parseInt(getarmorbycords(player,combat,slot));
  }
  function changeattackbycords(player,combat,slot,amount){
    changemodifierbycords(player,combat,slot,"attack",amount);
  }
  function addtoattackbycords(player,combat,slot,amount){
    addtomodifierbycords(player,combat,slot,"attack",amount);
  }
  function changearmorbycords(player,combat,slot,amount){
    changemodifierbycords(player,combat,slot,"armor",amount);
  }
  function addtoarmorbycords(player,combat,slot,amount){
    addtomodifierbycords(player,combat,slot,"armor",amount);
  }
  function changehealthbycords(player,combat,slot,amount){
    changemodifierbycords(player,combat,slot,"health",amount);
  }
  function addtohealthbycords(player,combat,slot,amount){
    addtomodifierbycords(player,combat,slot,"health",amount);
  }
  function dodamage(player,combat,slot,amount){
    var amnt=amount
    if (amnt>getarmorbycords(player,combat,slot)){
        amnt=parseInt(amnt)-parseInt(getarmorbycords(player,combat,slot))
        changearmorbycords(player,combat,slot,0)
        changehealthbycords(player,combat,slot,parseInt(gethealthbycords(player,combat,slot))-parseInt(amnt));
        if (gethealthbycords(player,combat,slot)<=0){
            //add killcard here
        }
    }
    else{
        changearmorbycords(player,combat,slot,parseInt(getarmorbycords(player,combat,slot))-parseInt(amnt));
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
 