
if (window.File && window.FileReader && window.FileList && window.Blob) {

}
else {
    alert("Vous ne disposez pas de l'API pour les fichier, vous ne pourrez pas importer de fichiers.");
}

var b = document.getElementById("upload");

b.onchange = function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    $("#interuptions #int").remove();
    $("#sensors #sensor").remove();
    
    reader.onload = (function(evt) {
        return function(e) {
            var obj = JSON.parse(e.target.result);
            
            document.getElementById('nom').value = obj["name"];
            $("#verbose").prop('checked', obj["verbose"]);
            $("#led").prop('checked', obj["led"]);
            $("#watchdog").prop('checked', obj["watchdog"]);
            $("#debug").prop('checked', obj["debugSerial"]);

            document.getElementById('typenet').value = obj["network"]["type"];
            document.getElementById('deveui').value = obj["network"]["devEUI"];
            document.getElementById('appeui').value = obj["network"]["appEUI"];
            document.getElementById('appkey').value = obj["network"]["appKey"];
            document.getElementById('periodsec').value = obj["network"]["periodSec"];

            if(obj["network"]["dataRate"] != undefined && obj["network"]["dataRate"] != ''){
                document.getElementById('datarate').value = obj["network"]["dataRate"];
            }

            $("#adaptData").prop('checked', obj["network"]["useAdaptativeDataRate"]);

            $("#syncGPS").prop('checked', obj["time"]["syncGPS"]);
            if(obj["time"]["syncGPS"]){
                document.getElementById('timeout').value = obj["time"]["syncGPSTimeoutSec"];
                document.getElementById('syncperiodsec').value = obj["time"]["syncPeriodSec"];
            }
            else{
                Alert("L'heure indiquer peut posser problème", $("#manual"));
                var year = obj["time"]["manualUTC"]["year"];
                if(year<100) year = 100;
                document.getElementById('datePicker').valueAsDate = new Date(year,obj["time"]["manualUTC"]["month"]-1,obj["time"]["manualUTC"]["day"]+1);

                var hours = obj["time"]["manualUTC"]["hours"].toString();
                var minutes = obj["time"]["manualUTC"]["minutes"].toString();
                var secs = obj["time"]["manualUTC"]["seconds"].toString();

                if(hours.length == 1) hours = '0' + hours;
                if(minutes.length == 1) minutes = '0' + minutes;
                if(secs.length == 1) secs = '0' + secs;

                document.getElementById('settime').value = hours + ':' + minutes + ':' + secs;
            }
            

            //add interrupts
            if(obj.hasOwnProperty("interruptions")){
                var nbint = Object.keys(obj["interruptions"]).length;
                var iparams = [];

                for(var i=0; i < nbint; i++){
                    iparams.push(obj["interruptions"][i]);
                    
                    $('<div w3-include-html="interruption.html" id="int" class="interupt"></div>').appendTo("#interuptions");
                    includeHTML();
                }
                setTimeout(function(){ 
                    for(var i=0; i < nbint; i++){
                        $("#int #intdeb").eq(i).val(iparams[i]["debounceMs"]);

                        if(iparams[i].hasOwnProperty('names')){
                            alert("names");
                            for(var j=0; j<iparams[i]["names"].length; j++){
                                $("#int #intname option[value='" + translateAcr(iparams[i]['names'][j]) + "']").eq(i).prop("selected", true);
                            }
                            dropUp($("#int #intname").eq(i));
                        }
                        else{
                            $("#int #intname option[value='" + translateAcr(iparams[i]["name"]) + "']").eq(i).prop("selected", true);
                            dropUp($("#int #intname").eq(i));
                        }
                    }

                    initInputs();
                }, 500);
            }

            //add sensors
            if(obj.hasOwnProperty("sensors")){
                var nbsens = Object.keys(obj["sensors"]).length;
                var params = [];

                for(var i=0; i < nbsens; i++){
                    params.push(obj["sensors"][i]);

                    $('<div w3-include-html="sensor.html" id="sensor" class="sens"></div>').appendTo("#sensors");
                    includeHTML();
                }
                setTimeout(function(){ 
                    for(var i=0; i < nbsens; i++){
                        $("#sensor #sensname").eq(i).val(params[i]["name"]);
                        var type = params[i]["type"];
                        $("#sensor #senstype").eq(i).val(translateAcr(type));
                        updateParams($("#sensor #senstype").eq(i));

                        $("#sensor #sensperiod").eq(i).val(params[i]["periodSec"]);

                        if(params[i].hasOwnProperty('interruptChannels')){
                            for(var j=0; j<params[i]["interruptChannels"].length; j++){
                                $("#sensor #sensint option[value='" + translateAcr(params[i]['interruptChannels'][j]) + "']").eq(i).prop("selected", true);
                            }
                            dropUp($("#sensor #sensint").eq(i));
                        }
                        else{
                            $("#sensor #sensint option[value='" + translateAcr(params[i]["interruptChannel"]) + "']").eq(i).prop("selected", true);
                            dropUp($("#sensor #sensint").eq(i));
                        }


                        $("#sensor #senssend").eq(i).val(params[i]["sendOnInterrupt"]);

                        if(type == "RainGaugeContact"){
                            $("#sensor #tickInterrupt").eq(i).val(translateAcr(params[i]["tickInterrupt"]));
                            $("#sensor #tickDebounceMs").eq(i).val(params[i]["tickDebounceMs"]);
                            $("#sensor #rainMMPerTick").eq(i).val(params[i]["rainMMPerTick"]);
                        }

                        if(params[i].hasOwnProperty('alarm')){
                            $("#sensor #sensalarm").eq(i).prop('checked', true);

                            $("#sensor #alarm #alarmset").eq(i).prop('checked', params[i]["alarm"]["sendOnAlarmSet"]);
                            $("#sensor #alarm #alarmcleared").eq(i).prop('checked', params[i]["alarm"]["sendOnAlarmCleared"]);

                            if(type == "SHT35"){
                                $("#sensor #alarm #humidityHighSetPercent").eq(i).val(params[i]["alarm"]["humidityHighSetPercent"]);
                                $("#sensor #alarm #humidityHighClearPercent").eq(i).val(params[i]["alarm"]["humidityHighClearPercent"]);
                                $("#sensor #alarm #humidityLowSetPercent").eq(i).val(params[i]["alarm"]["humidityLowSetPercent"]);
                                $("#sensor #alarm #humidityLowClearPercent").eq(i).val(params[i]["alarm"]["humidityLowClearPercent"]);

                                $("#sensor #alarm #temperatureHighSetDegC").eq(i).val(params[i]["alarm"]["temperatureHighSetDegC"]);
                                $("#sensor #alarm #temperatureHighClearDegC").eq(i).val(params[i]["alarm"]["temperatureHighClearDegC"]);
                                $("#sensor #alarm #temperatureLowSetDegC").eq(i).val(params[i]["alarm"]["temperatureLowSetDegC"]);
                                $("#sensor #alarm #temperatureLowClearDegC").eq(i).val(params[i]["alarm"]["temperatureLowClearDegC"]);
                            }
                            else if(type == "LPS25"){
                                $("#sensor #alarm #highThresholdHPa").eq(i).val(params[i]["alarm"]["highThresholdHPa"]);
                                $("#sensor #alarm #lowThresholdHPa").eq(i).val(params[i]["alarm"]["lowThresholdHPa"]);
                            }
                            else if(type == "OPT3001"){
                                $("#sensor #alarm #highLimitLux").eq(i).val(params[i]["alarm"]["highLimitLux"]);
                                $("#sensor #alarm #lowLimitLux").eq(i).val(params[i]["alarm"]["lowLimitLux"]);
                            }
                            else if(type == "LIS3DH"){
                                $("#sensor #alarm #motionDetection").eq(i).val(params[i]["alarm"]["motionDetection"]);
                            }
                            else if(type == "RainGaugeContact"){
                                $("#sensor #alarm #thresholdSetMMPerMinute").eq(i).val(params[i]["alarm"]["thresholdSetMMPerMinute"]);
                                $("#sensor #alarm #thresholdClearMMPerMinute").eq(i).val(params[i]["alarm"]["thresholdClearMMPerMinute"]);
                            }
                        }
                    }
                    
                    initInputs();
                }, 500);
            }
        };
    })(file);

    reader.readAsText(file);
}