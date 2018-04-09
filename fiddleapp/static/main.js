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
  arrangement: {max_measures: 16}
  bpm: {min:60, max:999}
  oscillator: {
    types: ['sine', 'triangle', 'square', 'square8', 'sawtooth', 'pwm', 'fatsquare', 'fatsawtooth'],
    spread: {min: 0, max: 100},
    count: {min: 1, max: 8}
  },
  distortion: {
    distortion: {min: 0, max: 1}
  }
  envelope: {
    attack: {min: 0.1, max: 1},
    decay: {min: 0.01, max: 1},
    sustain: {min: 0, max: 1}
    release: {min: 0.02, max: 10}
  },
  filter: {
    types: ['lowpass', 'highpass', 'bandpass'],
    rolloffs: [-12, -24],
    Q: {min:0, max:6},
  },
  filter_envelope: {
    exponent: {min: 0, max: 10}
    baseFrequency: {min:80, max: 20000}
  },
  reverb: {
    roomSize: {min: 0.1, max: 1},
    dampening: {min: 1000, max: 10000}
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
    size: {min: 0.01, max: 10}
    wet: {min:0, max:1}

  }
}

function linearRange(min, max, divisions) {
  //base is number of segments
  let range_segments = [];
  let segment_size = (max - min)/base
  for(let i = 0, i < base -1; i++) {
    let segment_val = i * segment_size;
    range_segments.push(segment_val);
  };
  return range_segments
}

class Instrument {
  constructor() {
    this.preset_name = 'Default'
    this.oscillator = new Tone.OmniOscillator({
      type: 'sine',
      mute: 'false'
    });
    this.amplifier = new Tone.AmplitudeEnvelope({
      attack: 0.02,
      decay: 0.02,
      sustain: 1,
      release: 0.02
    });
    this.distortion = new Tone.Distortion({
      distortion: 0,
    });
    this.filter = new Tone.Filter({
      type: 'lowpass',
      rolloff: -24,
      Q: 2
    });
    this.lfo = new Tone.LFO({
      type: 'sine',
      min: -6,
      max: 6,
      amplitude: 0,
    });
    this.lfo_dest = this.oscillator.frequency;
    this.filter_envelope = new Tone.FrequencyEnvelope({
      attack: 0.01,
      decay: 0.01,
      sustain: 1,
      release: 0.05,
      baseFrequency: 80,
      octaves: 8,
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
      volume: 0
    });
    patchNodes()
  }
  patchNodes() {
    //attach envelope to
    this.filter_envelope.connect(this.filter.frequency)
    this.oscillator.chain(this.oscillator, this.amplifier, this.distortion, this.filter, this.delay, this.reverb, this.volume, Tone.Master)
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
    n.velocity = dynamics.includes(n.velocity)? dynamics.indexOf(velocity) : n.velocity;
    instrument.oscillator.start(time);
    instrument.filter_envelope.triggerAttackRelease(n.note, n.duration, n.velocity, time);
    instrument.amplifier.triggerAttackRelease(n.note, n.duration, n.velocity, time);
    instrument.oscillator.stop(time + instrument.amplifier.release)
  }
  serialize() {
    //return an object preset for saving to the server
    return {
      oscillator: {
        type: this.oscillator.type,
      },
      amplifier: {
        attack: this.amplifier.attack,
        decay: this.amplifier.decay,
        sustain: this.amplifier.sustain,
        release: this.amplifier.release
      },
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
      }
    }
  }
  deSerialize(object) {
    this.oscillator.type = object.oscillator.type;
    this.amplifier.attack = object.amplifier.attack;
    this.amplifier.decay = object.amplifier.decay;
    this.amplifier.sustain = object.amplifier.sustain;
    this.amplifier.release = object.amplifier.release;
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
    this.time = 0
  }
  addSequence() {
    //initializes a default sequence, adds to end of list
    let sequence = new Sequence();
    this.sequences.push(sequence);
  }
  removeLastSequence() {
    this.sequences.pop();
  }
  addBeat(sequence_index) {
    this.sequences[sequence_index].push(new Beat())
  }
  removeLastBeat(sequence_index) {
    this.sequences[sequence_index].pop)();
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
  get currentSequenceIndex() {
    return this.arrangement[this.measure];
  }
  get currentMeasureLength() {
    return this.sequences[this.currentSequenceIndex].length;
  }
  get currentSequenceData() {
    return this.sequences[this.currentSequenceIndex];
  }
  get currentBeatData() {
    return this.currentSequenceData[this.beat];
  }
  get totalMeasures() {
    return this.sequences.length();
  }
  get currentPreset() {
    return currentSequenceData.synth_preset;
  }
  set currentMeasureLength(beats) {
    let meas = this.sequences[this.currentSequenceIndex]
    while (beats > this.currentMeasureLength) {
      // remove extra beats
      meas.pop()
    }
    while (beats < this.currentMeasureLength) {
      this.addBeat(meas);
    }
  }
  set arrangementLength(measures) {
    while (measures > this.totalMeasures) {
      // remove extra beats
      this.sequences.pop()
    };
    while (measures < this.totalMeasures) {
      this.addSequence()
    }
  }
  updateSongClock() {
    if (this.playing) {
      let timer = setTimeout( function () {

        this.updateSongClock(); //callback

        //set clock to next increment
        this.beat += 1;
        if (this.beat > this.currentMeasureLength) {
          this.beat = 0; //reset at bar end
          this.measure += 1 //increment measure
        }
        if (this.measure > this.totalMeasures) {
          if (this.loop) {
            this.measure = 0;
          }
          else {
            this.playing = false;
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
      }
    }, 1000);
  }
  playPause() {
    this.playing = !this.playing;
    if (this.playing) {
      updateSongClock();
      updateTimeClock();
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
  loadCurrentPreset() {

  }
  //methods:
  //save song
  //crud arrangement/measures
  //load data from server
  //return list from server
  //push data to server
  //save song
  //load song
    }
  }
}

let fiddlehead = new SongManager()

// axios({
//   method: 'GET',
//   url: '/fiddleapp/api/',
// }).then(result => {
//   console.log(result);
// }).catch(error => {
//   console.log(error);
// });
