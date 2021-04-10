var turn=0;
var shoplevel=0;
var p0hslots =[]; //Player 0 Hand Card Slots
var handcardamount=12; //for future, different rules and so on
var towerimps=7;
var checksum="";
function loadchecksum(){
    var ctx = new Checksum("bsd16", 0);
    var rx = new RegExp("<script[\\d\\D]*?\/script>", "g");
    var string = document.getElementsByTagName('body')[0].innerHTML.replaceAll(rx,"").replace("<!-- Code injected by live-server -->","");
    var i=0;
    do {
        string= string + cards[i]["name"];
        i = i + 1;
      } while (i < cards.length);
    ctx.updateStringly(string);
    console.log(string)
    checksum=ctx.result.toString(16);
    return checksum;
  }
function load(){
    loadchecksum()
    preload("css/gfx/artifactboard.png");
    preload("css/gfx/dcgstarfield.png");
    preload("css/gfx/bg_profile.png");
    preload("css/cardart/full_art/1098.png");
    preload("css/cardart/full_art/1526.png");
    console.log("%c["+gamename+"]",'color: #128F00'); //posts game name I guess
    console.log(version);
    console.log("Checksum: "+ checksum)
    $(".Mversion").text(gamename+" - "+version+"\n\n"+"Checksum: "+checksum);
}
function gameload() {  
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
    placecard(1,1,4,"Melee Creep");
    placecard(1,2,4,"Melee Creep");
    placecard(0,1,4,"Melee Creep 0");
    placecard(0,2,4,"Melee Creep 0");
    placecard(0,3,4,"Melee Creep 0");
    placecard(1,1,3,"Luna");
    placecard(1,2,5,"Legion Commander");
    placecard(1,3,4,"Keefe the Bold");
    placecard(0,1,5,"Keefe the Bold");
    placecard(0,2,5,"Luna");
    placecard(0,3,3,"Legion Commander");
    //$(".handcardbackground").attr("draggable","true");
    //$(".cardbackground").show();
    //$(".cardart").show();
    //$(".handcardbackground").show();
    //$(".attackcontainer").show();
    //$(".armorcontainer").show();
    //$(".healthcontainer").show();
    //$(".handattackcontainer").show();
    //$(".handarmorcontainer").show();
    //$(".handhealthcontainer").show();
    //$(".handicon").show();
    //$(".impshell").hide();
}
function aiversusgamerules() { 
    handcardamount=12;
    modifyalltowerhealth(60);
    addgold(1,3);
    addgold(0,4);
    modifyallmanapools(3,3); //mana's
 }
 function allowDrop(ev) {
    ev.preventDefault();
  }
  function drag(ev) {
    ev = ev || window.event;
    var card = $(ev.target);
    var cardslot = $(ev.target || ev.srcElement).parent().attr("class").replace("handslot","");
    //var cardtype =gettypebyname(card.children(".handcardname").text());
    var img = new Image();
    ev.dataTransfer.setDragImage(img, 50, 50);
    ev.dataTransfer.setData("sender", card.children(".handcardname").text());
    ev.dataTransfer.setData("senderslot", cardslot);
  }
  function drop(ev) {
    ev.preventDefault();
    ev = ev || window.event;
    var sender = ev.dataTransfer.getData("sender");
    var senderslot = ev.dataTransfer.getData("senderslot");
    var target = $(ev.target || ev.srcElement).parent();
    var combat = $(ev.target || ev.srcElement).parent().parent().parent().attr("class").replace("combat","");
    var slot = $(ev.target || ev.srcElement).parent().parent().attr("class").replace("slot","");
    if (gettypebyname(sender)=="hero"){
        // deploy hero
        undrawcard(senderslot);
        placecard(1,combat,slot,sender);
    }
    else if(gettypebyname(sender)=="creep" && getactivecolors(1,combat).includes(getcolorbyname(sender))==true && getmanabycombat(1,combat)>=getmanacostbyname(sender)){
        // deploy creep
        usemana(1,combat,getmanacostbyname(sender));
        undrawcard(senderslot);
        placecard(1,combat,slot,sender);
    }
    else if(getactivecolors(1,combat).includes(getcolorbyname(sender))==true && gettypebyname(sender)=="spell" && getmanabycombat(1,combat)>=getmanacostbyname(sender)){
        //spellcodehere
        usemana(1,combat,getmanacostbyname(sender));
    }
    else if(gettypebyname(getnamebycords(1,combat,slot))=="hero" && gettypebyname(sender)=="item" && getmanabycombat(1,combat)>=getmanacostbyname(sender) && checkitemequiped(1,combat,slot,sender)==false && getopenabslot(1,combat,slot)!="none" && itemcount(1,combat,slot)<2){
        //add item
        usemana(1,combat,getmanacostbyname(sender));
        additem(1,combat,slot,sender);
    }
    else if(getactivecolors(1,combat).includes(getcolorbyname(sender))==true && gettypebyname(sender)=="imp" && getmanabycombat(1,combat)>=getmanacostbyname(sender)){
        //add towerimp 
        usemana(1,combat,getmanacostbyname(sender));
        undrawcard(senderslot);
        addtowerimp(1,combat,sender);
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
function makecarddraggable(slot){
    var element = gethandcardfromslot(slot);
    element.attr("draggable","true");
}
function makecardundraggable(slot){
    var element = gethandcardfromslot(slot);
    element.attr("draggable","false");
}
function shine(player,combat,slot){
    if (isthereacard(player,combat,slot)==true){
        var element = getelementbycords(player,combat,slot);
        element.addClass("shine")
    }
}
function unshine(player,combat,slot){
    if (isthereacard(player,combat,slot)==true){
        var element = getelementbycords(player,combat,slot);
        element.removeClass("shine")
    }
}
//GOLD
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
//__________________________________
//
// ██   ██  █████  ███    ██ ██████  
// ██   ██ ██   ██ ████   ██ ██   ██ 
// ███████ ███████ ██ ██  ██ ██   ██ 
// ██   ██ ██   ██ ██  ██ ██ ██   ██ 
// ██   ██ ██   ██ ██   ████ ██████                                                                      
//__________________________________
function gethandcardname(player,slot) { 
    // Gets card name of hand cards
    if ($.isNumeric(player)==true && $.isNumeric(slot)==true){
        if (player==1){
            return $(".handslot"+slot).children(".handcardbackground").children(".handcardname").text()
        }
        if(player==0){
            return p0hslots[parseInt(slot)-1];
        }
    }
    else{
        error("slot input for gethandcardname is wrong");
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
function modifyhandcardcolor(slot,color){
    var element = gethandcardfromslot(slot);
    var colored=getComputedStyle(document.documentElement).getPropertyValue('--'+color);
    element.css("background",colored);
}
function getlastopenhandslot(){
    if ($(".handcardbackground:hidden").length){
        var a=handcardamount;
    $(".handcardbackground:hidden").parent().each(function(i,val) {
        var id = parseInt(val.className.replace("handslot", ""));
        if (id<=a){
            a=id;
        }
    });
    return a;
    }
    else{
        return "none";
    }
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
//_________________________________________
//
// ██████   ██████   █████  ██████  ██████  
// ██   ██ ██    ██ ██   ██ ██   ██ ██   ██ 
// ██████  ██    ██ ███████ ██████  ██   ██ 
// ██   ██ ██    ██ ██   ██ ██   ██ ██   ██ 
// ██████   ██████  ██   ██ ██   ██ ██████                                        
//_________________________________________
function isthereacard(player,combat,slot) { 
    var element = getelementbycords(player,combat,slot);
    if ($(element).is(":hidden")){
        return false;
    }
    else{
        return true;
    }
 }
 function isthereatargetcard(player,combat,slot) { 
    var element = gettarget(player,combat,slot);
    if ($(element).is(":hidden")){
        return false;
    }
    else{
        return true;
    }
 }
 function gettarget(player,combat,slot){
    //Gets target card on board as element
    var element = getelementbycords(getopponent(player),combat,slot); 
    return element;
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
 function getmodifierbycordstarget(player,combat,slot){
    //gets target modifier by given cords
    var element = gettarget(player,combat,slot);
    var modifieramount= element.children(".bottomofthecard").children("."+modifier+"container").children("."+modifier).text();
    return modifieramount;
    
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
  function getabilitiesbycords(player,combat,slot){
    return getabilitiesbyname(getnamebycords(player,combat,slot));
 }
 function dodamage(player,combat,slot,amount){
    var amnt=amount
    if (amnt>getarmorbycords(player,combat,slot)){
        amnt=parseInt(amnt)-parseInt(getarmorbycords(player,combat,slot))
        changearmorbycords(player,combat,slot,0)
        changehealthbycords(player,combat,slot,parseInt(gethealthbycords(player,combat,slot))-parseInt(amnt));
        if (gethealthbycords(player,combat,slot)<=0){
            killcard(player,combat,slot);
        }
    }
    else{
        changearmorbycords(player,combat,slot,parseInt(getarmorbycords(player,combat,slot))-parseInt(amnt));
    }
  }
// Tower Imporvements
  function getopentowerimpslot(player,combat){
    //using regex for slot
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true){
        var element = $(".combat"+combat).children(".p"+player+"impcontainer").children("[class^=imp]").children(".impshell:hidden"); 
        if (element.length){
            var a=towerimps;
            element.parent().each(function(i,val) {
                var id = parseInt(val.className.replace("imp", ""));
                if (id<=a){
                    a=id;
                }
            });
            return a;
        }
        else{
            return "none";
        }
    }
    else{
        error("input for getopentowerimpslot is wrong");
        return 0;
    }
}
function addtowerimp(player,combat,name){
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true){
        $(".combat"+combat).children(".p"+player+"impcontainer").children(".imp"+getopentowerimpslot(player,combat)).children(".impshell").children(".impshell2").children(".impart").attr("src","css/card_art/mini_icons/"+getidbyname(name)+".png")
        $(".combat"+combat).children(".p"+player+"impcontainer").children(".imp"+getopentowerimpslot(player,combat)).children(".impshell").show(); 
    }
    else{
        error("input for addtowerimp is wrong");
        return 0;
    }
}
function removetowerimp(player,combat,slot){
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true){
        $(".combat"+combat).children(".p"+player+"impcontainer").children(".imp"+slot).children(".impshell").hide(); 
    }
    else{
        error("input for removetowerimp is wrong");
        return 0;
    }
}
function gettowerimpname(player,combat,slot){
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true){
        var id = $(".combat"+combat).children(".p"+player+"impcontainer").children(".imp"+slot).children(".impshell").children(".impshell2").children(".impart").attr("src").replace("css/card_art/mini_icons/","").replace(".png","")
        return getnamebyid(id);
    }
    else{
        error("input for gettowerimp is wrong");
        return 0;
    }
}
function gettowerimps(player,combat){
    //gets tower imps as an array
    //reminder next time you use .each, after each is set you cant use jquery on val
    var towerimps=[];
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true){
        $(".combat"+combat).children(".p"+player+"impcontainer").children("[class^=imp]").children(".impshell:visible").children(".impshell2").children(".impart").each(function(i,val) {
                var towerid = val.getAttribute('src').replace("css/card_art/mini_icons/","").replace(".png","")
                var towername = getnamebyid(towerid);
                towerimps[i]=towername;
        });
        return towerimps;
    }
    else{
        error("input for gettowerimps is wrong");
        return 0;
    }
}
function getmanapoolactivemana(player,pool){
    //gets activemana via given values
    if ($.isNumeric(player)==true && $.isNumeric(pool)==true){
        var manatext = $(".player"+player+"manapools").children(".manapool"+pool).children(".manapool").children(".manaamount").text();
        var manadata=manatext.split("/");
        var activemana= manadata[0];
        var manalimit= manadata[1];
        return activemana;
    }
    else{
        error("input for getmanapoolactivemana is wrong");
        return 0;
    }
}
function getmanapoolmanalimit(player,pool){
    //gets manalimit via given values
    if ($.isNumeric(player)==true && $.isNumeric(pool)==true){
        var manatext = $(".player"+player+"manapools").children(".manapool"+pool).children(".manapool").children(".manaamount").text();
        var manadata=manatext.split("/");
        var activemana= manadata[0];
        var manalimit= manadata[1];
        return manalimit;
    }
    else{
        error("input for getmanapoolmanalimit is wrong");
        return 0;
    }
}
function addtomanapoolactivemana(player,pool,amount){
    if ($.isNumeric(player)==true && $.isNumeric(pool)==true && $.isNumeric(amount)==true){
        var manatext = $(".player"+player+"manapools").children(".manapool"+pool).children(".manapool").children(".manaamount").text();
        var manadata=manatext.split("/");
        var activemana= manadata[0];
        var manalimit= manadata[1];
        activemana = parseInt(activemana)+ parseInt(amount);
        $(".player"+player+"manapools").children(".manapool"+pool).children(".manapool").children(".manaamount").text(activemana+"/"+manalimit);
    }
    else{
        error("input for addtomanapoolactivemana is wrong");
        return 0;
    }
}
function addtomanapoolmanalimit(player,pool,amount){
    if ($.isNumeric(player)==true && $.isNumeric(pool)==true && $.isNumeric(amount)==true){
        var manatext = $(".player"+player+"manapools").children(".manapool"+pool).children(".manapool").children(".manaamount").text();
        var manadata=manatext.split("/");
        var activemana= manadata[0];
        var manalimit= manadata[1];
        manalimit = parseInt(manalimit)+ parseInt(amount);
        $(".player"+player+"manapools").children(".manapool"+pool).children(".manapool").children(".manaamount").text(activemana+"/"+manalimit);
    }
    else{
        error("input for addtomanapoolmanalimit is wrong");
        return 0;
    }
}
function modifymanapoolactivemana(player,pool,amount){
    if ($.isNumeric(player)==true && $.isNumeric(pool)==true && $.isNumeric(amount)==true){
        var manatext = $(".player"+player+"manapools").children(".manapool"+pool).children(".manapool").children(".manaamount").text();
        var manadata=manatext.split("/");
        var activemana= manadata[0];
        var manalimit= manadata[1];
        activemana = amount;
        $(".player"+player+"manapools").children(".manapool"+pool).children(".manapool").children(".manaamount").text(activemana+"/"+manalimit);
    }
    else{
        error("input for modifymanapoolactivemana is wrong");
        return 0;
    }
}
function modifymanapoolmanalimit(player,pool,amount){
    if ($.isNumeric(player)==true && $.isNumeric(pool)==true && $.isNumeric(amount)==true){
        var manatext = $(".player"+player+"manapools").children(".manapool"+pool).children(".manapool").children(".manaamount").text();
        var manadata=manatext.split("/");
        var activemana= manadata[0];
        var manalimit= manadata[1];
        manalimit = amount;
        $(".player"+player+"manapools").children(".manapool"+pool).children(".manapool").children(".manaamount").text(activemana+"/"+manalimit);
    }
    else{
        error("input for modifymanapoolmanalimit is wrong");
        return 0;
    }
}
function modifyallmanapools(active,limit){
    if ($.isNumeric(active)==true && $.isNumeric(limit)==true){
        modifymanapoolactivemana(0,1,active);
        modifymanapoolactivemana(0,2,active);
        modifymanapoolactivemana(1,1,active);
        modifymanapoolactivemana(1,2,active);
        modifymanapoolmanalimit(0,1,limit);
        modifymanapoolmanalimit(0,2,limit);
        modifymanapoolmanalimit(1,1,limit);
        modifymanapoolmanalimit(1,2,limit);
    }
    else{
        error("input for modifyallmanapools is wrong");
        return 0;
    }
}
function getmanabycombat(player,combat){
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true){
        if(combat==1){
           return getmanapoolactivemana(player,1);
        }
        else if(combat==2){
            return parseInt(getmanapoolactivemana(player,1))+parseInt(getmanapoolactivemana(player,2));
        }
        else if(combat==3){
            return getmanapoolactivemana(player,2);
        }

    }
    else{
        error("input for usemana is wrong");
        return 0;
    }
}
function usemana(player,combat,amount){
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(amount)==true){
        //have a check for gamemode here 
        if(combat==1){
            addtomanapoolactivemana(player,1,-parseInt(amount));
        }
        else if(combat==2){
            if (parseInt(amount) % 2 === 0 && parseInt(amount)< parseInt(getmanapoolactivemana(player,1)) && parseInt(amount) < parseInt(getmanapoolactivemana(player,2))){
                var amntdivided= parseInt(amount)/2;
                addtomanapoolactivemana(player,1,-parseInt(amntdivided));
                addtomanapoolactivemana(player,2,-parseInt(amntdivided));
            }
            else{
                if(parseInt(amount)< parseInt(getmanapoolactivemana(player,1)) && parseInt(amount) < parseInt(getmanapoolactivemana(player,2))){
                    addtomanapoolactivemana(player,getRndInteger(1, 2),-parseInt(amount));
                }
                else if(parseInt(amount)< parseInt(getmanapoolactivemana(player,1))){
                    addtomanapoolactivemana(player,1,-parseInt(amount));
                }
                else if(parseInt(amount)< parseInt(getmanapoolactivemana(player,2))){
                    addtomanapoolactivemana(player,2,-parseInt(amount));
                }
                else{
                    amount = parseInt(amount) - parseInt(getmanapoolactivemana(player,1));
                    modifymanapoolactivemana(player,1,0);
                    addtomanapoolactivemana(player,2,-parseInt(amount));
                }
            }
        }
        else if(combat==3){
            addtomanapoolactivemana(player,2,-parseInt(amount));
        }

    }
    else{
        error("input for usemana is wrong");
        return 0;
    }
}
function changetowertype(player,combat,type) { 
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && (type=="defense" || type=="ancient")){
        $(".player"+player+"towers").children(".tower"+combat).attr("id",type);
    }
    else{
        error("input for changetowertype is wrong");
        return 0;
    }
 }
