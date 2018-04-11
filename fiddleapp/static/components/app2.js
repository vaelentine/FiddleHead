window.onload = function () {
//parent component
  const vm = new Vue({
      el: '#app',
      template:
      `<div class="fiddlehead_div">

        <div class="view_screen_div">
          <div class="digital_display_div inset">
            <div class="leds_container">
              <div v-for="beat of currentMeasureLength" :beat_number="beat" class="each_led_container">
                <led :beat_number="beat + 1" :active="beat-1==fiddlehead.beat" />
              </div>
            </div>
            <div class="Info">
              <div> Message: {{ message }} </div>
              <div id="song_name"> Song:{{ fiddlehead.title }}</div>
              <div id="seq_name">position: ({{ fiddlehead.measure +1 }}:{{ fiddlehead.beat + 1}}/{{ currentArrangementLength }})</div>
              <div>Preset: {{ fiddlehead.currentPreset }}</div>
              <div>Bpm: {{ fiddlehead.bpm }} </div>
              <div> Mode: {{ mode }}</div>
              <div> View: {{ view }} </div>
              <div> Transport state: {{ song_state }} </div>
            </div>
          </div>
        </div>

        <div class=bpm_sl>
        <label>BPM</label>
          <input type=range min="60" max="999" v-model.number="fiddlehead.bpm" step="1" />
          <label>{{ fiddlehead.bpm }}</label>
        </div>

        <transport/>

        <div class="mode_box">
        <label class="ui_info">mode select</label>
        <div class="mode_selector">
            <div v-for="selection in modes" class="mode_bt" @click="modeSelect(selection)" :class="{active:mode===selection}">  <label>{{selection}}</label></div>
        </div>
        </div>



        <div class="interactivity_div">


          <div class="mode_view">


          <div v-if="mode==='Sequence'">
            <div class="sequence_length_div">
              <label> sequence length: {{ currentMeasureLength }} </label>
              <div v-for="n of 16" class="cell" :beat_num="n" :class="{on:currentMeasureLength===n}" v-on:click="currentMeasureLength=n"> {{ n }}</div>
            </div>
          </div>


          <div v-if="mode==='Arrangement'">
            <div class="sequence_length_div">
              <label> arrangement length: {{ currentArrangementLength }} </label>
              <div v-for="n of 16" class="cell" :seq_num='n' :class="{on:currentArrangementLength===n}" v-on:click="currentArrangementLength=n"> {{ n }}</div>
            </div>

            <div class="sequence_length_div">
              <label> Save </label>
              <div class="cell" v-on:click="fiddlehead.saveSong"> Save this arrangement</div>
            </div>

          </div>

          <div v-if="mode==='Synthesizer'">
            <div class="sequence_length_div">
              <label> synth volume: {{ volume }} </label>
              <div v-for="n of 10" class="cell" :num="n" :class="{on:volume===n}" v-on:click="volume=n"> {{ n }}</div>
            </div>

          <div class="sequence_length_div">
            <label> oscillator: {{ fiddlehead.synth.oscillator.type }} </label>
            <div v-for="n of fh_constants.oscillator.types" class="cell" :num="n" :class="{on:oscillator_type==n}" v-on:click="oscillator_type=n"> {{ n }}</div>
          </div>
        </div>


          <div v-if="mode==='Sequence'">
            <div class="v_selector_box ">
              <label class="ui_info">view select</label>
              <div class ="view_arranger">
                <div class="view_select" v-for="v in views.Sequence" :class="{on:v===view}"@click="view=v"><label>{{ v }}</label></div>
              </div>
            </div>
          </div>

          <div v-if="mode==='Arrangement'">
            <div class="v_selector_box ">
              <label class="ui_info">view select</label>
              <div class ="view_arranger">
                <div class="view_select" v-for="v in views.Arrangement" :class="{on:v===view}" @click="view=v"><label>{{ v }}</label></div>
              </div>
            </div>
          </div>

          <div v-if="mode==='Synthesizer'">
            <div class="v_selector_box ">
              <label class="ui_info">view select</label>
              <div class ="view_arranger">
                <div class="view_select" v-for="v in views.Synthesizer" :class="{on:v===view}" @click="view=v"><label>{{ v }}</label></div>
              </div>
            </div>
          </div>
        </div>

          <div class="matrix_container" v-if="view==='notes'">
            <div class="matrix_column" v-for="beat in currentMeasureLength"> {{beat}}
              <div class="matrix_cell" v-for="note in fh_constants.beat.notes"
              :class="{on:currSeqMuteQuery(note, beat)}"
              @click="toggleNote(note,beat)"> {{ note }}</div>
            </div>
          </div>
          <div class="matrix_container" v-if="view==='durations'">
            <div class="matrix_column" v-for="beat in currentMeasureLength"> {{beat}}
              <div class="matrix_cell" v-for="duration in fh_constants.beat.durations"
              :class="{on:currSeqBeatData(beat-1).duration===duration}"
              @click="currSeqBeatData(beat-1).duration=duration"> {{ duration }}</div>
            </div>
          </div>
          <div class="matrix_container" v-if="view==='dynamics'">
            <div class="matrix_column" v-for="beat in currentMeasureLength"> {{beat}}
              <div class="matrix_cell" v-for="velocity in fh_constants.beat.dynamics"
              :class="{on:currSeqBeatData(beat-1).velocity===velocity}"
              @click="currSeqBeatData(beat-1).velocity=velocity"> {{ velocity }}</div>
            </div>
          </div>

          <div class="matrix_container" v-if="view==='octaves'">
            <div class="matrix_column" v-for="beat in currentMeasureLength"> {{beat}}
              <div class="matrix_cell" v-for="octave in fh_constants.beat.octaves"
              :class="{on:currSeqBeatData(beat-1).octave===octave}"
              @click="currSeqBeatData(beat-1).octave=octave"> {{ octave }}</div>
            </div>
          </div>

          <div class="matrix_container" v-if="view==='arrangement'">
            <div class="matrix_column" v-for="meas in arrangement.length"> {{meas}}
              <div class="matrix_cell" v-for="seq_i in arrangement.length"
              :class="{on:arrangementQuery(meas,seq_i)}"
              @click="updateArrangement(meas-1, seq_i-1)"> {{ seq_i }}</div>
            </div>
          </div>

          </div>
        </div>

      </div>
        `,
      data: {

        fiddlehead: fiddlehead,
        fh_constants: fh_constants,
        song_name: 'untitled', //user set
        mode: 'Sequence', //user determined
        modes: ['Sequence', 'Arrangement', 'Synthesizer', 'User'],
        view: 'notes',
        views:{
          Sequence: ['notes', 'durations', 'dynamics', 'octaves'],
          Arrangement: ['arrangement', 'presets'],
          Synthesizer: ['amplifier', 'filter', 'lfo', 'delay', 'reverb'],
          User:['login','presets', 'songs']
        },
        bpm_slider_value: fiddlehead.bpm,
      },
      methods: {
        modeSelect(selection) {
          this.mode = selection;
          this.view = this.views[selection][0]
          fiddlehead.log.push('mode changed')
          return this.view
        },
        toggleNote(note, beat) {
          //get note data,
          //toggle active state for cell
          //update note data for cell
          let beat_obj = this.fiddlehead.getCurrentSequenceData().beats[beat-1]
          if (beat_obj.note === note) {
            beat_obj.mute = !beat_obj.mute
          }
          else {
            beat_obj.mute = false;
            beat_obj.note = note;
          }
          fiddlehead.log.push('beat ${beat + 1} set')
          console.log(beat_obj)
        },
        getSeqBeatValue(beat_index, key) {
          console.log(this.fiddlehead.getCurrentSequenceData().beats[beat_index][key])
          return this.fiddlehead.getCurrentSequenceData().beats[beat_index][key];
        },
        currSeqMuteQuery(note, beat) {
          let bt_data = this.fiddlehead.getCurrentSequenceData().beats[beat-1]
          if (!bt_data.mute) {
            if (note === bt_data.note){
              return true;
            }
          }
        },
        arrangementQuery(meas, seq) {
          //because not updating correctly
          return this.arrangement[meas-1]===seq-1
        },
        currSeqBeatData(beat_ind){
          let bt_data = this.fiddlehead.getCurrentSequenceData().beats[beat_ind]
          return bt_data
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
        updateArrangement(measure, seq_i) {
          console.log(this.arrangement)
          this.fiddlehead.setMeasureReference(measure, seq_i)
          this.arrangement = fiddlehead.arrangement;
          return this.arrangement;
        }
      },
      computed:{
        volume: {
          get: function (){
            let vol = this.fiddlehead.synth.volume.volume.value;
          console.log(vol)
            return Math.round(vol+6, 1)
        },
        set: function (newValue) {
          this.fiddlehead.synth.volume.volume.value = newValue - 6;
          fiddlehead.log.push('volume changed')

          return newValue;
          }
        },
        currentMeasureLength: {
          get: function() {
            return this.fiddlehead.getCurrentSequenceData().beats.length
          },
          set: function(newValue) {
            console.log(newValue)
            this.fiddlehead.setCurrentMeasureLength(newValue)
          },
        },
        song_state: function() {
          return this.playing? 'playing':'stopped'
        },
        env_time_array: function() {
          return linearRange(0.1, 1, 10);
        },
        play_pause_icon: function () {
          return this.playing? '❙❙':'■';
        },
        currentArrangementLength: {
          get: function () {
            console.log(this.fiddlehead.sequences.length)
            return this.fiddlehead.sequences.length
          },
          set: function (newValue) {
            this.fiddlehead.setArrangementLength(newValue)
          }
        },
        oscillator_type: {
          get: function (){
            let type = this.fiddlehead.synth.oscillator.type;
            return type
        },
        set: function (newValue) {
          this.fiddlehead.synth.oscillator.type = newValue;
          return newValue;
          }
        },
        arrangement: {
          get: function () {
            console.log(this.fiddlehead.arrangement)
            return this.fiddlehead.arrangement
          },
          set: function (newValue) {
            console.log(this.fiddlehead.arrangement)

            this.fiddlehead.arrangement = newValue;
          }
        },
        bpm: {
          get: function () {
          Tone.Transport.bpm = this.fiddlehead.bpm;
          return this.fiddlehead.bpm
        },
        set: function(newValue) {
          this.fiddlehead.bpm = this.bpm_slider_value
          Tone.Transport.bpm = this.fiddlehead.bpm;
          return this.fiddlehead.bpm
        }
      },
      message: function () {
          //status messages
            return this.fiddlehead.log[fiddlehead.log.length-1]
        }
      }

  })
}
