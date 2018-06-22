
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
            document.getElementById('datarate').value = obj["network"]["dataRate"];
            $("adaptData").prop('checked', obj["network"]["useAdaptativeDataRate"]);

            $("syncGPS").prop('checked', obj["time"]["syncGPS"]);
            document.getElementById('timeout').value = obj["time"]["syncGPSTimeoutSec"];
            document.getElementById('syncperiodsec').value = obj["time"]["syncPeriodSec"];

            //add sensors and interrupts
            var nbint = Object.keys(obj["interruptions"]).length;
            for(var i=0; i < nbint; i++){
                var name = obj["interruptions"][i]["name"];

                $('<div w3-include-html="interruption.html" id="int" class="interupt"></div>').appendTo("#interuptions");
                includeHTML();
                //Create an array to populate after
                setTimeout(function(){ 
                    $("#int #intname").last().val(name);
                }, 300);
            }
        };
    })(file);

    reader.readAsText(file);
}