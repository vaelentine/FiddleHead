
//init Tone.js nodes
const synth = new Tone.MonoSynth({

});
console.log(synth)
// let distortion = new Tone.Distortion();
// let chorus = new Tone.Chorus();
// let lfo = Tone.lfo();
// let noise_synth = new Tone.NoiseSynth()
const volume = new Tone.Volume();
const reverb = new Tone.Freeverb();
const p_p_delay = new Tone.PingPongDelay();
const filter = new Tone.Filter();

//patch nodes to master output
synth.connect(chorus).connect(p_p_delay).connect(reverb).connect(volume)toMaster();
ß
const oscTypes= ['sine', 'triangle', 'square', 'sawtooth', 'pwm'];
