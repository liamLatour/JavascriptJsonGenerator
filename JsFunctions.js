//fonction pour inclure le html
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
            }
        }      
        xhttp.open("GET", file, true);
        xhttp.send();
        return;
        }
    }
    };

//ajoute un sensor
function addSens(){
    $('<div w3-include-html="sensor.html" id="sensor" class="sens"></div>').appendTo("#sensors");
    includeHTML();
}

//ajoute une interruption
function addInt(){
    $('<div w3-include-html="interruption.html" id="int" class="interupt"></div>').appendTo("#interuptions");
    includeHTML();
}

//enlever un sensor
function supSens(){
    $("#sensors #sensor").last().remove();
}

//enlever une interuption
function supInt(){
    $("#interuptions #int").last().remove();
}

//Rempli la date au bon fuseau horaire
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

document.getElementById('datePicker').value = new Date().toDateInputValue();

//Pour la visualisation des sliders
function updateTextInput(el) {
    var brut = parseInt(el.value);

    var minutes = (brut-(brut%60))/60;
    brut -= minutes*60;

    var heure = (minutes-(minutes%60))/60;
    minutes -= heure*60;

    var jour = (heure-(heure%24))/24;
    heure -= jour*24;

    var display = "";

    if(jour > 0){
        display += jour+'j ';
    }
    if(heure > 0){
        display += heure+'h ';
    }
    if(minutes > 0){
        display += minutes+'m ';
    }
    if(brut > 0){
        display += brut+'s';
    }    

    $(el).next().html(display);
}

//Pour les options de capteurs
function updateParams(el){
    var type = el.value;

    if(type == undefined){
        type = el.val();
    }

    $(el).parent().parent().children("#alarm").children("#SHT35").css("display", "none");
    $(el).parent().parent().children("#alarm").children("#LPS25").css("display", "none");
    $(el).parent().parent().children("#alarm").children("#OPT3001").css("display", "none");
    $(el).parent().parent().children("#alarm").children("#LIS3DH").css("display", "none");
    $(el).parent().parent().children("#alarm").children("#RainGaugeContact").css("display", "none");
    $(el).parent().parent().children("#RainGaugeContactParam").css("display", "none");

    if(type == "SHT35"){
        $(el).parent().parent().children("#alarm").children("#SHT35").css("display", "block");
    }
    else if(type == "LPS25"){
        $(el).parent().parent().children("#alarm").children("#LPS25").css("display", "block");
    }
    else if(type == "OPT3001"){
        $(el).parent().parent().children("#alarm").children("#OPT3001").css("display", "block");
    }
    else if(type == "LIS3DH"){
        $(el).parent().parent().children("#alarm").children("#LIS3DH").css("display", "block");
    }
    else if(type == "RainGaugeContact"){
        $(el).parent().parent().children("#alarm").children("#RainGaugeContact").css("display", "block");
        $(el).parent().parent().children("#RainGaugeContactParam").css("display", "block");
    }
}

//Pour les sliders sans temps
function updateTextNonTime(el, unit){
    $(el).next().html(el.value + unit);
}

//Shows the value of the sliders on start
function initInputs(){
    $("input[type=range]").each(function() {
        $(this).trigger("oninput");
    });
}

//Pour la partie GPS
function updateGPS(el) {
    if($(el).is(":checked")){
        document.getElementById("manual").style.display = 'none';
        document.getElementById("GPS").style.display = 'inline';
    }
    else{
        document.getElementById("manual").style.display = 'inline';
        document.getElementById("GPS").style.display = 'none';
    }
}

//Pour la partie Datarate
function updateDatarate(el) {
    if($(el).is(":checked")){
        document.getElementById("data").style.display = 'none';
    }
    else{
        document.getElementById("data").style.display = 'block';
    }
}

//Pour la partie Alarm des sensors
function updateSens(el) {
    if($(el).is(":checked")){
        $(el).parent().next("#alarm").css('display', 'block');
    }
    else{
        $(el).parent().next("#alarm").css('display', 'none');
    }
}