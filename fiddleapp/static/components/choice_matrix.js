const transport = Vue.component('choice_matrix', {
  props: ['view_name', 'x_range', 'y_range', 'on_decider', 'click_function'],
  template:
  `<div class="matrix_div">
    <div v-if="view==='view_name'" v-for="i of x_range" class="x_div" :i="i">
      <div class="cell" v-for="y in y_range" :class="{on:'on_decider'}" :y_name="y" :x_number="x" @click="click_function">{{ x }}
      </div>
    </div>
  </div>`,
  data() {
    return {
      fiddlehead: fiddlehead
    }
  }
})
