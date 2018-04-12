Vue.component('slider', {
  props: ['min', 'max', 'value', 'step', 'display', 'name'],
  template:
    `<div class="slider_container">
      <input class="slider"
        type="range"
        v-model.number="value"
          :min="min" :max="max" :step="step" :value="value"/>
          <input class="num_display" v-model.number="bpm" type="text" :value="value"   />
      </div>`,
  data() {
    return {
      value: value
    }
  }
})
