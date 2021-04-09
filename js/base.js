var gamename="Artifact_Reborn";
var errorcount=0;
//document.addEventListener('contextmenu', event => event.preventDefault()); //disables right click
function error(input){
    errorcount=errorcount+1;
    console.log("%c["+errorcount+"]%c["+gamename+"_Error]"+"%c > "+"%c" + input, 'color: #00128F','color: #128F00','color: #0600B2', 'color: #CF5353');
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