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
  constructor(note='C', octave=3, duration='8n', velocity='mf', mute=false) {
    this.duration = duration;
    this.octave = octave;
    this.velocity = velocity;
    this.note = note;
    this.mute = mute;
  }
  toggleMute() {
    this.mute = !this.mute;
  }
}

const fh_constants = {
  beat: {
    durations: ['8n', '8t', '16n', '16t', '32n'],
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
    frequency: 500,
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
      type: "sawtooth",
      volume: 3,
    });
    this.amplifier = new Tone.AmplitudeEnvelope({
      attack: 0.1,
      decay: 0.1,
      sustain: 0.5,
      release: 0.2
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
      attack: 0.1,
      decay: 0.1,
      sustain: 1,
      release: 0.2,
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
    // this.oscillator.connect(this.amplifier);
    this.amplifier.connect(this.distortion);
    this.distortion.connect(this.filter);
    this.filter.connect(this.delay);
    this.delay.connect(this.reverb);
    this.reverb.connect(this.volume);
    this.volume.toMaster();
  }
  decouple_osc() {
    return this.oscillator.disconnect(this.amplifier);
  }
  reconnect_osc() {
    return this.oscillator.connect(this.amplifier);
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
    // this.oscillator.stop(Tone.time)
    let n = note_obj;
    let time = Tone.time;
    let dynamics = ['pp', 'p', 'mp', 'mf', 'f', 'ff'];
    let instrument = this;
    let note = n.note + (n.octave);
    let velo = dynamics.indexOf(n.velocity)/10
    // console.log(note);
    // n.velocity = dynamics.includes(n.velocity)? dynamics.indexOf(n.velocity) : n.velocity;
    // // instrument.oscillator.start(time);

    // this.oscillator.volume.exponentialRampToValueAtTime(0, n.duration);
    // .stop(`+${n.duration}`);
    // let osc = new Tone.OmniOscillator();
    // let amp = new Tone.AmplitudeEnvelope();
    // osc.connect(amp)
    // amp.toMaster();
    // osc.start().stop('+2n');
    // amp.triggerAttackRelease('C4','2n');
    this.oscillator.frequency.value = note;
    this.filter_envelope.triggerAttackRelease(time, n.duration, velo);
    this.amplifier.triggerAttackRelease(note, n.duration, Tone.time);

    // this.oscillator.stop(4);
    // this.oscillator.stop('1m')
    // this.oscillator.disconnect()
    // this.oscillator.stop()
    // this.oscillator.stop(n.duration)
    // instrument.oscillator.stop(time + instrument.amplifier.release)

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
    this.oscillator.type = object.oscillator_type;
    this.amplifier.attack = object.amplifier_attack;
    this.amplifier.decay = object.amplifier_decay;
    this.amplifier.sustain = object.amplifier_sustain;
    this.amplifier.release = object.amplifier_release;
    this.distortion.distortion = object.distortion;
    this.filter.type = object.filter_type;
    this.filter.rolloff = object.filter_rolloff;
    this.filter.Q = object.filter_Q;
    this.filter.frequency = object.filter_frequency;
    this.filter_envelope.attack = object.filter_envelope_attack;
    this.filter_envelope.decay = object.filter_envelope_decay;
    this.filter_envelope.sustain = object.filter_envelope_sustain;
    this.filter_envelope.release = object.filter_envelope_release;
    this.filter_envelope.baseFrequency = object.filter_envelope_baseFrequency;
    this.filter_envelope.octaves = object.filter_envelope_octaves
    this.filter_envelope.exponent = object.this.filter_envelope_exponent;
    this.delay.delayTime = object.delay_delayTime;
    this.delay.feedback = object.delay_feedback;
    this.delay.wet = object.delay_wet;
    this.reverb.roomSize = object.reverb_roomSize;
    this.reverb.dampening = object.reverb_dampening;
    this.reverb.wet = object.reverb_wet;
  }

}

