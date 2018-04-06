/* JS Single File component:
link from html as follows:
    {% load static %}
<script type="module" src="{% static "components/<component>.js" %}></script>

register component in vue instance components: { <component> }
html: <component></component>
*/

Vue.component('v-fader', {
  template: `<div class="range-slider">
        <input type="range" orient="vertical" min="0" max="100" />
        <div class="range-slider__bar"></div>
        <div class="range-slider__thumb"></div>
      </div>`,
  data() {
    return {
    }
  }
})

var v_fader = function() {

  function updateSlider(element) {
    if (element) {
      var parent = element.parentElement,
        lastValue = parent.getAttribute('data-slider-value');

      if (lastValue === element.value) {
        return; // No value change, no need to update then
      }

      parent.setAttribute('data-slider-value', element.value);
      var $thumb = parent.querySelector('.range-slider__thumb'),
        $bar = parent.querySelector('.range-slider__bar'),
        pct = element.value * ((parent.clientHeight - $thumb.clientHeight) / parent.clientHeight);

      $thumb.style.bottom = pct + '%';
      $bar.style.height = 'calc(' + pct + '% + ' + $thumb.clientHeight / 2 + 'px)';
      $thumb.textContent = element.value + '%';
    }
  }
  return {
    updateSlider: updateSlider
  };
}();

(function initAndSetupTheSliders() {
  var inputs = [].slice.call(document.querySelectorAll('.range-slider input'));
  inputs.forEach(function(input) {
    return input.setAttribute('value', '0');
  });
  inputs.forEach(function(input) {
    return v_fader.updateSlider(input);
  });
  // Cross-browser support where value changes instantly as you drag the handle, therefore two event types.
  inputs.forEach(function(input) {
    return input.addEventListener('input', function(element) {
      return v_fader.updateSlider(input);
    });
  });
  inputs.forEach(function(input) {
    return input.addEventListener('change', function(element) {
      return v_fader.updateSlider(input);
    });
  });
})();
