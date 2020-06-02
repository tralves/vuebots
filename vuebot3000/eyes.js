const { h } = require("@next-vue/runtime-test");
const { Led } = require("./components");
const { useBlink } = require("./cerebellum");

const Eyes = {
  setup(props) {
    console.log("Eyes setup");

    const { isBlinking } = useBlink();

    return () =>
      h("app", [
        h(Led, { pin: 7, on: props.alignment === "bad" && !isBlinking.value }),
        h(Led, { pin: 8, on: props.alignment === "good" && !isBlinking.value }),
      ]);
  },
};

module.exports = { Eyes };

// && !isBlinking.value
