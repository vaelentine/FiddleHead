const transport_data = {
  data: {
    name: 'untitled',
    measure_position: 1,
    beat_position: 1,
    current_measure_data: {
      synth_settings: {},
      beat_data: {}
    },
  }
}

class Song {
  constructor(title='untitled') {
    this.title = title;
    this.sequence_list = [];
    this.arrangement = [];
    this.bpm = 120;
  }
}
class Sequence {
  constructor() {
    this.beats = [];
    this.synth_preset = null;
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
}

const songConstants = {
  notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
}
const synth_constants = {
  oscillator: {
    types: ['sine', 'triangle', 'square', 'square8', 'sawtooth', 'pwm', 'fatsquare', 'fatsawtooth'],
    spread: {min: 0, max: 100},
    count: {min: 1, max: 8}
  },
  distortion: {
    distortion: {min: 0, max: 1}
  }
  amplifier: {
    attack: {min: 0.02, max: 10},
    decay: {min: 0.01, max: 10},
    sustain: {min: 0, max: 1}
    release: {min: 0.02, max: 10}
  },
  filter: {
    types: ['lowpass', 'highpass', 'bandpass'],
    rolloffs: [-12, -24]
    Q: {min:0, max:6}
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
  }
}

function linearRange(min, max, base) {
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
  playNote(instrument, note, duration, velocity) {
    let dynamics = ['pp', 'p', 'mp', 'mf', 'f', 'ff']
    dynamics.includes(velocity)? velocity = dynamics.indexOf(velocity) : velocity = velocity;
    instrument.triggerAttackRelease(note, duration, velocity)
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
