
var current_conf={
    osc_type:"sine",
    start_freq:440,
    attack_time:0.4,
    sustain_time:0.5,
    sustain_punch:1,
    decay_time:2
};



class WFXRSynth {
    constructor(opts) {
        this.conf={};
        // default values
        this.conf.osc_type="sine";
        this.conf.start_freq = 440;
        this.conf.attack_time=0;
        this.conf.sustain_time=0.5;
        this.conf.sustain_punch=1;
        this.conf.decay_time=1;
        this.conf.volume=1;
        
        // options
        for(var i in opts) {
            this.conf[i]=opts[i];
        }

        // TODO: validation
        
        //var noiseSynth = new Tone.NoiseSynth().toMaster();

        switch(this.conf.osc_type) {
        case "sine":
        case "sawtooth":
        case "square":
            this.osc= new Tone.Oscillator({
                volume: this.conf.volume,
                type: this.conf.osc_type,
                frequency: this.conf.start_freq
            });
        }
        this.osc.toMaster();

        this.env = new Tone.AmplitudeEnvelope({
            attack: this.conf.attack_time,
            decay: this.conf.decay_time,
            sustain: this.conf.sustain_punch,
            release: this.conf.sustain_time
        });
        this.osc.connect(this.env);
        this.env.toMaster();
    }
    play() {
        this.osc.start();
    }
    stop() {
        this.osc.stop();
    }
};


var synth;

function onPlayButton() {
    console.log("Play");
    
    synth = new WFXRSynth(current_conf);
    synth.play();
    
//    noiseSynth.triggerAttackRelease("8n");
//                param : "type",                                                                                 
    //                options : ["white", "brown", "pink"]

    

//    noise.start(0);

}
function onStopButton() {
    console.log("Stop");
    synth.stop()   ;
}
