// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
var moyai_rng_w = 123456789;
var moyai_rng_z = 987654321;
var moyai_rng_mask = 0xffffffff;
function moyai_rng_random()
{
    moyai_rng_z = (36969 * (moyai_rng_z & 65535) + (moyai_rng_z >> 16)) & moyai_rng_mask;
    moyai_rng_w = (18000 * (moyai_rng_w & 65535) + (moyai_rng_w >> 16)) & moyai_rng_mask;
    var result = ((moyai_rng_z << 16) + moyai_rng_w) & moyai_rng_mask;
    result /= 4294967296;
    return result + 0.5;
}

irange = function(a,b) {
    return Math.floor(range(a,b));
}
range = function(a,b) {
    var small=a,big=b;
    if(big<small) {
        var tmp = big;
        big=small;
        small=tmp;
    }
    var out=(small + (big-small)*moyai_rng_random());
    if(out==b)return a; // in very rare case, out==b
    return out;
}

// defaults
var current_conf={
    osc_type:"sine",
    start_freq:440,
    attack_time:0.4,
    sustain_rate:0.5,
    decay_time:2,
    playback_volume:1,
    release_time:1,
    vib_type:"sine"
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

        this.amp_env = new Tone.AmplitudeEnvelope({
            attack: this.conf.attack_time,
            decay: this.conf.decay_time,
            sustain: this.conf.sustain_level,
            release: this.conf.release_time
        });

        this.hpf = new Tone.Filter({
            frequency: this.conf.hpf_co,
            type: "highpass",
            rolloff: -12,
            Q:1                
        });

        this.lpf = new Tone.Filter({
            frequency: this.conf.lpf_co,
            type: "lowpass",
            rolloff: -12,
            Q:1                                
        });

        this.vibrato = new Tone.Vibrato({
            maxDelay  : 0.005 ,
            frequency  : this.conf.vib_freq,
            depth  : this.conf.vib_depth ,
            type  : this.conf.vib_type
        });

        this.freqscale_env = new Tone.FrequencyEnvelope({                              
            "attack": this.conf.freq_attack_time,                                                    
            "decay": this.conf.freq_decay_time,                                                      
            "sustain": this.conf.freq_sustain_level,                                                       
            "release": this.conf.freq_release_time,                                                       
            "baseFrequency": this.conf.start_freq,
            "octaves": this.conf.freq_octave
        });
        
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
            break;
        case "noise":
            this.noise = new Tone.Noise({
                type: "pink"
            });
            break;
        }
    }
    play() {
        var len="8n";
        if(this.conf.osc_type=="noise") {
            this.noise.connect(this.amp_env);
            this.amp_env.toMaster();
            this.noise.start();
            this.amp_env.triggerAttackRelease(this.conf.release_time);
            
//            this.synth.triggerAttackRelease(len); 
        } else {
//            this.osc.start();
            //            this.amp_env.toMaster();

            this.freqscale_env.connect(this.osc.frequency);                                                         
            this.amp_env.connect(this.vibrato);
//            this.vibrato.toMaster();
            this.vibrato.connect(this.hpf);
            //            this.hpf.toMaster();
            this.hpf.connect(this.lpf);
            this.lpf.toMaster();

            this.osc.connect(this.amp_env).start();
            this.freqscale_env.triggerAttackRelease(this.conf.release_time);
            this.amp_env.triggerAttackRelease(this.conf.release_time);

            if(this.conf.change_speed>0) {
                console.log("CHANING*");
                var this_synth=this;
                setTimeout(function() {
                    var mul = Math.pow( 2, this_synth.conf.change_amount );
                    this_synth.freqscale_env.baseFrequency *= mul;
                    this_synth.freqscale_env.triggerAttackRelease(this_synth.conf.release_time);
                    //                this_synth.amp_env.triggerAttackRelease(this_synth.conf.release_time);
                    
                },this_synth.conf.change_speed*1000);
            }

            
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
    Tone.context.close();
    Tone.context = new AudioContext();
    
    synth = new WFXRSynth(current_conf);
    synth.play();
    
//    noiseSynth.triggerAttackRelease("8n");
//                param : "type",                                                                                 
    //                options : ["white", "brown", "pink"]

    

//    noise.start(0);
    

}

names=["attack_time","sustain_time","sustain_level","decay_time", "release_time",
       "start_freq",
       "freq_attack_time","freq_decay_time", "freq_release_time", "freq_sustain_level","freq_octave",
       "vib_depth","vib_freq",
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
    freq_attack_time: [0,5],
    freq_decay_time: [0,5],
    freq_release_time: [0,5],
    freq_sustain_level: [0,1],
    freq_octave: [-15,15],
    delta_slide: [0,1],
    vib_depth: [0,5],
    vib_freq: [0,100],
    change_amount: [-5,5],
    change_speed: [0,2],
    sq_duty: [0,1],
    sq_sweep: [0,1],
    repeat_speed: [0,1],
    ph_ofs: [0,1],
    ph_sweep: [0,1],
    lpf_co: [0,10000],
    lpf_co_sweep: [0,1],
    lpf_reso: [0,1],
    hpf_co: [0,10000],
    hpf_co_sweep: [0,1],
    hpf_reso: [0,1],
    playback_vol: [0,1]        
};

function setSlider(name,value) {
    var elem=document.getElementById(name);
    elem.value=value;
}
function updateValues() {
    for(var i in names) {
        var elem=document.getElementById(names[i]);
        if(!elem) console.log("Element not defined:",names[i]);
        var val=elem.value;
        var min = minmax[names[i]][0], max = minmax[names[i]][1];
        var final_val = min + (val/1000.0) * ( max - min );
        current_conf[names[i]]=final_val;
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
    onPlayButton();    
}
function onVibButton(type) {
    console.log("onVibButton:",type);
    current_conf.vib_type=type;
    onPlayButton();    
}

function onTemplateButton(type) {
    for(var i in names) {
        var elem=document.getElementById(names[i]);
        elem.value=500;
    }
    switch(type) {
    case 'pickup':
        current_conf.osc_type="square";
        setSlider("attack_time",0);
        setSlider("decay_time",range(100,300));        
        setSlider("sustain_time",0);
        setSlider("sustain_level",range(1,20));
        setSlider("release_time",range(1,100));
        setSlider("start_freq", range(30,700) );
        setSlider("vib_depth", 0);
        setSlider("vib_freq", 0);
        setSlider("change_amount",range(520,600));
        setSlider("change_speed",range(50,120));

        setSlider("hpf_co",0);
        setSlider("lpf_co",1000);

        setSlider("freq_octave",500);
        
        break;
    case 'shoot':
        current_conf.osc_type=["sine","sawtooth","square"][Math.floor(range(0,3))];

        setSlider("attack_time",0);
        setSlider("decay_time",range(100,300));        
        setSlider("sustain_time",0);
        setSlider("sustain_level",range(1,20));
        setSlider("release_time",range(1,100));
        
        setSlider("start_freq",range(50,700));
        setSlider("vib_depth", 0);
        setSlider("vib_freq", 0);

        setSlider("freq_octave",range(50,200));
        setSlider("freq_attack_time",range(5,100));
        setSlider("freq_release_time",1000);

        setSlider("hpf_co",0);
        setSlider("lpf_co",1000);

        setSlider("change_speed",0);
        setSlider("change_amount",500);        
        
        break;
    case 'explosion':
        current_conf.osc_type="noise";

        setSlider("attack_time",0);
        setSlider("decay_time",range(100,300));        
        setSlider("sustain_time",0);
        setSlider("sustain_level",range(1,20));
        setSlider("release_time",range(1,100));
        
        break;
    case 'powerup':
    case 'hurt':
    case 'jump':
    case 'blip':
    case 'random':
    default:
        break;
    }

    updateValues();
    onPlayButton();
}