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
    var heure = (brut-(brut%3600))/3600;
    brut = brut - heure*3600;
    var minutes = (brut-(brut%60))/60;
    var sec = brut - minutes*60;

    var display = "";

    if(heure > 0){
        display += heure+'h ';
    }
    if(minutes > 0){
        display += minutes+'m ';
    }

    display += sec+'s';

    $(el).next().html(display);
}

//Pour la visualisation du datarate
function updateDatarateSlider(el) {
    $(el).next().html(el.value);
}

//Pour le debounce
function updateTextInputMS(el){
    $(el).next().html(el.value + 'ms');
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

//Genère le fichier Json dans le 'div' précedemment vide
window.onload = function() {
    var a = document.getElementById("download");
    a.onclick = function() {
        //variables pour les champs fixent
        var name = document.getElementById('nom').value;
        var verbose = $("#verbose").is(":checked");
        var led = $("#led").is(":checked");
        var watchdog = $("#watchdog").is(":checked");
        var debugSerial = $("#debug").is(":checked");

        var type = document.getElementById('typenet').value;
        var devEUI = document.getElementById('deveui').value;
        var appEUI = document.getElementById('appeui').value;
        var appKey = document.getElementById('appkey').value;
        var periodSec = parseInt(document.getElementById('periodsec').value);
        var dataRate = parseInt(document.getElementById('datarate').value);
        var useAdaptativeDataRate = $("adaptData").is(":checked");

        var syncGPS = $("syncGPS").is(":checked");
        var syncGPSTimeoutSec = parseInt(document.getElementById('timeout').value);
        var syncPeriodSec = parseInt(document.getElementById('syncperiodsec').value);
        //récupère la date en entié puis la sépare
        var date = document.getElementById('datePicker').value.split('-');
        var year = parseInt(date[0]);
        var month = parseInt(date[1]);
        var day = parseInt(date[2]);
        //récupère le moment exact puis le sépare
        var moment = document.getElementById('settime').value.split(':');
        var hours = parseInt(moment[0]);
        var minutes = parseInt(moment[1]);
        var seconds = parseInt(moment[2]);

        var obj = {"name": name, 
                    "verbose": verbose,
                    "led": led,
                    "watchdog": watchdog,
                    "debugSerial": debugSerial,
                    "network": {
                        "type": type,
                        "devEUI": devEUI,
                        "appEUI": appEUI,
                        "appKey": appKey,
                        "periodSec": periodSec,
                        "dataRate": dataRate,
                        "useAdaptativeDataRate": useAdaptativeDataRate
                    },
                    "time": {
                        "syncGPS": syncGPS,
                        "syncGPSTimeoutSec": syncGPSTimeoutSec,
                        "syncPeriodSec": syncPeriodSec,
                        "manualUTC": {
                            "year": year,
                            "month": month,
                            "day": day,
                            "hours": hours,
                            "minutes": minutes,
                            "seconds": seconds
                        }
                    }
                };

        //Remplis la liste d'interuption
        var inters = document.getElementsByClassName("interupt");
        if(inters.length>0){
            obj["interruptions"] = [];
            for(var i=0; i<inters.length; i++){
                var intname = $(inters[i]).find('#intname').val();
                var intdeb = parseInt($(inters[i]).find('#intdeb').val());

                var intnames = intname.split(" ");

                if(intnames.length < 2){
                    obj["interruptions"].push({"name": intname, "debounceMs": intdeb});
                }
                else{
                    var tempobj = [];
                    for(var j=0; j<intnames.length; j++){
                        tempobj.push(intnames[j]);
                    }
                    obj["interruptions"].push({"names": tempobj, "debounceMs": intdeb});
                }
            }
        }

        //Remplis les sensors
        var sens = document.getElementsByClassName("sens");
        if(sens.length>0){
            obj["sensors"] = [];
            for(var i=0; i<sens.length; i++){
                var sensname = $(sens[i]).find('#sensname').val();
                var senstype = $(sens[i]).find('#senstype').val();
                var sensperiod = parseInt($(sens[i]).find('#sensperiod').val());
                var sensint = $(sens[i]).find('#sensint').val();
                var senssend = $(sens[i]).find('#senssend').is(":checked");
                var sensalarm = $(sens[i]).find('#sensalarm').is(":checked"); 
                
                var tempobj = {"name": sensname,
                                "type": senstype,
                                "periodSec": sensperiod,
                                "sendOnInterrupt": senssend
                                };
                
                if(sensalarm){
                    var alarmset = $(sens[i]).find('#alarmset').is(":checked");
                    var alarmcleared = $(sens[i]).find('#alarmcleared').is(":checked");
                    var thresholdset = parseInt($(sens[i]).find('#thresholdset').val());
                    var thresholdclear = parseInt($(sens[i]).find('#thresholdclear').val());

                    tempobj["alarm"] = {"sendOnAlarmSet": alarmset,
                                        "sendOnAlarmCleared": alarmcleared,
                                        "thresholdSetMMPerMinute": thresholdset,
                                        "thresholdClearMMPerMinute": thresholdclear
                                        };
                }

                if(sensint.length > 0){
                    var sensints = sensint.split(" ");

                    if(sensints.length < 2){
                        tempobj["interruptChannel"] = sensint;
                    }
                    else{
                        var tempints = [];
                        for(var j=0; j<sensints.length; j++){
                            tempints.push(sensints[j]);
                        }
                        tempobj["interruptChannel"] = tempints;
                    }
                }

                obj["sensors"].push(tempobj);
            }
        }

        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

        $("#generatedLink").remove();
        $('<a id="generatedLink" href="data:' + data + '" download="config.json">Télécharger JSON</a>').appendTo('#container');
        return false;
    }
}