navigator.geolocation.getCurrentPosition(function(pos){
document.getElementById("location").value =
pos.coords.latitude + "," + pos.coords.longitude;
});