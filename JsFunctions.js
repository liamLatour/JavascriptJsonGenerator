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
    if(checkAvailableInts() != ""){
        $("#plusInt").prop("disabled", false);
    }
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
    $(el).parent().parent().children("#onealarm").removeClass("one");
    $(el).parent().parent().children("#alarm").children("#oneset").addClass("one");
    $(el).parent().parent().children("#alarm").children("#oneclear").removeClass("one");

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
        $(el).parent().parent().children("#onealarm").addClass("one");
        $(el).parent().parent().children("#alarm").children("#oneset").removeClass("one");
        $(el).parent().parent().children("#alarm").children("#oneclear").addClass("one");
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

    $("input[type=checkbox]").each(function() {
        $(this).trigger("onchange");
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

function checkAvailableInts(text){
    var possibilities = [
        '<option value="iHumidité_température">iHumidité_température</option>',
        '<option value="iPression">iPression</option>',
        '<option value="iLuminosité">iLuminosité</option>',
        '<option value="iMouvement">iMouvement</option>',
        '<option value="SPI">SPI</option>',
        '<option value="I2C">I2C</option>',
        '<option value="UART">UART</option>',
        '<option value="SDI-12">SDI-12</option>',
        '<option value="SDI">SDI</option>',
        '<option value="OPTO1">OPTO1</option>',
        '<option value="OPTO2">OPTO2</option>',
        '<option value="INT_1">INT_1</option>',
        '<option value="INT_2">INT_2</option>'
        ];

    var final = [
        '<option value="iHumidité_température">iHumidité_température</option>',
        '<option value="iPression">iPression</option>',
        '<option value="iLuminosité">iLuminosité</option>',
        '<option value="iMouvement">iMouvement</option>',
        '<option value="SPI">SPI</option>',
        '<option value="I2C">I2C</option>',
        '<option value="UART">UART</option>',
        '<option value="SDI-12">SDI-12</option>',
        '<option value="SDI">SDI</option>',
        '<option value="OPTO1">OPTO1</option>',
        '<option value="OPTO2">OPTO2</option>',
        '<option value="INT_1">INT_1</option>',
        '<option value="INT_2">INT_2</option>'
        ];

    var regExp = /\>([^<]+)\</;

    for(var i=0; i<possibilities.length; i++){
        var current = regExp.exec(possibilities[i])[1];
        var ints = document.getElementsByClassName("INT");

        for(var j=0; j< ints.length; j++){

            if($(ints[j]).val().indexOf(current) >= 0){
                final = jQuery.grep(final, function(value) {
                    return value != possibilities[i];
                });
            }
        }
    }

    if(text != "" && text != undefined){
        for(var i=0; i<possibilities.length; i++){
            var current = regExp.exec(possibilities[i])[1];
            if(text.indexOf(current) >= 0){
                final.push(possibilities[i]);
            }
        }
    }

    return final.filter(function(n){ return n != (undefined || '') }).sort();
}

function dropDown(el){
    if($(el).next().attr('id') == "intname"){
        var lol = checkAvailableInts($(el).next().val());
        $(el).next().html(lol);
    }

    $(el).css('display', 'none');
    $(el).next().css('display', 'block');
}

function dropUp(el){
    $(el).css('display', 'none');
    $(el).prev().css('display', 'block');

    var remastered = [];

    for(var i=0; i<$(el).val().length; i++){
        if($(el).val()[i] != ''){
            remastered.push($(el).val()[i]);
        }
    }
    
    $(el).val(remastered);

    if($(el).val() != undefined && $(el).val() != ''){
        $(el).prev().html($(el).val().join('<br/>'));
    }
    else{
        $(el).prev().html("Sélectionner");
    }

    $("#plusInt").prop("disabled", false);
    if(checkAvailableInts() == ""){
        $("#plusInt").prop("disabled", true);
    }
}

var alertmodal = document.getElementById("alertModal");
function Alert(tosay, tobe){
    $(tobe).css('background-color', 'rgb(200, 200, 200)');
    $(tobe).css('color', 'red');


    $(alertmodal).css('display', 'block');
    $(alertmodal).find('p').html(tosay);


    $('html, body').animate({
        scrollTop: $(tobe).offset().top - 50
    }, 800);

    $("#generatedLink").remove();
    return false;
}