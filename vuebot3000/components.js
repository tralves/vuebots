const { effect } = require("@next-vue/reactivity");
const five = require("johnny-five");

const Led = {
  setup(props) {
    const led = new five.Led(props.pin);

    effect(() => (props.on ? led.on() : led.off()));
    effect(() => (props.blink ? led.blink(props.blink) : ""));

    return () => {};
  },
};

const RgbLed = {
  setup(props) {
    console.log("RgbLed setup");
    const led = new five.Led.RGB({ pins: props.pins, isAnode: true });
    led.on();
    led.color("ffffff");

    // effect(() => (props.on ? led.on() : led.off()));
    // effect(() => led.color(props.color));
    // effect(() => led.intensity(props.intensity));

    console.log({ props });

    return { blink: (...args) => led.blink(...args), stop: () => led.stop() };
  },
  render() {},
};

const Button = {
  setup(props, { emit }) {
    const button = new five.Button(props.pin);
    const eventNames = ["up", "down", "hold"];

    eventNames.forEach((eventName) => {
      button.on(eventName, () => {
        console.log("button: " + eventName);
        emit(eventName);
        emit("change", eventName);
      });
    });
    return () => {};
  },
};

const Servo = {
  setup(props) {
    console.log("Servo setup");
    const servo = new five.Servo(props.pin);

    effect(() => {
      console.log("move to: " + props.to);
      servo.to(props.to);
    });

    return {};
  },
  render() {},
};

const Potentiometer = {
  setup(props, { emit }) {
    const sensor = new five.Sensor({
      pin: props.pin,
      freq: 200,
      threshold: 10,
    });
    sensor.on("change", () => {
      emit("change", sensor.value);
    });
    return {};
  },
  render() {},
};

const LightSensor = {
  setup(props, { emit }) {
    const sensor = new five.Light({
      pin: props.pin,
      freq: 200,
      threshold: 10,
    });
    sensor.on("change", () => {
      emit("change", sensor.level);
    });
    return {};
  },
  render() {},
};

console.log("export components");

module.exports = { Led, RgbLed, Button, Servo, Potentiometer, LightSensor };
