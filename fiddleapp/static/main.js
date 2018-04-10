class Song {
  constructor(title='untitled') {
    this.title = title;
    this.sequence_list = [];
    this.arrangement = [];
    this.bpm = 120;
  }
}
class Sequence {
  constructor(number_of_beats=8, preset=null) {
    this.synth_preset = preset;
    this.load_query = false;
    this.beats = [];
    for (let i = 0; i < number_of_beats; i++) {
    this.beats.push(new Beat())
    }
  }
}

class Beat {
  constructor(note='C', octave=2, duration='8n', velocity='mf', mute=true) {
    this.duration = duration;
    this.octave = octave;
    this.velocity = velocity;
    this.note = note;
    this.mute = true;
  }
  toggleMute() {
    this.mute = !this.mute;
  }
}

const fh_constants = {
  beat: {
    durations: ['1m', '2n', '4n', '8n', '16n'],
    dynamics: ['pp','p', 'mp', 'mf', 'f', 'ff'],
    octaves: [0,1,2,3,4,5,6,7,8],
    notes: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
  },
  sequence: {max_beats: 16},
  arrangement: {max_measures: 16},
  bpm: {min:60, max:999},
  oscillator: {
    types: ['sine', 'triangle', 'square', 'square8', 'sawtooth', 'pwm', 'fatsquare', 'fatsawtooth'],
    spread: {min: 0, max: 100},
    count: {min: 1, max: 8}
  },
  distortion: {
    distortion: {min: 0, max: 1},
  },
  envelope: {
    attack: {min: 0.1, max: 1},
    decay: {min: 0.01, max: 1},
    sustain: {min: 0, max: 1},
    release: {min: 0.02, max: 10}
  },
  filter: {
    types: ['lowpass', 'highpass', 'bandpass'],
    rolloffs: [-12, -24],
    Q: {min:0, max:6},
  },
  filter_envelope: {
    exponent: {min: 0, max: 10},
    baseFrequency: {min:80, max: 20000}
  },
  reverb: {
    roomSize: {min: 0.1, max: 1},
    dampening: {min: 1000, max: 10000},
    wet: {min: 0, max: 1}
  },
  lfo: {
    destination: ['OscillatorFrq', 'FilterFrq', 'OscillatorAmp']
  },
  delay: {
    time: {min: 0.01, max: 10},
    feedback: {min: 0.5, max: 50},
    wet: {min: 0, max: 1}
  },
  reverb: {
    size: {min: 0.01, max: 10},
    wet: {min:0, max:1}

  }
}

function linearRange(min, max, divisions) {
  //divisions is number of segments
  let range_segments = [];
  let segment_size = (max - min)/divisions
  for(let i = 0; i< divisions; i++) {
    let segment_val = i * segment_size;
    range_segments.push(segment_val);
  };
  return range_segments
}

