const transport = Vue.component('transport', {
  template:
  `<div class="bt_cont">
    <div class="slot">
      <div class="tr_bt inline" id="prev_bt" v-on:click=fiddlehead.seekPrevious()> ◅◅ </div>
      <div class="tr_bt inline" id="play_pause_bt" v-on:click=fiddlehead.playPause()> {{ play_pause_icon }} </div>
      <div class="tr_bt inline" id="next_bt" v-on:click=fiddlehead.seekNext()> ▻▻ </div>
    </div>
  </div>`,
  data() {
    return {
      fiddlehead: fiddlehead
    }
  },
  computed: {
    play_pause_icon: function () {
      return this.fiddlehead.playing? '❙❙':'►';
    }
  }
})
