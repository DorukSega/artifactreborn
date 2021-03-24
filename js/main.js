var isdeploying=false;
var iscombating=false;
var isshopping=false;
function error(nmbr){
    console.log("Error "+nmbr);
}
function load(){
    console.log(getcardadjent(1))
}
function gamestart() { 
    //Shuffle Phase
    //Deploy Phase
    //Combat Phase
    //Shop Phase

}
 function getemptycardslots(){

 }
 function getcardadjent(slotnumber) { 
    if (slotnumber>1 & slotnumber<7 ){
        var slots = [(slotnumber-1),(slotnumber+1)]
        return  slots;
    } else if(slotnumber == 7){
        var slots = [6]
        return  slots;
    } else if(slotnumber == 1){
        var slots = [2]
        return  slots;
    } else{
        error("slot number for getcardadjent is wrong")
        return 0;
    }
  }