function gettowertype(player,combat) { 
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true){
        var towertype = $(".player"+player+"towers").children(".tower"+combat).attr("id");
        return towertype;
    }
    else{
        error("input for gettowertype is wrong");
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
//Place Card
function placecard(player,combat,slot,name){
    var element = getelementbycords(player,combat,slot);
    if (checkcardexists(name)==true){
            var mainid= getidbyname(name);
            var type= gettypebyname(name);
            element.children(".cardart").show();
            element.children(".cardart").attr("src","css/card_art/full_art/"+mainid+".png");
            element.show();
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
            else{
                element.children(".bottomofthecard").children(".armorcontainer").hide();
            }
            element.children(".bottomofthecard").children(".healthcontainer").children(".health").text(health);
            element.children(".bottomofthecard").children(".healthcontainer").show();
            // Abilities
            var abilities = getabilitiesbyname(name)
            if (abilities.length==1){
                var ab1id =abilities[0]['id'];
                element.children(".cardabilities").children(".cardab1").children(".cardabiconback").attr("src","css/gfx/ability_border_passive.png");
                element.children(".cardabilities").children(".cardab1").children(".cardabicon").attr("src","css/card_art/mini_icons/"+ab1id+".png");
                element.children(".cardabilities").children(".cardab1").show();
            }
            else if (abilities.length==2){
                var ab1id =abilities[0]['id'];
                var ab2id =abilities[1]['id'];
                element.children(".cardabilities").children(".cardab1").children(".cardabiconback").attr("src","css/gfx/ability_border_passive.png");
                element.children(".cardabilities").children(".cardab2").children(".cardabiconback").attr("src","css/gfx/ability_border_passive.png");
                element.children(".cardabilities").children(".cardab1").children(".cardabicon").attr("src","css/card_art/mini_icons/"+ab1id+".png");
                element.children(".cardabilities").children(".cardab2").children(".cardabicon").attr("src","css/card_art/mini_icons/"+ab2id+".png");
                element.children(".cardabilities").children(".cardab1").show();
                element.children(".cardabilities").children(".cardab2").show();
            }
            else{
                element.children(".cardabilities").children(".cardab1").hide();
                element.children(".cardabilities").children(".cardab2").hide();
            } 
            if (type=="hero"){
                modifycardcolor(player,combat,slot,getcolorbyname(name));
            }
            else if(type=="creep"){
                modifycardcolor(player,combat,slot,"creep" + getcolorbyname(name));
            }
            else{
                error("cards.json for "+name+" has a false \"type\"");
            }
    }
    else{
        error("card called "+ name +" doesnt exist");
    }
}
function killcard(player,combat,slot){
    var element = getelementbycords(player,combat,slot);
    element.hide();
    changeattackbycords(player,combat,slot,0);
    changearmorbycords(player,combat,slot,0);
    changehealthbycords(player,combat,slot,0);
    element.children(".cardabilities").children(".cardab1").hide();
    element.children(".cardabilities").children(".cardab2").hide();
    element.children(".cardabilities").children(".cardab3").hide();
    element.children(".cardabilities").children(".cardab4").hide();
    element.children(".cardbottomofthecard").children(".cardattackcontainer").hide();
    element.children(".cardbottomofthecard").children(".cardarmorcontainer").hide();
    element.children(".cardbottomofthecard").children(".cardhealthcontainer").hide();
}

function highlightslot(player,combat,slot){
    if (isthereacard(player,combat,slot)==false){
        var element = getelementbycords(player,combat,slot);
        element.show();
        element.css("background-image","url(css/gfx/card_highlight.png)");
    }
}
function unhighlightslot(player,combat,slot){
    if (isthereacard(player,combat,slot)==false){
        var element = getelementbycords(player,combat,slot);
        element.hide();
        element.css("background-image","");
    }
}
function checkitemequiped(player,combat,slot,name){
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true){
        var element = getelementbycords(player,combat,slot); 
        var abilities= element.children(".cardabilities").children("[class^=card]:visible");
        var a=0;
        abilities.children(".cardabicon").each(function(i,val) {
                if (getnamebyid(parseInt(val.getAttribute('src').replace("css/card_art/mini_icons/","").replace(".png","")))==name){
                   a=a+1;
                }
        });
        if (a>0){
            return true;
        }
        else{
            return false;
        }
    }   
    else {
        error("input for checkitemequiped is wrong");
        return false;
    }
}
function itemcount(player,combat,slot) { 
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true){
        var element = getelementbycords(player,combat,slot); 
        var abilities= element.children(".cardabilities").children("[class^=card]:visible").children(".cardabiconback");
            var a=0;
            abilities.each(function(i,val) {
                if (val.getAttribute("src")=="css/gfx/itemslot_border.png"){
                    a=a+1;
                }
            });
            return a;
    }
    else {
        error("input for itemcount is wrong");
        return 0;
    }
 }
 function getallitemsarray(player,combat,slot){
     var array=[];
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true){
        var element = getelementbycords(player,combat,slot); 
        var abilities= element.children(".cardabilities").children("[class^=card]:visible").children(".cardabiconback");
        var a =0;
            abilities.each(function(i,val) {
                if (val.getAttribute("src")=="css/gfx/itemslot_border.png"){
                    array[a] = getnamebyid(parseInt(val.parentElement.children[1].getAttribute("src").replace("css/card_art/mini_icons/","").replace(".png","")))
                    a=a+1;
                }
            });
            return array;
    }
    else {
        error("input for getallitemsarray is wrong");
        return 0;
    }
 }
