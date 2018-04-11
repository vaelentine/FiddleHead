Vue.component('view_screen', {
  props: ['message',
    'mode_selected',
    'view_selected',
    'transport_state'
  ],
  template:
    `<div class="view_screen_div">
      <div class="digital_display_div inset">
        <div class="leds_container">
          <div v-for="beat of fiddlehead.getCurrentMeasureLength" :beat_number="beat" class="each_led_container">
            <led :beat_number="beat + 1" :active="beat==current_beat" />
          </div>
        </div>
        <div class="Info">
          <div> Message: {{ fiddlehead.message }} </div>
          <div id="song_name"> Song:{{ fiddlehead.title }}</div>
          <div id="seq_name">sequence: ({{ fiddlehead.measure }}/{{ fiddlehead.totalMeasures }})</div>
          <div>Preset: {{ fiddlehead.currentPreset }}</div>
          <div>Bpm: {{ fiddlehead.bpm }} </div>
          <div> Mode: {{ mode }}</div>
          <div> View: {{ view }} </div>
          <div> Transport state: {{ song_state }} </div>
        </div>
      </div>
    </div>`,
    data: function () {
      return {
        fiddlehead: fiddlehead
      }
    }
  })
