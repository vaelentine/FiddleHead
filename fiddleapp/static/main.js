
//init Tone.js nodes
const synth = new Tone.MonoSynth({

});
console.log(synth)
// let noise_synth = new Tone.NoiseSynth()
let reverb = new Tone.Freeverb();
let p_p_delay = new Tone.PingPongDelay();
const filter = new Tone.Filter();
// let distortion = new Tone.Distortion();
let chorus = new Tone.Chorus();
// let lfo = Tone.lfo();

//patch nodes to master output
synth.connect(chorus).connect(p_p_delay).connect(reverb).toMaster();

const oscTypes= ['sine', 'triangle', 'square', 'sawtooth', 'pwm'];
const synthSettings={
  amp: {
    atk: synth.envelope.attack,
    sus: synth.envelope.sustain
  }
}
//   synth.envelope.attack: 5,
//   synth.envelope.decay:5,
//   synth.envelope.sustain:1,
//   synth.envelope.release:3
//   synth.
//     min: 0,
//     max: oscTypes.length,
//     step: 1,
//     value: 0,
//     oscTypes: ['sine', 'triangle', 'square', 'sawtooth', 'pwm'],
//     display: oscTypes[this.value]
//   }
//
// }
