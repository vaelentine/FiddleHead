let sequencer = Vue.component('sequencer', {
  template:
  `<div class="sequencer_div">
    <div class="sequence_settings">
      <div class="range_container">
        <input class="beats" type="range" min="1" :max="max_beats" step="1" v-model.number="beatsPerMeasure"/>
        <div class="info_text">beats: {{ beatsPerMeasure }}</div>
      </div>
      <div class="range_container">
        <input class="root_note" type="range" min="1" :max="rootNoteOptions.length" step="1" v-model.number="rootNoteIndex"/>
        <div class="info_text">root: {{rootNoteOptions[rootNoteIndex]}}</div>
      </div>
      <div class="range_container">
        <input class="scale_type" type="range" min="1" :max="scaleTypes.length" step="1" v-model.number="scaleTypeIndex"/>
        <div class="info_text">scale: {{scaleTypes[scaleTypeIndex]}}</div>
      </div>
    </div>
    <div class="leds_container">
      <div v-for="beat of beatsPerMeasure" :beat_number="beat" class="each_led_container">
        <led :beat_number="beat" :active="beat==currentBeat" />
        <div>{{beat}}</div>
      </div>
    </div>
    <div class="matrix_div" >
      <div v-for="beat of beatsPerMeasure" class="beat_container" :beat="beat">
        <div v-for="note in notesOfScale" div class="cell" :note_name="note" :beat_number="beat" value="False">{{note}}</div>
      </div>
    </div>
  </div>`,
  data() {
    return {
      max_beats: fh_data.maxBeatsPerMeasure,
      beatsPerMeasure: fh_data.beatsPerMeasure,
      currentBeat: fh_data.beat,
      rootNoteOptions:fh_data.notes,
      rootNoteIndex: fh_data.rootNoteIndex,
      scaleTypes: fh_data.scales,
      scaleTypeIndex: fh_data.selectedScaleIndex,
      notesOfScale: fh_data.notes,
      sequence:[],
    }
  },
})
