var script = document.createElement("script");
script.type="text/javascript";
script.src="jquery-1.11.3.min.js"
document.getElementsByTagName('head')[0].appendChild(script);

var record = {time,temperature,humidity}
function getRecord(){
    $.ajax({
        url:"/getRecord",
        type:"get",
        success(data){
            return data;
        }
    })
}