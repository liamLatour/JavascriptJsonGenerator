
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

            //add interrupts
            var nbint = Object.keys(obj["interruptions"]).length;
            var names = [];
            var debs = [];

            for(var i=0; i < nbint; i++){
                if(obj["interruptions"][i].hasOwnProperty('names')){
                    names.push(obj["interruptions"][i]["names"]);
                    alert(obj["interruptions"][i]["names"]);
                }
                else{
                    names.push(obj["interruptions"][i]["name"]);
                }

                debs.push(obj["interruptions"][i]["debounceMS"]);

                $('<div w3-include-html="interruption.html" id="int" class="interupt"></div>').appendTo("#interuptions");
                includeHTML();
            }
            setTimeout(function(){ 
                for(var i=0; i < nbint; i++){
                    $("#int #intname").eq(i).val(names[i]);
                    $("#int #intdeb").eq(i).val(debs[i]);

                    var text = $("#int #intname").eq(i).val();
                    $("#int #intname").eq(i).val(text.replace(/,/g, " "));
                }
            }, 500);

            //add sensors


            

        };
    })(file);

    reader.readAsText(file);
}