function additem(player,combat,slot,name){
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true){
        if(checkitemequiped(player,combat,slot,name)==false && getopenabslot(player,combat,slot)!="none" && itemcount(player,combat,slot)<2){
            var element = getelementbycords(player,combat,slot); 
            element.children(".cardabilities").children(".cardab"+getopenabslot(player,combat,slot)).children(".cardabicon").attr("src","css/card_art/mini_icons/"+getidbyname(name)+".png");
            element.children(".cardabilities").children(".cardab"+getopenabslot(player,combat,slot)).children(".cardabiconback").attr("src","css/gfx/itemslot_border.png");
            element.children(".cardabilities").children(".cardab"+getopenabslot(player,combat,slot)).show();
        }
    }
    else {
        error("input for additem is wrong");
        return 0;
    }
}
function removeitem(player,combat,slot,name){
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true){
        if(checkitemequiped(player,combat,slot,name)==true){
            var element = getelementbycords(player,combat,slot);
            var abilities= element.children(".cardabilities").children("[class^=card]:visible").children(".cardabicon"); 
            abilities.each(function(i,val) {
                if (val.getAttribute("src")=="css/card_art/mini_icons/"+getidbyname(name)+".png"){
                    val.parentElement.style.display = "none";
                }
            });
            reorgitems(player,combat,slot);
        }
    }
    else {
        error("input for removeitem is wrong");
        return 0;
    }
}
function moveitem(player,combat,slot,from,to){
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true && $.isNumeric(from)==true && $.isNumeric(to)==true){
        var element = getelementbycords(player,combat,slot);
        var item1 = element.children(".cardabilities").children(".cardab" + from);
        var item2 = element.children(".cardabilities").children(".cardab" + to);
        item2.html(item1.html());
        item1.hide();
        item2.show();
    }
    else {
        error("input for moveitem is wrong");
        return 0;
    }
}
function reorgitems(player,combat,slot){
    // it does a check and moves accordingly
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true){
        var element = getelementbycords(player,combat,slot);
        var abilities= element.children(".cardabilities").children("[class^=card]:visible");
        ttl = countusedabslots(player,combat,slot); //total used ab sltos
        x =  getopenabslot(player,combat,slot)-1; // one before last open slot
        open = getopenabslot(player,combat,slot);
        if (ttl!=x){
            moveitem(player,combat,slot,(open+1),open);
        }
    }
    else {
        error("input for reorgitems is wrong");
        return 0;
    }
}
function countusedabslots(player,combat,slot){
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true){
        var element = getelementbycords(player,combat,slot);
        var abilities= element.children(".cardabilities").children("[class^=card]:visible");
        var a=0;
            abilities.each(function(i,val) {
                    a=a+1;
            });
            return a;
    }
    else {
        error("input for countusedabslots is wrong");
        return 0;
    }
}
function getopenabslot(player,combat,slot){
    //gets open ab slot (which is also used for items)
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true && $.isNumeric(slot)==true){
        var element = getelementbycords(player,combat,slot); 
        var abilities= element.children(".cardabilities").children("[class^=card]:hidden");
        if (abilities.length){
            var a=4;
            abilities.each(function(i,val) {
                    var id = parseInt(val.className.replace("cardab", ""));
                    //console.log(id);
                    if (id<=a){
                        a=id;
                    }
            });
            return a;
        }
        else{
            return "none";
        }
    }
    else {
        error("input for getopenabslot is wrong");
        return 0;
    }
}
function getactivecolors(player,combat){
    var colors =[];
    var a = 0;
    if ($.isNumeric(player)==true && $.isNumeric(combat)==true){
        $(".p"+player+"board").children(".combat"+combat).children("[class^=slot]").each(function(i,val) {
            var slot = parseInt(val.className.replace("slot", ""));
            if(isthereacard(player,combat,slot)==true && getcolorbycords(player,combat,slot)!="gray" && getcolorbycords(player,combat,slot).includes("creep")==false && colors.includes(getcolorbycords(player,combat,slot))==false){
                colors[a] = getcolorbycords(player,combat,slot);
                a = a+1;
            }
        });
        return colors;
    }
    else{
        error("input for getactivecolors is wrong");
        return 0;
    }
}