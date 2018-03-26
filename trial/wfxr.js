//make the noise and connect it to the output                                                           

var noiseSynth = new Tone.NoiseSynth().toMaster();


function onPlayButton() {
    noiseSynth.triggerAttackRelease("8n");
//                param : "type",                                                                                 
    //                options : ["white", "brown", "pink"]

    
    console.log("Play");
//    noise.start(0);

}
function onStopButton() {
    console.log("Stop");    
}
