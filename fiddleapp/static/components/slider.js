Vue.component('slider', {
  props: ['label', 'parameter', 'step', 'min', 'max'],
  template:
    `  <div class="synth_setting_container">
        <label> {{ label }}: {{ parameter }} </label>
        <input type="range" v-model:number="parameter" :min="0.01" :step="step" :max="2" style="width:500px">
      <input class="num_display" type="2text" :for="label" name="display" oninput="parameter=display.value" />
    </div>
    `,
  data: function () {
    return {
    }
  }
})
