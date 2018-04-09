window.onload = function () {
//parent component
  const vm = new Vue({
      el: '#app',
      template:
      `<div class="fiddlehead_div">
        <view_screen
          :message="message"
          :song_name="song_name"
          :number_of_beats="arrangement.beatsPerMeasure"
          :current_beat="current_beat"
          :current_measure="measureNumber"
          :preset_name="preset_name"
          :total_measures="arrangement.numberOfMeasures"
          :beats_per_minute='bpm'
          :play_time="undefined"
          :mode_selected="mode"
          :view_selected="currentView"
          :transport_state="song_state"/>
          <div class="mode_selector">
            <label class="ui_info">mode select</label>
            <div v-for="selection in modes" class="mode_bt" @click="mode=selection" :class="{active:mode===selection}">{{selection}}</div>
          </div>
          <div class="options_div">

          <div class="mode_view">
            <div v-if="mode==='Sequence'">
              <div class="sequence_length_div">
                <label> sequence length: </label>
                <div v-for="n of sequence.maxBeatsAllowed"
                :beat_num="n+1" :class="{on:sequence.beatsPerMeasure===n}" class="cell" @click="sequence.beatsPerMeasure=n">
                </div>
              </div>

              <div class="view_select" v-for="view in sequence.views" @click="currentView=view">{{ view }}</div>

            <div class="matrix_div">
              <div v-if="currentView==='notes'"
              v-for="beat of sequence.beatsPerMeasure" class="beat_container" :beat="beat + 1">
                <div class="cell" v-for="note in sequence.notes" :class="{on:mutequery(note, beat)}" :note_name="note" :beat_number="beat + 1" @click="toggleNote(beat, note)">{{ note }}</div>
              </div>

              <div v-if="currentView==='durations'" v-for="beat of sequence.beatsPerMeasure" class="beat_container" :beat="beat + 1">
                <div class="cell" v-for="duration in sequence.durations" :class="{on:sequence.beats[beat-1].duration===duration}" :duration_name="duration" :beat_number="beat + 1" @click="sequence.beats[beat-1].duration=duration">{{ duration }}</div>

              </div>
              <div v-if="currentView==='dynamics'" v-for="beat of sequence.beatsPerMeasure" class="beat_container" :beat="beat + 1">
                <div class="cell" v-for="dynamic in sequence.dynamics" :class="{on:sequence.beats[beat-1].velocity===sequence.dynamics.indexOf(dynamic)}" :dynamic_name="dynamic" :beat_number="beat + 1" @click="sequence.beats[beat-1].velocity=sequence.dynamics.indexOf(dynamic)">{{ dynamic }}</div>
              </div>

              <div v-if="currentView==='octaves'" v-for="beat of sequence.beatsPerMeasure" class="beat_container" :beat="beat + 1">

                <div class="cell" v-for="octave in sequence.octaves" :class="{on:sequence.beats[beat-1].octave===octave}" :octave_name="octave" :beat_number="beat + 1" @click="sequence.beats[beat-1].octave=octave">{{ octave }}</div>
              </div>
            </div>

            <div v-if="mode==='Arrangement'">
              <div class="arrangement_length_div">
                <label> arrangement length: </label>
                <div v-for="n of arrangement.maxMeasuresAllowed"
                :measure_num="n+1" :class="{on:arrangement.numberOfMeasures===n}" class="cell" @click="arrangement.numberOfMeasures=n">
                </div>
              </div>


              <div class="matrix_div">
                <div v-for="measure of arrangement.measuresPerSong" class="measure_container" :measure="measure + 1">
                  <div class="cell" v-for="sequence in arrangement.sequences" :class="{on:arrangement.measure==arrangement.sequence}" :sequence_name="sequence.sequenceName" :sequence_number="sequence + 1" @click="arrangement.sequence[sequence]">{{ sequence.sequenceName }}</div>
                </div>
              </div>
              </div>
            </div>
            </div>
          <div v-if="mode==='Synthesizer'">
            <div class="oscillator_div">
              <label> oscillator: {{ synthSettings.Oscillator.type }}</label>
              <div v-for="type in synthSettings.Oscillator.types"
              :class="{on:synthSettings.Oscillator.type===type}" class="cell" @click="synthSettings.Oscillator.type=type"> {{ type }}
              </div>
            </div>
            </div>
          </div>
          <div class="bt_cont">
            <div class="slot">
              <div class="tr_bt inline" id="prev_bt" v-on:click=seekPrev() > ◅◅ </div>
              <div class="tr_bt inline" id="play_bt" v-on:click=play()> ► </div>
              <div class="tr_bt inline" id="pause_bt" v-on:click=pause() > ❙❙ </div>
              <div class="tr_bt inline" id="stop_bt" v-on:click=stop() > ■ </div>
              <div class="tr_bt inline" id="next_bt" v-on:click=seekNext() > ▻▻ </div>
              <div class="tr_bt inline" id="next_bt" v-on:click=seekNext() > + </div>
              <div class="tr_bt inline" id="next_bt" v-on:click=seekNext() > del </div>
              <div class="tr_bt inline" id="save_bt" v-on:click=seekNext() > 💾  </div>
              <div class="tr_bt inline" id="_bt" v-on:click=seekNext() > 📁 </div>

            </div>
        </div>
      </div>`,
      data: {
        song_name: 'untitled', //user set
        message:'message', //status messages
        mode: 'Sequence', //user determined
        currentView: 'notes',
        modes: ['Sequence', 'Arrangement', 'Synthesizer', 'User'],
        bpmMax: 999,
        bpmMin: 60,
        bpm: 120,
        playing: false,
        measureNumber: 1,
        current_beat: 1,
        preset_name: 'none',
        arrangement: {
          viewName: 'Arrangement',
          numberOfMeasures: 2,
          maxMeasuresAllowed: 16,
          views:['Arrangement'],

          measures:[],
          sequences:[],
        },
        sequence: {
          viewName: '',
          sequenceNumber: 1,
          views: ['notes', 'durations', 'dynamics', 'octaves'],
          currentBeatData: '',
          beats:[],
          sequenceName: 'None',
          maxBeatsAllowed: 16,
          maxBeatsPerMeasure: 16,
          beatsPerMeasure: 8,
          notes: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
          durations: ['1m', '2n', '4n', '8n', '16n'],
          octaves: [0,1,2,3,4,5,6,7,8],
          dynamics: ['pp','p', 'mp', 'mf', 'f', 'ff'],
        },
        synthSettings: {
          PresetName: 'None',
          Presets: [],
          Oscillator: { type: '', types: ['sine', 'triangle', 'square', 'sawtooth', 'pwm']},
          Amplifier: {
            Attack: {min: 0.01, max: 10, step: 0.5, value: 0.5, source: synth.envelope.attack},
            Decay: {min: 0.01, max: 10, step: 0.5, value: 0.5, source: synth.envelope.attack},
            Sustain: {min: 0.01, max: 10, step: 0.5, value: 0.5, source: synth.envelope.attack},
            Release: {min: 0.01, max: 10, step: 0.5, value: 0.5, source: synth.envelope.release},
          },
          Filter: {
            Attack: {min: 0.01, max: 10, step: 0.5, value: 0.5, source: synth.envelope.attack},
            Decay: {min: 0.01, max: 10, step: 0.5, value: 0.5, source: synth.envelope.attack},
            Sustain: {min: 0.01, max: 10, step: 0.5, value: 0.5, source: synth.envelope.attack},
            Release: {min: 0.01, max: 10, step: 0.5, value: 0.5, source: synth.envelope.release},
            Frequency: {min: 60, max: 18000, step: 0.5, value: 1000, source: synth.envelope.release},
            Resonance: {min: 60, max: 18000, step: 0.5, value: 1000, source: synth.envelope.release},
          },
          LFO: {
            Speed: {},
            Destination: {},
            Amount: {},
          },
          Delay: {
            Time: {min: 0.01, max: 10, step: 0.5, value: 0.5, source: p_p_delay.delayTime.value},
            Feedback: {min: 0.5, max: 10, step: 0.5, value: 1, source: p_p_delay.feedback.value},
            Amount: {min: 0.5, max: 10, step: 0.5, value: 1, source: p_p_delay.wet.value}
          },
          Reverb: {
            Size: {min: 0.01, max: 10, step: 0.5, value: 0.5, source: reverb.roomSize.value},
            Amount: {min: 0, max: 1, step: 0.1, value: 0, source: reverb.wet.value}
          }
        }
      },
      methods: {
        update_clock() {
          let vm = this;
          if (vm.playing) {
            let timer = setTimeout( function () {
              vm.update_clock();
              vm.current_beat += 1;
              if (vm.current_beat > vm.sequence.beatsPerMeasure) {
                vm.measureNumber + 1;
                vm.current_beat = 1;
                vm.measureNumber = vm.measureNumber % vm.arrangement.measuresPerSong;
              }
              vm.currentBeatData = vm.sequence.beats[vm.current_beat - 1]
              if (vm.currentBeatData.on) {
                vm.playNote(vm.currentBeatData)
              }
            }, 60000/vm.bpm)
          }
        },
        play() {
          let vm = this;
          vm.current_beat = 1;
          vm.playing = !vm.playing;
          vm.update_clock()
        },
        pause() {
          this.playing = false;
        },
        stop() {
          this.playing = false;
          current_beat = 1;
        },
        seekPrev() {
          this.measureNumber -= this.measureNumber - 1 % vm.arrangement.measuresPerSong;
        },
        seekNext() {
          this.measureNumber = this.measureNumber + 1 % vm.arrangement.measuresPerSong;
        },
        createNotes() {
          let vm = this;
          let seq = vm.sequence.beats;
          //popoff extra notes
          while (seq.length > this.sequence.beatsPerMeasure - 1) {
            seq.pop();
          };
          //get notes for the length of the sequence or create a new note
          for (let i=0; i < this.sequence.beatsPerMeasure; i++) {
            //does note exist?
            if (!seq[i]) {
              let silentnote = {
              beat: i + 1,
              on: false,
              note: 'C',
              duration: '8n',
              octave: 3,
              velocity: 0,
              envelopeAmount: 0,
              noiseGain: 0.5,
              };
                seq.push(silentnote);
              }
            }
          },
        toggleNote(beat, note) {
          //get note data,
          //toggle active state for cell
          //update note data for cell
          let vm = this;
          let seq = vm.sequence.beats;
          if (seq[beat -1].on && seq[beat -1].note === note) {
            seq[beat -1].on = !seq[beat-1].on;
          }
          else {
            seq[beat -1].on = true;
            seq[beat -1].note = note;
          }
        },
        mutequery(note, beat) {
          let vm = this;
          let seq = vm.sequence.beats;
          if (seq[beat - 1]) {
            if (seq[beat - 1].on && note === seq[beat - 1].note){
            return true}
          }
        },
        octQuery(index, octave) {
          let vm = this;
          let seq = vm.sequence;
          let oct_v = seq[index].octave;
          return oct_v === octave
        },
        playNote(note_obj) {
          duration = note_obj.duration;
          let note_name = note_obj.note + note_obj.octave;
          console.log(note_obj)
          synth.volume.value =  0;
          synth.filterEnvelope.exponent = note_obj.envelopeAmount;
          synth.triggerAttackRelease(note_name, duration)
        },
        initSequences() {
          let seqs= this.arrangement.sequences;
          while (seqs.length > this.arrangement.numberOfMeasures){
            seqs.pop();
          };
          //get notes for the length of the sequence or create a new note
          for (let i=0; i < this.arrangement.numberOfMeasures; i++) {
            //does note exist?
            if (!seqs[i]) {
              let newsequence=
              {
                  viewName: '',
                  sequenceNumber: i,
                  views: ['notes', 'durations', 'dynamics', 'octaves'],
                  currentBeatData: '',
                  beats:[],
                  sequenceName: 'None',
                  maxBeatsAllowed: 16,
                  maxBeatsPerMeasure: 16,
                  beatsPerMeasure: 8,
                  notes: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
                  durations: ['1m', '2n', '4n', '8n', '16n'],
                  octaves: [0,1,2,3,4,5,6,7,8],
                  dynamics: ['pp','p', 'mp', 'mf', 'f', 'ff'],
                }
              seqs.push(newsequence);
            };
          };
        },
        cloneSequence(sequence) {
          let vm = this;
          vm.arrangement.push(sequence)
        },
        deleteSequence(sequence, index) {
        },
        updateSynth() {
          let vm = this;
          synth.envelope.attack = vm.synthSettings.amplifier.Attack.value;
          synth.envelope.decay = vm.synthSettings.amplifier.Decay.value;
          synth.envelope.sustain = vm.synthSettings.amplifier.Sustain.value;
          synth.envelope.release = vm.synthSettings.amplifier.Release.value;
          console.log(synth.envelope.attack);

          synth.filterEnvelope.attack = vm.synthSettings.Filter.Attack.value;
          synth.filterEnvelope.decay =  vm.synthSettings.Filter.Decay.value;
          synth.filterEnvelope.sustain = vm.synthSettings.Filter.Sustain.value;
          synth.filterEnvelope.release = vm.synthSettings.Filter.Release.value;
          synth.filterEnvelope.attack.baseFrequency = vm.synthSettings.Filter.Frequency.value;
          synth.filter.Q = vm.synthSettings.Filter.Quality.value;

          p_p_delay.delayTime = vm.synthSettings.Delay.pPDelTime.value;
          p_p_delay.feedback = vm.synthSettings.Delay.pPDelFdbk.value;
          p_p_delay.wet = vm.synthSettings.Delay.pPDelWet.value;

          // distortion.distortion = vm.synthSettings.Filter.Distortion.value;
        }
      },
      computed:{
        song_state: function(){
          return this.playing? 'playing' : 'stopped'
        },
        measuresPerSong: function () {
            return this.arrangement.measures.length
          },
      },
      mounted: function () {
        this.createNotes();
        this.initSequences();
        console.log(this.currentBeatData)
      }
    })
}




function createNumRange(min, max, step) {
  let range_array=[];
  for(let i = 0; i < max; i += step) {
    range_array.push(i);
  return range_array
  }
}
