var gamename="Artifact Reborn";
var version="Latest";
var errorcount=0;
//gets version
var xmlhttp = new XMLHttpRequest();
var url = "https://api.github.com/repos/doruksega/artifactreborn/commits/master";
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.responseText);
        if(result["commit"]["message"].includes("Version")){
          version = result["commit"]["message"].split("\n")[0];
        } 
    }
};
xmlhttp.open("GET", url, false);
xmlhttp.send();
//document.addEventListener('contextmenu', event => event.preventDefault()); //disables right click
function error(input){
    errorcount=errorcount+1;
    console.log("%c["+errorcount+"]%c["+gamename+"_Error]"+"%c > "+"%c" + input, 'color: #00128F','color: #128F00','color: #0600B2', 'color: #CF5353');
}
function preload() { 
  var img=new Image();
  img.src=url;
 }
function getRndInteger(min, max) {
    var maxreal = parseInt(max) + 1  
    return Math.floor(Math.random() * (maxreal - parseInt(min))) + parseInt(min);
  }
function gofullscreen() {
    var elem = document.documentElement;
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
//for zoom
function zoomtocombat(combat){
    if (combat==1){
        zoom.to({
            x: 300,
            y: 180,
            width: 700,
            height: 700
          });
    }
    else if (combat==2){
        zoom.to({
            x: 625,
            y: 180,
            width: 700,
            height: 700
          });
    }
    else if (combat==3){
        zoom.to({
            x: 940,
            y: 180,
            width: 700,
            height: 700
          });
    }
 }
 function reload(){
    location.reload();
}
function decodedeck(input){
    var data = CArtifactDeckDecoder.ParseDeck(input);
    return data;
}
var commits;
function menuload(){
  $(".Mversion").text(gamename+" - "+version);
    loadnews();
    preload("css/gfx/artifactboard.png");
    preload("css/gfx/dcgstarfield.png");
    preload("css/gfx/bg_profile.png");
    loadallcardart();
}
function loadnews(){
  var logtext="";
  var url = "https://api.github.com/repos/doruksega/artifactreborn/events";
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.responseText);
        commits=result;
        var i=0;
        do {
          try {
            if (result[i]["payload"]["commits"][0]["message"].includes("Version")){
              logtext=logtext+ result[i]["payload"]["commits"][0]["message"] +"\n\n"
            }
          } catch (error) {
          }
          i=i+1;
        } while (i < commits.length-1);
      }
  };
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
  $(".Pcommitlog").text(logtext);
}
function news(){
  if ($(".P").is(":hidden")==true){
    $(".P").show();
    $(".S").hide();
  }
  else {
    $(".P").hide();
}
}
function settings(){
  if ($(".S").is(":hidden")==true){
    $(".S").show();
    $(".P").hide();
  }
  else {
    $(".S").hide();
}
}
function Mlogo(){
  if ($(".Mlogo").hasClass("Mlogoanimforw")){
    $(".M").show();
    $(".I").hide();
    $(".I").addClass("hide");
    $(".M").removeClass("hide");
    $(".Mlogo").removeClass("Mlogoanimforw");
    $(".Mlogo").addClass("Mlogoanimback");
    $(".menupage").children(".boardbackground").attr("src","css/gfx/temp_background.png")
  }
  else{
    $(".M").hide();
    $(".I").show();
    $(".I").removeClass("hide");
    $(".Mlogo").addClass("Mlogoanimforw");
    $(".Mlogo").removeClass("Mlogoanimback");
    $(".M").addClass("hide");
    $(".menupage").children(".boardbackground").attr("src","css/gfx/dcgstarfield.png")
  }
}
function Ibutton(type){
  $(".Iinnersolo").hide();
  $(".Ibutton").removeClass("Ibuttonselected");
  if(type=="solo" & $(".Isolo").hasClass("Ibuttonselected")==false){
    $(".Isolo").addClass("Ibuttonselected");
    $(".Iinnersolo").show();
  }
  else{
    $(".Isolo").removeClass("Ibuttonselected");
    $(".Iinnersolo").hide();
  }
  if(type=="mm" & $(".Imatchmaking").hasClass("Ibuttonselected")==false){
    $(".Imatchmaking").addClass("Ibuttonselected");
  }
  else{
    $(".Imatchmaking").removeClass("Ibuttonselected");
  }
  if(type=="col" & $(".Icollection").hasClass("Ibuttonselected")==false){
    $(".Icollection").addClass("Ibuttonselected");
  }
  else{
    $(".Icollection").removeClass("Ibuttonselected");
  }
  if(type=="lead" & $(".Ileadboard").hasClass("Ibuttonselected")==false){
    $(".Ileadboard").addClass("Ibuttonselected");
  }
  else{
    $(".Ileadboard").removeClass("Ibuttonselected");
  }
}
function playartifact(){
  Mlogo();
  $(".Ibutton").removeClass("Ibuttonselected");
  $(".Isolo").addClass("Ibuttonselected");
  $(".Iinnersolo").show();
}
function cardcollection(){
  Mlogo();
  $(".Ibutton").removeClass("Ibuttonselected");
  $(".Icollection").addClass("Ibuttonselected");
  $(".Iinnersolo").hide();
}
function Iplay(){
  $(".P").hide();
  $(".S").hide();
  $(".gamearea").show();
  $(".menupage").hide();
  gameload();
}