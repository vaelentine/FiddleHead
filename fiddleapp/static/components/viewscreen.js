Vue.component('view_screen', {
  props: ['message',
    'song_name',
    'number_of_beats',
    'current_beat',
    'current_measure',
    'preset_name',
    'total_measures',
    'beats_per_minute',
    'play_time',
    'mode_selected',
    'view_selected',
    'transport_state'
  ],
  template:
    `<div class="view_screen_div">
      <div class="digital_display_div inset">
        <div class="leds_container">
          <div v-for="beat of number_of_beats" :beat_number="beat + 1" class="each_led_container">
            <led :beat_number="beat + 1" :active="beat==current_beat" />
          </div>
        </div>
        <div class="Info">
          <div> Message: {{ message }} </div>
          <div id="song_name"> Song:{{ song_name }}</div>
          <div id="seq_name">sequence: untitled ({{ current_measure }}/{{ 'total_measures' }})</div>
          <div>Preset: {{ preset_name }}</div>
          <div>Bpm: {{ beats_per_minute }} </div>
          <div> Mode: {{ mode_selected }}</div>
          <div> View: {{ view_selected }} </div>
          <div> Transport state: {{ transport_state }} </div>
        </div>
      </div>
    </div>`,
  data() {
    return {
    }
  }
})
// <view_screen
//   :message="message"
//   :song_name="song_name"
//   :number_of_beats="sequence.beatsPerMeasure"
//   :current_beat="currentBeat"
//   :current_measure="measureNumber"
//   :preset_name="none"
//   :total_measures="numberOfMeasures"
//   :beats_per_minute='transport.bpm'
//   :play_time="unknown"
//   :mode_selected="mode"
//   :view_selected="currentView"
//   :transport_state="song_state"
// />