class Instrument {
  constructor() {
    // this.init = new Tone.MonoSynth()
    this.preset_name = 'Default'
    this.oscillator = new Tone.OmniOscillator({
      type: "sine",
      volume: 3,
    });
    this.amplifier = new Tone.AmplitudeEnvelope({
      attack: 0.02,
      decay: 0.1,
      sustain: 0.5,
      release: 0.1
    });
    this.distortion = new Tone.Distortion({
      distortion: 0.01,
    });
    this.filter = new Tone.Filter({
      type: 'lowpass',
      rolloff: -24,
      Q: 5
    });
    this.lfo = new Tone.LFO({
      type: 'sine',
      min: -6,
      max: 6,
      amplitude: 0,
    });
    this.lfo_dest = this.oscillator.frequency;
    this.filter_envelope = new Tone.FrequencyEnvelope({
      attack: 0.02,
      decay: 0.01,
      sustain: 1,
      release: 0.5,
      baseFrequency: 80,
      octaves: 4,
      attackCurve: 'exponential',
      releaseCurve: 'exponential',
      exponent: 1
    });
    this.delay = new Tone.PingPongDelay({
      delayTime: 0.02,
      feedback: 0.1,
      wet: 0.1,
    });
    this.reverb = new Tone.Freeverb({
      roomSize: 0.1,
      dampening: 2000,
      wet: 0.1
    });
    this.volume = new Tone.Volume({
      volume: 1
    });
    this.patchNodes()
  }
  patchNodes() {
    //attach envelope to
    this.filter_envelope.connect(this.filter.frequency);
    this.oscillator.connect(this.amplifier);
    this.amplifier.connect(this.distortion);
    this.distortion.connect(this.filter);
    this.filter.connect(this.delay);
    this.delay.connect(this.reverb);
    this.reverb.connect(this.volume);
    this.volume.toMaster();

  }
  LFODestination(dest) {
    this.lfo.disconnect(this.lfo_dest)
    if (dest === 'OscillatorFrq') {
      this.lfo.connect(this.oscillator.frequency);
      this.lfo_dest = this.oscillator.frequency;
    }
    else if (dest === 'FilterFrq') {
      this.lfo.connect(this.filter.frequency);
      this.lfo_dest = this.filter.frequency;
    }
    else if (dest === 'OscillatorAmp') {
      this.lfo.connect(this.oscillator.volume);
      this.lfo_dest = this.oscillator.volume;
    }
  }
  playNote(note_obj) {
    let n = note_obj;
    let time = Tone.time;
    let dynamics = ['pp', 'p', 'mp', 'mf', 'f', 'ff'];
    let instrument = this;
    let note = n.note + (n.octave+2);
    console.log(note);
    // n.velocity = dynamics.includes(n.velocity)? dynamics.indexOf(n.velocity) : n.velocity;
    // // instrument.oscillator.start(time);
    this.oscillator.start()
    // .stop(`+${n.duration}`);
    // this.amplifier.triggerAttackRelease(note, n.duration);
    // let osc = new Tone.OmniOscillator();
    // let amp = new Tone.AmplitudeEnvelope();
    // osc.connect(amp)
    // amp.toMaster();
    // osc.start().stop('+2n');
    // amp.triggerAttackRelease('C4','2n');
    this.filter_envelope.triggerAttackRelease(n.duration);
    this.amplifier.triggerAttackRelease(note, n.duration);
    // instrument.oscillator.stop(time + instrument.amplifier.release)
  }
  serialize() {
    //return an object preset for saving to the server
    return {
      preset_name : this.preset_name,
      oscillator: {
        type: this.oscillator.type,
      },
      amplifier: {
        attack: this.amplifier.attack,
        decay: this.amplifier.decay,
        sustain: this.amplifier.sustain,
        release: this.amplifier.release
      },
      distortion: this.distortion.distortion,
      filter: {
        type: this.filter.type,
        rolloff: this.filter.rolloff,
        Q: this.filter.Q
      },
      filter_envelope: {
        attack: this.filter_envelope.attack,
        decay: this.filter_envelope.decay,
        sustain: this.filter_envelope.sustain,
        release: this.filter_envelope.release,
        baseFrequency: this.filter_envelope.baseFrequency,
        octaves: this.filter_envelope.octaves,
        attackCurve: this.filter_envelope.attackCurve,
        releaseCurve: this.filter_envelope.releaseCurve,
        exponent: this.filter_envelope.exponent
      },
      delay: {
        delayTime: this.delay.delayTime,
        feedback: this.delay.feedback,
        wet: this.delay.wet,
      },
      reverb: {
        roomSize: this.reverb.roomSize,
        dampening: this.reverb.dampening,
        wet: this.reverb.wet,
      }
    }
  }
  deserialize(object) {
    this.preset_name = object.preset_name;
    this.oscillator.type = object.oscillator.type;
    this.amplifier.attack = object.amplifier.attack;
    this.amplifier.decay = object.amplifier.decay;
    this.amplifier.sustain = object.amplifier.sustain;
    this.amplifier.release = object.amplifier.release;
    this.distortion.distortion = object.distortion;
    this.filter.type = object.filter.type;
    this.filter.rolloff = object.filter.rolloff;
    this.filter.Q = object.filter.Q;
    this.filter_envelope.attack = object.filter_envelope.attack;
    this.filter_envelope.attack = object.filter_envelope.attack;
    this.filter_envelope.decay = object.filter_envelope.decay;
    this.filter_envelope.sustain = object.filter_envelope.sustain;
    this.filter_envelope.release = object.filter_envelope.release;
    this.filter_envelope.baseFrequency = object.filter_envelope.baseFrequency;
    this.filter_envelope.octaves = object.filter_envelope.octaves
    this.filter_envelope.attackCurve = object.filter_envelope.attackCurve;
    this.filter_envelope.releaseCurve = this.filter_envelope.releaseCurve;
    this.filter_envelope.exponent = object.this.filter_envelope.exponent;
    this.delay.delayTime = object.delay.delayTime;
    this.delay.feedback = object.delay.feedback;
    this.delay.wet = object.delay.wet;
    this.reverb.roomSize = object.reverb.roomSize;
    this.reverb.dampening = object.reverb.dampening;
    this.reverb.wet = object.reverb.wet;
  }

}

