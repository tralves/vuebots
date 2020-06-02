const { ref, computed, effect } = require("@next-vue/reactivity");

const five = require("johnny-five");
const board = new five.Board();

board.on("ready", function () {
  const led = new five.Led(2);

  const buttonState = ref("up");

  const ledOn = computed(() => {
    return ["down", "hold"].includes(buttonState.value);
  });

  effect(() => (ledOn.value ? led.on() : led.off()));

  // setInterval(() => (ledOn.value = !ledOn.value), 500);

  const button = new five.Button(4);

  button.on("down", () => (buttonState.value = "down"));
  button.on("up", () => (buttonState.value = "up"));
  button.on("hold", () => (buttonState.value = "hold"));

  effect(() => console.log("button: " + buttonState.value));
});
