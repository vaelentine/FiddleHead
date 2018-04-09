window.onload = function () {
//parent component
  const vm = new Vue({
      el: '#app',
      template:
      `<div class="fiddlehead_div">

        <view_screen
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
                <div v-for="n of fh_constants.sequence.max_beats" :beat_num="n" :class="{on:fiddlehead.getCurrentMeasureLength===n}" class="cell" @click="fiddlehead.getCurrentMeasureLength(n)">
                </div>
              </div>

              <div class="view_select" v-for="v in views.sequence" @click="view=v">{{ view }}</div>

              <div class="matrix_div">
                <div v-if="view==='notes'" v-for="beat of fiddlehead.getCurrentMeasureLength" class="beat_container" :beat="beat">
                  <div class="cell" v-for="note in fh_constants.beats.notes" :class="{on:currSeqMuteQuery(note, beat)}" :note_name="note" :beat_number="beat" @click="toggleNote(beat, note)">{{ note }}
                  </div>
                </div>


                <div v-if="view==='durations'" v-for="beat of fiddlehead.getCurrentMeasureLength" class="beat_container" :beat="beat">
                  <div class="cell" v-for="duration in fh_constants.beat.durations" :class="{on:currSeqBeatData[beat].duration===duration}" :duration_name="duration" :beat_number="beat" @click="currSeqBeatData[beat].duration=duration">{{ duration }}
                  </div>
                </div>

                <div v-if="view==='dynamics'" v-for="beat of fiddlehead.getCurrentMeasureLength" class="beat_container" :beat="beat">
                  <div class="cell" v-for="dynamic in fh_constants.beat.dynamics" :class="{on:currSeqBeatData[beat].velocity===dynamic}" :dynamic_name="dynamic" :beat_number="beat + 1" @click="currSeqBeatData[beat].velocity=dynamic">{{ dynamic }}
                  </div>
                </div>

                <div v-if="view==='octaves'" v-for="beat of fiddlehead.getCurrentMeasureLength" class="beat_container" :beat="beat">
                  <div class="cell" v-for="octave in fh_constants.beat.octaves" :class="{on:currSeqBeatData[beat].octave===octave}" :octave_name="octave" :beat_number="beat" @click="currSeqBeatData[beat].octave=octave">{{ octave }}</div>
                </div>
              </div>
            </div>

            <div v-if="mode==='Arrangement'">
              <div class="arrangement_length_div">
                <label> arrangement length: </label>
                <div v-for="n of fh_constants.arrangement.max_measures" :measure_num="n+1" :class="{on:fiddlehead.totalMeasures===n}" class="cell" @click="fiddlehead.arrangementLength=n">
                </div>
              </div>

              <div class="view_select" v-for="v in views.arrangement" @click="view=v">{{ view }}</div>

              <div class="matrix_div">
                <div v-for="measure of fiddlehead.totalMeasures" class="measure_container" :measure="measure">
                  <div class="cell" v-for="sequence in fiddlehead.totalMeasures" :class="{on:fiddlehead.arrangement[measure]===sequence}" :sequence_name="sequence" :sequence_number="sequence" @click="fiddlehead.arrangement[measure]=sequence">{{ sequence }}</div>
                </div>
              </div>
            </div>

            <div v-if="mode==='Synthesizer'">
              <div class="oscillator_div">
                <label> oscillator: {{ fiddlehead.synth.Oscillator.type }}</label>
                <div v-for="type in fh_constants.oscillator.types" :class="{on:fiddlehead.synth.Oscillator.type===type}" class="cell" @click="fiddlehead.synth.Oscillator.type=type"> {{ type }}
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
            <transport/>
          </div>
          </div>
        </div>`,
      data: {
        fiddlehead: fiddlehead,
        fh_constants: fh_constants,
        song_name: 'untitled', //user set
        message:'message', //status messages
        mode: 'Sequence', //user determined
        modes: ['Sequence', 'Arrangement', 'Synthesizer', 'User'],
        views:{
          sequence: ['notes', 'durations', 'dynamics', 'octaves'],
          arrangement: ['arrangement'],
          synth: ['amplifier', 'filter', 'lfo', 'delay', 'reverb'],
          user:['login','presets', 'songs']
        },
      },
      methods: {
        toggleNote(beat, note) {
          //get note data,
          //toggle active state for cell
          //update note data for cell
          let seq = this.fiddlehead.getCurrentSequenceIndex()
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
          let seq = this.fiddlehead.getCurrentSequenceIndex();
          let beat = this.fiddlehead.getBeatValues(seq);
          if (!beat.mute) {
            if (note === beat.note){
              return true;
            }
          }
        },
        currSeqBeatData(beat_ind){
          let beats = this.fiddlehead.getCurrentSequenceData();
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
        },
        play_pause_icon: function () {
          return this.playing? '❙❙':'■';
        }
      }
    })
}
