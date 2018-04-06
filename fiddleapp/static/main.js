
//init Tone.js nodes
const synth = new Tone.MonoSynth({
});
// let distortion = new Tone.Distortion();
// let chorus = new Tone.Chorus();
// let lfo = Tone.lfo();
// let noise_synth = new Tone.NoiseSynth()
const volume = new Tone.Volume();
const reverb = new Tone.Freeverb();
const p_p_delay = new Tone.PingPongDelay();
const filter = new Tone.Filter();

//patch nodes to master output
synth.connect(p_p_delay).connect(reverb).connect(volume).toMaster();
const oscTypes= ['sine', 'triangle', 'square', 'sawtooth', 'pwm'];

axios({
  method: 'GET',
  url: '/fiddleapp/api/',
}).then(result => {
  console.log(result);
}).catch(error => {
  console.log(error);
});
