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
    setTimeout(function(){ 
        initInputs();
    }, 50);
}

//ajoute une interruption
function addInt(){
    $('<div w3-include-html="interruption.html" id="int" class="interupt"></div>').appendTo("#interuptions");
    includeHTML();
    setTimeout(function(){ 
        initInputs();
    }, 50);
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

    $(el).next().val(display);
}

//Complément des sliders à temps
function updateSliderInput(el){
    var brut = el.value.split(' ').filter(function(n){ return n != (undefined || '') });
    var fin = 0;

    for(var i=0; i<brut.length; i++){
        var char = brut[i].split(/[0-9]/).filter(function(n){ return n != (undefined || '') });
        var num = brut[i].replace(/[^0-9]/g, '');

        if(char == 'j'){
            fin += num*86400;
        }
        else if(char == 'h'){
            fin += num*3600;
        }
        else if(char == 'm'){
            fin += num*60;
        }
        else if(char == 's'){
            fin += num;
        }
    }

    $(el).prev().val(fin);
}


//Pour les options de capteurs
function updateParams(el){
    var type = el.value;

    if(type == undefined){
        type = el.val();
    }
    
    type = translateName(type);

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
    $(el).next().val(el.value + unit);
}

//Complément des sliders sans temps
function updateSliderNonTime(el){
    $(el).prev().val(el.value.replace(/[^0-9]/g, ''));
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

//Traduit les entrées utilisateurs pour la machine
function translateName(name){
    if(name == "Humidité_température"){
        return "SHT35";
    }
    else if(name == "Pression"){
        return "LPS25";
    }
    else if(name == "Luminosité"){
        return "OPT3001";
    }
    else if(name == "Mouvement"){
        return "LIS3DH";
    }
    else if(name == "Pluviomètre"){
        return "RainGaugeContact";
    }
    else if(name == "iHumidité_température"){
        return "SHT35_INT";
    }
    else if(name == "iPression"){
        return "LPS25_INT";
    }
    else if(name == "iLuminosité"){
        return "OPT3001_INT";
    }
    else if(name == "iMouvement"){
        return "LIS3DH_INT";
    }
    else if(name == "SPI"){
        return "SPI_INT";
    }
    else if(name == "I2C"){
        return "I2C_INT";
    }
    else if(name == "UART"){
        return "USART_INT";
    }
    else if(name == "SDI-12"){
        return "SDI12_INT";
    }
    else if(name == "SDI"){
        return "SDI_INT";
    }
    else if(name == "OPTO1"){
        return "OPTO1_INT";
    }
    else if(name == "OPTO2"){
        return "OPTO2_INT";
    }
    else if(name == "INT_1"){
        return "INT1_INT";
    }
    else if(name == "INT_2"){
        return "INT2_INT";
    }
    else{
        return name;
    }
}

//Complementary function
function translateAcr(name){
    if(name == "SHT35"){
        return "Humidité_température";
    }
    else if(name == "LPS25"){
        return "Pression";
    }
    else if(name == "OPT3001"){
        return "Luminosité";
    }
    else if(name == "LIS3DH"){
        return "Mouvement";
    }
    else if(name == "RainGaugeContact"){
        return "Pluviomètre";
    }
    else if(name == "SHT35_INT"){
        return "iHumidité_température";
    }
    else if(name == "LPS25_INT"){
        return "iPression";
    }
    else if(name == "OPT3001_INT"){
        return "iLuminosité";
    }
    else if(name == "LIS3DH_INT"){
        return "iMouvement";
    }
    else if(name == "SPI_INT"){
        return "SPI";
    }
    else if(name == "I2C_INT"){
        return "I2C";
    }
    else if(name == "UART_INT"){
        return "USART";
    }
    else if(name == "SDI12_INT"){
        return "SDI-12";
    }
    else if(name == "SDI_INT"){
        return "SDI";
    }
    else if(name == "OPTO1_INT"){
        return "OPTO1";
    }
    else if(name == "OPTO2_INT"){
        return "OPTO2";
    }
    else if(name == "INT1_INT"){
        return "INT_1";
    }
    else if(name == "INT2_INT"){
        return "INT_2";
    }
    else{
        return name;
    }
}