class SongManager {
  constructor() {
    this.loaded_songs =[];
    this.measure_length = 8;
    this.arrangement_length = 1;
    this.log = [];
    this.message = '';
    this.sequences = []; //sequence and beat data
    this.arrangement = []; //the order in which patterns will play
    this.title = 'untitled';
    this.presets = [];
    this.beat = 0; //current beat index
    this.measure = 0; //current measure index
    this.playing = false;
    this.loop = true;
    this.bpm = 120;
    this.internal_bpm = 120;
    this.synth = new Instrument();
    this.time = 0;
    this.addSequence()
    this.last_time = Date.now()
    this.updateSongClock = this.updateSongClock.bind(this);
  }
  addSequence() {
    //initializes a default sequence, adds to end of list
    let seq = new Sequence();
    this.sequences.push(seq);
    let ref = this.sequences.length - 1
    this.arrangement.push(ref)
    this.log.push('Added sequence!')
  }
  removeLastSequence() {
    this.sequences.pop();
    this.arrangement.pop();
    this.log.push('Removed Last Sequence')
  }
  addBeat(sequence_index) {
    this.sequences[sequence_index].beats.push(new Beat())
    this.log.push(`Beat added to sequence at index ${sequence_index}`)
    return this.sequences
  }
  removeLastBeat(sequence_index) {
    this.sequences[sequence_index].pop();
    this.log.push(`Beat removed from sequence at index ${sequence_index}`)
    return this.sequences
  }
  updateBeat(seq_index, beat_index, parameter, value) {
    this.sequences[seq_index][beat_index][parameter] = value;
    this.log.push(`sequence i${seq_index} beat i${beat_index} parameter ${parameter} set to ${value}`)
  }
  getBeatValues(seq_index, beat_index){
    return this.sequences[sequence_index][beat_index];
  }

