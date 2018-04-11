Vue.component('cell', {
  props: ['active', 'text', 'click'],
  template: `<div class="cell" :class="{on:active}" v-on:click="click" {{ text }}</div>`,
  data() {
    return {
    }
  }
})
