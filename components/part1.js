const { effect, reactive } = require("@next-vue/reactivity");
const { h, render, nodeOps, onMounted } = require("@next-vue/runtime-test");

const five = require("johnny-five");
const board = new five.Board();

const Led = {
  setup(props) {
    const led = new five.Led(props.pin);

    effect(() => (props.on ? led.on() : led.off()));

    return () => {};
  },
};

const Button = {
  setup(props, { emit }) {
    const button = new five.Button(props.pin);
    const eventNames = ["up", "down", "hold"];

    eventNames.forEach((eventName) => {
      button.on(eventName, () => {
        emit(eventName);
        emit("change", eventName);
      });
    });
    return () => {};
  },
};

const Bot = {
  setup() {
    console.log("App setup");

    const state = reactive({
      ledOn: false,
      button: "up",
    });

    effect(() => console.log(`button: ${state.button}, led: ${state.ledOn}`));

    effect(() => (state.ledOn = ["down", "hold"].includes(state.button)));

    onMounted(() => {
      // setInterval(() => (state.ledOn = !state.ledOn), 500);
    });

    return () =>
      h("app", [
        h(Led, { pin: 2, on: state.ledOn }),
        h(Button, {
          pin: 4,
          onChange: (e) => (state.button = e),
        }),
      ]);
  },
};

const root = nodeOps.createElement("bot");

board.on("ready", function () {
  render(h(Bot), root);
});
