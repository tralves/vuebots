const { ref, computed, effect } = require("@next-vue/reactivity");

const five = require("johnny-five");
const board = new five.Board();

board.on("ready", function () {
  const led = new five.Led(2);

  const blink = ref(182);

  effect(() => led.blink(blink.value));

  const sensor = new five.Sensor({
    pin: "A0",
    freq: 200,
    threshold: 10,
  });

  sensor.on("change", () => {
    console.log("sensor: " + sensor.value);
    blink.value = sensor.value / 2 + 100;
  });
});
