window.onload = function () {
//parent component
  const vm = new Vue({
      el: '#app',
      template:
      `<div class="fiddlehead_div">
        <view_screen
          :message="fiddlehead.message"
          :song_name="fiddlehead.title"
          :number_of_beats="fiddlehead.currentMeasureLength"
          :current_beat="fiddlehead.beat"
          :current_measure="fiddlehead.measure"
          :preset_name="fiddlehed.currentPreset"
          :total_measures="fiddlehead.totalMeasures"
          :beats_per_minute='fiddlehead.bpm'
          :play_time="fiddlehead.time"
          :mode_selected="mode"
          :view_selected="view"
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
                <div v-for="n of fh_constants.sequence.max_beats"
                :beat_num="n" :class="{on:fiddlehead.currentMeasureLength===n}" class="cell" @click="fiddlehead.currentMeasureLength(n)">
                </div>
              </div>

              <div class="view_select" v-for="v in views.sequence" @click="view=v">{{ view }}</div>

            <div class="matrix_div">
              <div v-if="view==='notes'"
              v-for="beat of fiddlehead.currentMeasureLength" class="beat_container" :beat="beat">
                <div class="cell" v-for="note in fh_constants.beats.notes" :class="{on:currSeqMuteQuery(note, beat)}" :note_name="note" :beat_number="beat" @click="toggleNote(beat, note)">{{ note }}</div>
              </div>

              <div v-if="view==='durations'" v-for="beat of fiddlehead.currentMeasureLength" class="beat_container" :beat="beat">
                <div class="cell" v-for="duration in fh_constants.beat.durations" :class="{on:currSeqBeatData[beat].duration===duration}" :duration_name="duration" :beat_number="beat" @click="currSeqBeatData[beat].duration=duration">{{ duration }}</div>

              </div>
              <div v-if="view==='dynamics'" v-for="beat of fiddlehead.currentMeasureLength" class="beat_container" :beat="beat">
                <div class="cell" v-for="dynamic in fh_constants.beat.dynamics" :class="{on:currSeqBeatData[beat].velocity===dynamic}" :dynamic_name="dynamic" :beat_number="beat + 1" @click="currSeqBeatData[beat].velocity=dynamic">{{ dynamic }}</div>
              </div>

              <div v-if="view==='octaves'" v-for="beat of fiddlehead.currentMeasureLength" class="beat_container" :beat="beat">

                <div class="cell" v-for="octave in fh_constants.beat.octaves" :class="{on:currSeqBeatData[beat].octave===octave}" :octave_name="octave" :beat_number="beat" @click="currSeqBeatData[beat].octave=octave">{{ octave }}</div>
              </div>
            </div>

            <div v-if="mode==='Arrangement'">
              <div class="arrangement_length_div">
                <label> arrangement length: </label>
                <div v-for="n of fh_constants.arrangement.max_measures"
                :measure_num="n+1" :class="{on:fiddlehead.totalMeasures===n}" class="cell" @click="fiddlehead.arrangementLength=n">
                </div>
              </div>

              <div class="view_select" v-for="v in views.arrangement" @click="view=v">{{ view }}</div>

              <div class="matrix_div">
                <div v-for="measure of fiddlehead.totalMeasures" class="measure_container" :measure="measure">
                  <div class="cell" v-for="sequence in fiddlehead.totalMeasures" :class="{on:fiddlehead.arrangement[measure]===sequence}" :sequence_name="sequence" :sequence_number="sequence" @click="fiddlehead.arrangement[measure]=sequence">{{ sequence }}</div>
                </div>
              </div>

              </div>
            </div>
            </div>
          <div v-if="mode==='Synthesizer'">
            <div class="oscillator_div">
              <label> oscillator: {{ fiddlehead.synth.Oscillator.type }}</label>
              <div v-for="type in fh_constants.oscillator.types"
              :class="{on:fiddlehead.synth.Oscillator.type===type}" class="cell" @click="fiddlehead.synth.Oscillator.type=type"> {{ type }}
              </div>
            </div>

            <div class="view_select" v-for="v in views.synth" @click="view=v">{{ view }}</div>

            <div class="matrix_div" v-if="view==='amplifier'">
              <div v-for="setting of fiddlehead.synth.amplifier" class="matrix_x_container" :setting="setting">
              <label>{{ setting }}</label>
                <div class="cell" v-for="value in env_time_array" :class="{on:fiddlehead.synth.amplifier[setting]===value}" :setting_name="setting" :setting_value="value" @click="fiddlehead.synth.amplifier[setting]=value">{{ value }}</div>
              </div>
            </div>

            </div>
          </div>
          <div class="bt_cont">
            <div class="slot">
              <div class="tr_bt inline" id="prev_bt" v-on:click=fiddlehead.seekPrevious() > ◅◅ </div>
              <div class="tr_bt inline" id="play_bt" v-on:click=fiddlehead.seekNext> ► </div>
              <div class="tr_bt inline" id="play_pause_bt" v-on:click=fiddlehead.playPause() > {{ play_pause_icon }} </div>
              <div class="tr_bt inline" id="next_bt" v-on:click=fiddlehead.seekNext() > ▻▻ </div>
            </div>
        </div>
      </div>`,
      data: {
        fiddlehead: fiddlehead
        song_name: 'untitled', //user set
        message:'message', //status messages
        mode: 'Sequence', //user determined
        view: 'notes',
        modes: ['Sequence', 'Arrangement', 'Synthesizer', 'User'],
        views:{
          sequence: ['notes', 'durations', 'dynamics', 'octaves'],
          arrangement: ['arrangement'],
          synth: ['amplifier', 'filter', 'lfo', 'delay', 'reverb'],
          user:['login','presets', 'songs']}
        },
      },
      methods: {
        createNotes() {
          let vm = this;
          let seq = vm.sequence.beats;
          //popoff extra notes
          while (seq.length > this.fiddlehead.currentMeasureLength - 1) {
            seq.pop();
          };
          //get notes for the length of the sequence or create a new note
          for (let i=0; i < this.fiddlehead.currentMeasureLength; i++) {
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
          let seq = this.fiddlehead.currentSequenceIndex
          let beat_obj = this.fiddlehead.getBeatValues(seq, beat)
          if (beat_obj.note === note) {
            beat.toggleMute()
          }
          else {
            beat_obj.mute = false;
            beat_obj.note = note;
          }
        },
        currSeqMuteQuery(note, beat) {
          let seq = this.fiddlehead.currentSequenceIndex;
          let beat = this.fiddlehead.getBeatValues(seq);
          if (!beat.mute) {
            if (note === beat.note){
              return true;
            }
          }
        },
        currSeqBeatData(beat_ind){
          let beats = this.fiddlehead.currentSequenceData();
          return beats[beat];
        },
        octQuery(index, octave) {
          let vm = this;
          let seq = vm.sequence;
          let oct_v = seq[index].octave;
          return oct_v === octave;
        },
        playNote(note_obj) {
          duration = note_obj.duration;
          let note_name = note_obj.note + note_obj.octave;
          console.log(note_obj)
          synth.volume.value =  0;
          synth.filterEnvelope.exponent = note_obj.envelopeAmount;
          synth.triggerAttackRelease(note_name, duration)
        },
      },
      computed:{
        view: function(){
          return this.views[this.mode]
        },
        song_state: function() {
          return this.playing? 'playing':'stopped'
        },
        env_time_array: function() {
          return linearRange(0.1, 1, 10);
        }
        play_pause_icon: function () {
          return this.playing? '❙❙':'■';
        }

      },
    })
}




function createNumRange(min, max, step) {
  let range_array=[];
  for(let i = 0; i < max; i += step) {
    range_array.push(i);
  return range_array
  }
}
