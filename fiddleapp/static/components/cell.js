Vue.component('cell', {
  props: ['active'],
  template: `<div class="cell" :class="{on:active}"></div>`,
  data() {
    return {
    }
  }
})
