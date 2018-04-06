/* JS Single File component:
link from html as follows:
    {% load static %}
<script type="module" src="{% static "components/<component>.js" %}></script>

register component in vue instance components: { <component> }
html: <component></component>
*/

Vue.component('led', {
  props: ['active'],
  template: `<div class="led" :class="{on:active}" ></div>`,
  data() {
    return {
    }
  }
})