  savePresetToCurrSeq(){
    let preset = this.synth.serialize();
    this.getCurrentSequenceData().synth_preset = preset;
    this.log.push(`Preset loaded to current sequence`)

  }
  toggleLoadPreset(seq_index){
    let load = this.sequences[seq_index].load_query;
    load = !load
    this.log.push(`Preset loading toggled`)

  }
  checkLoadPreset(seq_index){
    // console.log('seq_index' + seq_index)
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
  currentBeatData() {
    return (this.getCurrentSequenceData())[this.beat];
  }
  totalMeasures() {
    return this.sequences.length;
  }
  getCurrentPreset() {
    return (this.getCurrentSequenceData()).synth_preset;
  }
  setCurrentMeasureLength(beats_num=undefined){
    if (beats_num === undefined) {
      return getCurrentMeasureLength()
    }
    let meas = this.sequences[this.getCurrentSequenceIndex()].beats;
    if (beats_num > meas.length) {

      while (beats_num > meas.length) {
        // remove extra beats
        this.addBeat(this.getCurrentSequenceIndex());
      }
    }
    else if (beats_num < meas.length){
      while (beats_num < meas.length) {
        meas.pop()
        this.log.push(`beat removed`)
      }
    }
    return this.getCurrentMeasureLength()
  }
  set currentMeasureLength(beats_num) {
    let meas = this.sequences[this.getCurrentSequenceIndex()]
    while (beats_num > this.measure_length) {
      // remove extra beats
      meas.pop()
      this.log.push(`beat removed`)

    }
    while (beats_num < this.measure_length) {
      this.addBeat(meas);
      this.log.push(`beat added`)

    }
    return this.getCurrentMeasureLength()
  }
  setMeasureReference(measure_ind, seq_ind) {
    //set the sequence_index to be played at measure_num
    this.arrangement[measure_ind] = seq_ind;
    return this.arrangment;
  }
  setArrangementLength(num_measures) {
    this.arrangement_length = num_measures;
    if (this.sequences.length > num_measures) {
      while (this.sequences.length > num_measures) {

        // remove extra beats
        this.removeLastSequence();
        this.log.push(`measure removed`)

      }
    }
    else if (this.sequences.length < num_measures) {
      while (this.sequences.length < num_measures) {
        this.addSequence();
        this.log.push(`measure added`)
      }
    }
    return this.arrangement_length;
  }
  updateSongClock() {
    let now = Date.now()
    let fh = this;
    // console.log(this);
    console.log(this);

    if (fh.playing) {
      // let timer = setTimeout(function() {
        // fh.updateSongClock(); //callback
        requestAnimationFrame(this.updateSongClock);

        let elapsed_time = now - fh.last_time;
        if (elapsed_time > 60000/fh.internal_bpm) {
        fh.last_time = now - (elapsed_time % 60000/fh.internal_bpm)
        let seq_i = fh.arrangement[fh.measure]
        let seq = fh.sequences[ seq_i ];
        fh.beat = fh.beat % seq.beats.length;

        //load preset
        if (fh.beat === 0){
          fh.measure = fh.measure % fh.sequences.length;
          if (fh.checkLoadPreset(fh.measure)){
            fh.synth.deserialize(seq.preset);
          }
        }
        //play note
        fh.internal_bpm = fh.bpm;
        Tone.Transport.bpm.value = fh.bpm;

        fh.playNote(seq.beats[fh.beat]);
        fh.setArrangementLength(fh.arrangement_length)
        fh.setCurrentMeasureLength(fh.measure_length)
        //set clock to next increment
        fh.beat += 1;
        if (fh.beat > seq.beats.length - 1) {

          fh.beat = 0; //reset at bar end
          fh.measure += 1 //increment measure
        }

        if (fh.measure > fh.sequences.length - 1) {
          if (fh.loop) {
            fh.measure = 0;
          }
          else {
            fh.playing = false;
            return fh.playing
          }
        }
      // }, 60000/this.internal_bpm);
    } //done doing all the stuff
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
    this.log.push('play state changed')
    if (this.playing){
      this.synth.reconnect_osc()
      this.synth.oscillator.start(Tone.time)
      this.updateSongClock()
    }
    else {
      return this.synth.decouple_osc()
    }
      // updateTimeClock();
  }
  playNote(note_obj) {
    if (!note_obj.mute) {
      this.synth.playNote(note_obj)
    }
    return note_obj
  }
  pause() {
    this.playing = false;
  }
  resetClock() {
    this.beat = 0;
    this.measure = 0;
  }
  seekNext() {
    this.beat = 0;
    let n = this.measure + 1
    this.measure = n % this.sequences.length;
    this.log.push('seek forward')
    return this.measure
  }
  seekPrevious() {
    this.beat = 0;
    let n = this.measure - 1;
    this.log.push('seek previous')

    this.measure = n<0? this.sequences.length-1 : n;
    // this.measure = n % this.sequences.length;
    return this.measure
  }
  saveSong(name) {
    this.serializeSong()
    axios({
      method: 'POST',
      url: '/fiddleapp/api/song_list/',
      data: {
        title: this.title,
        sequences: this.sequences,
        bpm: this.bpm
      },
    }).then(result => {
      this.loaded_songs.push(result)
      console.log(result);
    }).catch(error => {
      console.log(error);
    });
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
      url: '/fiddleapp/api/song_list/',
    }).then(result => {
      this.loaded_songs.push(result)
      console.log(result);
    }).catch(error => {
      console.log(error);
    });
  }
  mapIndicesToSequences(){
//for each sequence add seqArr{sequenceIndex:arrangmentIndex}
    for (let i = 0; i< this.sequences.length; i++){
      this.sequences[i].sequence_index =i;
      this.sequences[i].arrangement_index = this.arrangement[i];
    }
    return this.sequences
  }
  serializeSong() {
    this.mapIndicesToSequences()
    return {
      title: this.title,
      sequences: this.sequences,
      bpm: this.bpm
    }
  }
  loadCurrentPreset() {
  }
}

const fiddlehead = new SongManager();
fiddlehead.log.push('Welcome!')
for (let i = 0; i < fiddlehead.sequences[0].beats.length; i++){
  fiddlehead.sequences[0].beats[i].mute = false;
}
fiddlehead.getSongList()
params = fiddlehead.synth.serialize(fiddlehead)
// fiddlehead.addBeat(fiddlehead.getCurrentSequenceIndex());
// console.log(fiddlehead.getCurrentSequenceData());

// console.log(fiddlehead.getCurrentMeasureLength());
// axios({
//   method: 'GET',
//   url: '/fiddleapp/api/',
// }).then(result => {
//   console.log(result);
// }).catch(error => {
//   console.log(error);
// });
