Vue.component('led', {
  props: ['active'],
  template: `<div class="led" :class="{on:active}" ></div>`,
  data() {
    return {
    }
  }
})
