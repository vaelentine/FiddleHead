window.onload = function () {
//parent component
  const vm = new Vue({
      el: '#app',
      components: {
      },
      template:
      `<div class="fiddlehead_div">



        <div class="transport_module_div">
          <div class="digital_display_div inset">
            <div class="song_header">
              <div class="inline" id="song_name"> {{ songName }}</div>
              <div> </div>
              <div class="inline" id="song_pos">{{ measureNumber }}:{{ currentBeat }}</div>
              <div class="inline"> / </div>
              <div class="inline" id="song_end"> {{measuresPerSong}} </div>
              <div> </div>
              <div class="inline" id="seq_name">sequence name</div>
              <div class="inline" id="seq_number"> sequence number </div>
              <div class="inline"> / </div>
              <div class="inline" id="seq_total"> last sequence </div>
            </div>
            <div class="arrangement_cont">
              <div class="timeline">
                <div class="progress">
                  <div class="seq_disp"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="sequence_settings">
            <div class="range_container">
              <input class="beats" type="range" min="1" :max="maxBeatsAllowed" step="1" v-model.number="beatsPerMeasure" @change="createNotes"/>
              <div class="info_text">beats: {{ beatsPerMeasure }}</div>
            </div>
            <div class="range_container">
              <input class="bpm_sl" type="range" :min="bpmMin" :max="bpmMax" step="1" v-model.number="bpm"/>
              <div class="info_text"> bpm: {{ bpm }}</div>
            </div>
          </div>
          <div class="seq_led_div">
            <div class="leds_container">
              <div v-for="beat of beatsPerMeasure" :beat_number="beat + 1" class="each_led_container">
                <led :beat_number="beat + 1" :active="beat==currentBeat" />
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
        <div class="sequencer_div">
          <div class="beat_prop_select">
            <div v-for="selected in matrices"
              class="matrix select"  @click="matrix=selected" :class="{active:matrix===selected}">{{selected}}</div>
          </div>


          <div class="matrix_div" >
            <div v-for="beat of beatsPerMeasure" v-if="matrix==='notes'" :key="beat.id" class="beat_container" :beat="beat + 1">
              <div
                class="cell"
                v-for="note in notes"
                :class="{on:mutequery(note, beat)}"
                :key="note.id"
                :note_name="note"
                :beat_number="beat + 1"
                @click="toggleNote(beat, note)"
                >{{note}}</div>
            </div>

            <div v-for="n of beatsPerMeasure"   v-if="matrix==='octave'"
            :key="n.id" class="beat_container" :beat="n + 1">
              <div
                class="cell"
                v-for="octave in octaves"
                :class="{on:octQuery(n-1, octave)}"
                :beat_number="n + 1"
                @click="sequence[n-1].octave=octave"
                >{{octave}}</div>
            </div>

            <div v-for="n of beatsPerMeasure"   v-if="matrix==='velocity'"
            :key="n.id" class="beat_container" :beat="n + 1">
              <div
                class="cell"
                v-for="vel in velocities"
                :class="{on:sequence[n-1].velocity===vel}"
                :beat_number="n + 1"
                @click="sequence[n-1].velocity=vel"
                >{{vel}}</div>
            </div>

            <div v-for="n of beatsPerMeasure"   v-if="matrix==='env amount'"
            :key="n.id" class="beat_container" :beat="n + 1">
              <div
                class="cell"
                v-for="env in velocities"
                :class="{on:sequence[n-1].envelopeAmount===env}"
                :beat_number="n + 1"
                @click="sequence[n-1].envelopeAmount=env"
                >{{env}}</div>
            </div>

          </div>
          <div v-if="matrix==='synthesizer'" class="synth_container">
            <div v-for="(features, node) in synthSettings" class="node_container">
              <div>{{ node }}</div>
              <div v-for="(value, controller) of features" class="range_container">
                <div>{{ controller }}</div>
                <input type="range" :min="value.min" :max="value.max" :step="value.step" v-model.number="value.value" @change="updateSynth"/>
                <div>{{ value.value }}</div>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>`,
      data: {
        matrix: '',
        matrices: ['notes', 'octave', 'velocity', 'env amount', 'synthesizer'],
        bpmMax: 999,
        bpmMin: 60,
        maxBeatsAllowed: 16,
        songName: 'untitled',
        measuresPerSong: 1,
        beatsPerMeasure: 8,
        measureNumber: 1,
        bpm: 120,
        playing: false,
        currentBeat: 1,
        subdivision: 1,
        maxBeatsPerMeasure: 16,
        bpm: 150,
        arrangement:[],
        sequence:[],
        playing: false,
        sequenceName: 'sequence',
        rootNoteIndex: 3,
        scaleTypes: ['Chromatic', 'Major', 'Minor'],
        notes: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
        oscTypes: ['sine', 'triangle', 'square', 'sawtooth', 'pwm'],
        octaves: [0,1,2,3,4,5,6,7,8],
        velocities: [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
        scaleTypeIndex: 0,
        instrument: synth,
        currentBeatData: '',
        synthSettings: {
          Oscillator: {
            waveform: {
              types: ['sine', 'triangle', 'square', 'sawtooth', 'pwm'],
              min: 0,
              max: 4,
              step: 1,
              value: 0,
            },
          },
          amplifier: {
            Attack: {
              min: 0.01,
              max: 10,
              step: 0.5,
              value: 0.5,
            },
            Decay: {
              min: 0.01,
              max: 1,
              step: 0.1,
              value: 0.5,
            },
            Sustain: {
              min: 0.01,
              max: 1,
              step: 0.01,
              value: 0.5,
            },
            Release: {
              min: 0.01,
              max: 10,
              step: 0.5,
              value: 0.5,
            },
          },
          Filter: {
            Attack: {
              min: 0.01,
              max: 10,
              step: 0.5,
              value: 0.5,
            },
            Decay: {
              min: 0.01,
              max: 10,
              step: 0.5,
              value: 0.5,
            },
            Sustain: {
              min: 0.01,
              max: 1,
              step: 0.01,
              value: 0.5,
            },
            Release: {
              min: 0.01,
              max: 10,
              step: 0.5,
              value: 0.5,
            },
            // Distortion: {
            //   min: 0,
            //   max: 1,
            //   step: 0.1,
            //   value: 0,
            // },
            Frequency: {
              min: 60,
              max: 18000,
              step: 1,
              value: 1000,
            },
            Quality: {
              min: 0,
              max: 1,
              step: 0.1,
              value: 0,
            }
          },
          Delay: {
            pPDelTime: {
              min: 0.5,
              max: 10,
              step: 0.5,
              value: 1,
              exportTo: p_p_delay.delayTime.value
            },
            pPDelFdbk: {
              min: 0.5,
              max: 10,
              step: 0.5,
              value: 1,
              exportTo: p_p_delay.feedback.value
            },
            pPDelWet: {
              min: 0,
              max: 1,
              step: 0.1,
              value: 1,
              exportTo: p_p_delay.wet.value
            },
          },
          reverb: {
            verbSize: {
              min: 0,
              max: 1,
              step: 0.1,
              value: 0,
              exportTo: reverb.roomSize.value
            },
            verbWet: {
              min: 0,
              max: 1,
              step: 0.1,
              value: 0,
              exportTo: reverb.wet.value
            },
          },
        }
      },
      methods: {
        update_clock() {
          let vm = this;
          if (playing) {
            let timer = setTimeout( function () {
              vm.update_clock();
              vm.currentBeat += 1;
              if (vm.currentBeat > vm.beatsPerMeasure) {
                vm.measureNumber + 1;
                vm.currentBeat = 1;
                vm.measureNumber = vm.measureNumber % vm.measuresPerSong;
              }
              vm.currentBeatData = vm.sequence[vm.currentBeat - 1]
              if (vm.currentBeatData.on) {
                vm.playNote(vm.currentBeatData)
              }

            }, 60000/vm.bpm)
          }
        },
        play() {
          let vm = this;
          vm.currentBeat = 1;
          vm.measureNumber = 1;
          playing = true;
          vm.update_clock()
        },
        pause() {
          playing = false;
        },
        stop() {
          playing = false;
          currentBeat = 1;
        },
        seekPrev() {
          measureNumber -= measureNumber - 1 % vm.measuresPerSong;
        },
        seekNext() {
          measureNumber = measureNumber + 1 % vm.measuresPerSong;
        },
        createNotes() {
          let vm = this;
          let seq = vm.sequence;
          //popoff extra notes
          while (seq.length > vm.beatsPerMeasure - 1) {
            // console.log(seq)
            seq.pop();
          };
          //get notes for the length of the sequence or create a new note
          for (let i=0; i < vm.beatsPerMeasure; i++) {
            //does note exist?
            if (!seq[i]) {
              let silentnote= {
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
          // console.log(seq)
        },
        toggleNote(beat, note) {
          // console.log('toggle' + beat + note)
          //get note data,
          //toggle active state for cell
          //update note data for cell
          let vm = this;
          let seq = vm.sequence;
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
          let seq = vm.sequence;
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
          synth.volume.value = note_obj.velocity;
          synth.filterEnvelope.exponent = note_obj.envelopeAmount;
          synth.triggerAttackRelease(note_name, duration)
        },
        createBlankSequence() {
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
      // methods: {
          // synthSettings:
            // function (newvalue, Oldvalue) {
              // alert()
            // console.log(this.synthSettings.amplifier.Attack.value)

          // },
        // }
      // },
      mounted: function () {
        let vm = this;
        vm.createNotes();
      }
    })
}
