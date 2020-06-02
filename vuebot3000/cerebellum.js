const { ref } = require("@next-vue/reactivity");
const { onMounted } = require("@next-vue/runtime-test");

const five = require("johnny-five");

function useBlink() {
  const isBlinking = ref(false);

  const lightSensor = new five.Light({
    pin: "A3",
    freq: 200,
    threshold: 10,
  });

  onMounted(() => {
    blink();
  });

  const blink = () => {
    isBlinking.value = true;
    setTimeout(() => (isBlinking.value = false), 200);
    const nextBlink = lightSensor.level * 5000;
    // console.log(lightSensor.level + " next blink: " + nextBlink);
    setTimeout(blink, nextBlink);
  };

  return { isBlinking };
}

module.exports = { useBlink };
