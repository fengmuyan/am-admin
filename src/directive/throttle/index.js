import Vue from 'vue';
const throttle = Vue.directive('throttle',
  {
    inserted: function (el, binding) {
      let timer;
      el.addEventListener('click', () => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          binding.value();
        }, 1000)
      })
    }
  }
)

export default throttle