class SongManager {
  constructor() {
    this.message = '';
    this.sequences = []; //sequence and beat data
    this.arrangement = []; //the order in which patterns will play
    this.title = 'untitled'
    this.presets = [];
    this.beat = 0; //current beat index
    this.measure = 0; //current measure index
    this.playing = false;
    this.loop = true;
    this.bpm = 120;
    this.synth = new Instrument();
    this.time = 0;
    this.addSequence()
  }
  addSequence() {
    //initializes a default sequence, adds to end of list
    let seq = new Sequence();
    this.sequences.push(seq);
    let ref = this.sequences.length - 1
    this.arrangement.push(ref)
  }
  removeLastSequence() {
    this.sequences.pop();
    this.arrangement.pop();
  }
  addBeat(sequence_index) {
    this.sequences[sequence_index].beats.push(new Beat())
  }
  removeLastBeat(sequence_index) {
    this.sequences[sequence_index].pop();
  }
  updateBeat(seq_index, beat_index, parameter, value) {
    this.sequences[seq_index][beat_index][parameter] = value;
  }
  getBeatValues(seq_index, beat_index){
    return this.sequences[sequence_index][beat_index];
  }
  loadPresetList() {
    axios({
      method: 'GET',
      url: '/fiddleapp/presets/',
    }).then(result => {
      console.log(result);
    }).catch(error => {
      console.log(error);
    });
  }
  savePresetToCurrSeq(){
    let preset = this.synth.serialize();
    this.getCurrentSequenceData().synth_preset = preset;
  }
  toggleLoadPreset(seq_index){
    let load = this.sequences[seq_index].load_query;
    load = !load
  }
  checkLoadPreset(seq_index){
    return this.sequences[seq_index].load_query;
  }
  getCurrentSequenceIndex() {
    return this.arrangement[this.measure];
  }
  getCurrentMeasureLength() {
    return this.getCurrentSequenceData().beats.length
  }
  getCurrentSequenceData() {
    return this.sequences[this.getCurrentSequenceIndex()];
  }
  get currentBeatData() {
    return (this.getCurrentSequenceData())[this.beat];
  }
  get totalMeasures() {
    return this.sequences.length;
  }
  getCurrentPreset() {
    return (this.getCurrentSequenceData()).synth_preset;
  }
  set currentMeasureLength(beats) {
    let meas = this.sequences[this.getCurrentSequenceIndex()]
    while (beats > this.getCurrentMeasureLength()) {
      // remove extra beats
      meas.pop()
    }
    while (beats < this.getCurrentMeasureLength()) {
      this.addBeat(meas);
    }
  }
  setArrangementLength(num_measures) {
    if (this.sequences.length > num_measures) {
      while (this.sequences.length > num_measures) {
        console.log('removing measure')
        // remove extra beats
        this.removeLastSequence();
      }
    }
    else if (this.sequences.length < num_measures) {
      while (this.sequences.length < num_measures) {
        console.log('adding measure')
        this.addSequence();
      }
    }
  }
  updateSongClock() {
    let fh = this;
    if (fh.playing) {
      let timer = setTimeout(function() {
        fh.updateSongClock(); //callback


        let seq_i = fh.arrangement[fh.measure];
        let seq = fh.sequences[ seq_i ];
        //load preset
        if (fh.beat === 0){
          if (fh.checkLoadPreset(fh.measure)){
            fh.synth.deserialize(seq.preset)
          }
        }
        //play note
        fh.playNote(seq.beats[fh.beat])
        //set clock to next increment
        fh.beat += 1;

        if (fh.beat > seq.beats.length - 1) {
          fh.beat = 0; //reset at bar end
          fh.measure += 1 //increment measure
        }

        if (fh.measure > fh.totalMeasures - 1) {
          if (fh.loop) {
            fh.measure = 0;
          }
          else {
            fh.playing = false;
            return
          }
        }
      }, 60000/this.bpm);
    }
  }
  updateTimeClock() {
    if (this.playing) {
      let timer = setTimeout( function () {
        this.updateTimeClock(); //callback
        //set clock to next increment
        this.seconds += 1;
      }, 1000);
    }
  }
  playPause() {
    this.playing = !this.playing;
    if (this.playing) {
      this.updateSongClock();
      // updateTimeClock();
    }
  }
  playNote(note_obj) {
    if (!note_obj.mute) {
      this.synth.playNote(note_obj)
    }
  }
  pause() {
    this.playing = false;
  }
  resetClock() {
    this.beat = 0;
    this.measure = 0;
  }
  seekNext() {
    this.measure += 1;
  }
  seekPrevious() {
    this.measure -= 1;
  }
  saveSong() {
    return {
      title: this.title,
      sequences: this.sequences,
      bpm: this.bpm,
      arrangement: this.arrangement
    }
  }
  loadSong(object) {
    this.title = object.title;
    this.sequences = object.sequences;
    this.bpm = object.bpm
    this.arrangement = object.arrangement
  }
  getSongList() {
    axios({
      method: 'GET',
      url: '/fiddleapp/songs/',
    }).then(result => {
      console.log(result);
    }).catch(error => {
      console.log(error);
    });
  }
  getPresets() {
    axios({
      method: 'GET',
      url: '/fiddleapp/songs/',
    }).then(result => {
      console.log(result);
    }).catch(error => {
      console.log(error);
    });
  }
  serializeSong() {
    return {
      title: this.title,
    }
  }
  loadCurrentPreset() {
  }
  //methods:
  //save song
  //load data from server
  //return list from server
  //push data to server
  //save song
  //load song
}


const fiddlehead = new SongManager();
fiddlehead.addBeat(fiddlehead.getCurrentSequenceIndex());
console.log(fiddlehead.getCurrentSequenceData());

console.log(fiddlehead.getCurrentMeasureLength());
// axios({
//   method: 'GET',
//   url: '/fiddleapp/api/',
// }).then(result => {
//   console.log(result);
// }).catch(error => {
//   console.log(error);
// });
