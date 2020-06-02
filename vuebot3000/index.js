const { ref, computed, effect, reactive } = require("@next-vue/reactivity");
const { h, render, nodeOps, onMounted } = require("@next-vue/runtime-test");
const { Button, Servo, Potentiometer } = require("./components");
const { Eyes } = require("./eyes");

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

    return () =>
      h("app", [
        h(Eyes, { alignment: brain.alignment }),
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
