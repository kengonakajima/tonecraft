// defaults
var current_conf={
    osc_type:"sine",
    start_freq:440,
    attack_time:0.4,
    sustain_rate:0.5,
    decay_time:2,
    playback_volume:1,
    release_time:1
};



class WFXRSynth {
    constructor(opts) {
        this.conf={};
        
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
/*            
            this.osc= new Tone.Oscillator({
                volume: this.conf.volume,
                type: this.conf.osc_type,
                frequency: this.conf.start_freq
            });
*/
            this.synth = new Tone.Synth({
                oscillator: {
                    detune:0,
                    type: this.conf.osc_type,
                    phase:0,
                    volume:1
                },
                envelope: {
                    attack: this.conf.attack_time,
                    decay: this.conf.decay_time,
                    sustain: this.conf.sustain_level,
                    release: this.conf.release_time
                }
            });
            this.synth.toMaster();
        }
    }
    play() {
        var len="8n";
        this.synth.triggerAttackRelease(this.conf.start_freq,len);
//        this.synth.triggerAttackRelease("440","1"); // "C4", "8n" とかでもok
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


function updateValues() {
    names=["attack_time","sustain_time","sustain_level","decay_time", "release_time",
           "start_freq","min_freq_co","slide","delta_slide",
           "vib_pitch","vib_speed",
           "change_amount", "change_speed",
           "sq_duty","sq_sweep","repeat_speed","ph_ofs","ph_sweep",
           "lpf_co", "lpf_co_sweep","lpf_reso", "hpf_co", "hpf_co_sweep", "hpf_reso",
           "playback_vol"
          ];
    minmax= {
        attack_time: [0,5],
        sustain_time: [0,5],
        sustain_level: [0,1],
        decay_time: [0,5],
        release_time: [0,5],
        start_freq: [0,5000],
        min_freq_co: [0,1], // TODO: used in laser/shoot only
        slide: [0,1],
        delta_slide: [0,1],
        vib_pitch: [0,1],
        vib_speed: [0,1],
        change_amount: [0,1],
        change_speed: [0,1],
        sq_duty: [0,1],
        sq_sweep: [0,1],
        repeat_speed: [0,1],
        ph_ofs: [0,1],
        ph_sweep: [0,1],
        lpf_co: [0,1],
        lpf_co_sweep: [0,1],
        lpf_reso: [0,1],
        hpf_co: [0,1],
        hpf_co_sweep: [0,1],
        hpf_reso: [0,1],
        playback_vol: [0,1]        
    };
    for(var i in names) {
        var val=document.getElementById(names[i]).value;
        var min = minmax[names[i]][0], max = minmax[names[i]][1];
        var final_val = min + (val/1000.0) * ( max - min );
        console.log(names[i], val, final_val);
        current_conf[names[i]]=final_val;
        document.getElementById(names[i]+"_val").innerHTML = final_val;        
    }
}
function onSlider(tgt) {
    console.log(tgt.id, tgt.value);
    updateValues();
    onPlayButton();
}

