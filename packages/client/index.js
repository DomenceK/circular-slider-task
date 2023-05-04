import CircularSlider from "@circular-slider-task/circular-slider"

const container = document.getElementById("container")

const circularSlider = CircularSlider.create({ container, color: "#ffffff", min: 0, max: 10, step: 1, radius: 50 })
circularSlider.draw()

console.log(circularSlider)
