const transport = Vue.component('transport', {
  props: [ 'play()', 'currentBeat'],
  template:
  `<div class="transport_module_div">
    <div class="digital_display_div inset">
      <div class="song_header">
        <div class="inline" id="song_name"> {{ songName }}</div>
        <div> </div>
        <div class="inline" id="song_pos">{{ currentMeasure }}:{{ currentBeat }}</div>
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
    <div class="bt_cont">
      <div class="slot">
        <div class="tr_bt inline" id="prev_bt" v-on:click=seekPrev() > ◂◂ </div>
        <div class="tr_bt inline" id="play_bt" v-on:click=play()> ▶  </div>
        <div class="tr_bt inline" id="pause_bt" v-on:click=pause() > ❙❙ </div>
        <div class="tr_bt inline" id="stop_bt" v-on:click=stop() > ■ </div>
        <div class="tr_bt inline" id="next_bt" v-on:click=seekNext() > ▸▸ </div>
      </div>
    </div>
  </div>`,
  data() {
    return {
      measuresPerSong: fh_data.totalMeasures,
      beatsPerMeasure: fh_data.beatsPerMeasure,
      currentMeasure: fh_data.measure,
      bpm: fh_data.bpm,
      playing: fh_data.playing,
      songName: fh_data.songName,
    }
  },
  methods: {
    // update_clock() {
    //   let transport = this;
    //   if (playing) {
    //     let timer = setTimeout( function () {
    //       transport.update_clock();
    //       transport.currentBeat += 1;
    //       if (transport.currentBeat > transport.beatsPerMeasure) {
    //         console.log(transport.currentMeasure)
    //         transport.currentMeasure + 1;
    //         transport.currentBeat = 1;
    //         transport.currentMeasure = transport.currentMeasure % transport.measuresPerSong + 1
    //       }
    //     }, 60000/transport.bpm)
    //   }
    // },
    // play() {
    //   let transport = this;
    //   transport.currentBeat = 1;
    //   transport.currentMeasure = 1;
    //   playing = true;
    //   transport.update_clock()
    // },
    pause() {
      playing = false;
    },
    // stop() {
    //   playing = false;
    //   currentBeat = 1;
    // },
    seekPrev() {
      currentMeasure -= 1;
    },
    seekNext() {
      currentMeasure += 1;
    }
  },
})
