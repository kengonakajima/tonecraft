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

        var envconf = {
            attack: this.conf.attack_time,
            decay: this.conf.decay_time,
            sustain: this.conf.sustain_level,
            release: this.conf.release_time
        };

        switch(this.conf.osc_type) {
        case "sine":
        case "sawtooth":
        case "square":

            this.osc = new Tone.OmniOscillator({
                detune:0,
                type: this.conf.osc_type,
                phase:0,
                volume: this.conf.playback_volume,
                frequency: this.conf.start_freq
            });

            this.amp_env = new Tone.AmplitudeEnvelope({
                attack: this.conf.attack_time,
                decay: this.conf.decay_time,
                sustain: this.conf.sustain_level,
                release: this.conf.release_time
            });

            /*

            this.freqscale_env = new Tone.ScaledEnvelope({
                min:0.5,
                max:1,
                exponent:1,
 	            attack: 0,
                decay: 0.2,
                sustain: 0.5,
                release: 0.5
            });
            */
            
            this.freqscale_env = new Tone.FrequencyEnvelope({                              
                "attack": 0.5,                                                    
                "decay": 0.1,                                                      
                "sustain": 1,                                                       
                "release": 2,                                                       
                "baseFrequency": "A2",                                              
                "octaves": 8.7                                                      
            }).connect(this.osc.frequency);                                             
            

            break;
        case "noise":
            /*            
            this.synth = new Tone.NoiseSynth({
                noise : { type: "white" },
                envelope: envconf
            });
            this.synth.toMaster();
            */
            break;
        }
    }
    play() {
        var len="8n";
        if(this.conf.osc_type=="noise") {
//            this.synth.triggerAttackRelease(len); 
        } else {
//            this.osc.start();
            this.amp_env.toMaster();
            this.osc.connect(this.amp_env).start();
            this.freqscale_env.triggerAttackRelease("8t");
            this.amp_env.triggerAttackRelease("8t");



            
//            this.amp_env.toMaster();            
//            this.synth.triggerAttackRelease(this.conf.start_freq,len);
            //        this.synth.triggerAttackRelease("440","1"); // "C4", "8n" とかでもok
        }

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
           "start_freq",
           "slide","delta_slide",
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
        //        console.log(names[i], val, final_val);
        current_conf[names[i]]=final_val;
        document.getElementById(names[i]+"_val").innerHTML = final_val;        
    }
}
function onSlider(tgt) {
    console.log(tgt.id, tgt.value);
    updateValues();
    onPlayButton();
}
function onOscButton(type) {
    console.log("onOscButton:",type);
    current_conf.osc_type=type;
}