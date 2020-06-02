const { ref, computed, effect, reactive } = require("@next-vue/reactivity");
const { h, render, nodeOps, onMounted } = require("@next-vue/runtime-test");
const {
  Button,
  Led,
  Servo,
  Potentiometer,
  LightSensor,
} = require("./components");

const five = require("johnny-five");
const board = new five.Board();

const root = nodeOps.createElement("div");

const App = {
  setup() {
    console.log("App setup");

    const brain = reactive({
      happiness: 90, // 0 - 100
      alignment: "good", // good - evil
    });

    effect(() => {
      console.log(
        "happiness: " + brain.happiness,
        " / align: " + brain.alignment
      );
    });

    const mouth = computed(() => {
      return brain.happiness + 40;
    });

    const { isBlinking } = useBlink();

    return () =>
      h("app", [
        // h(Led, { pin: 6, on: ledState.value, ref: led1 }),
        h(Led, { pin: 7, on: brain.alignment === "bad" && !isBlinking.value }),
        h(Led, { pin: 8, on: brain.alignment === "good" && !isBlinking.value }),
        h(Servo, {
          pin: 3,
          to: mouth.value,
        }),
        h(Potentiometer, {
          pin: "A0",
          onChange: (e) => (brain.happiness = (e * 100) / 1024),
        }),
        h(Button, {
          pin: 4,
          onUp: (e) =>
            (brain.alignment = brain.alignment === "good" ? "bad" : "good"),
        }),
      ]);
  },
};

board.on("ready", function () {
  render(h(App), root);
});

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
