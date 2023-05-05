import CircularSlider from "@circular-slider-task/circular-slider"

const container = document.getElementById("container")

const circularSlider = CircularSlider.create({ container, color: "#000000", min: 0, max: 10, step: 1, radius: 50 })

const circularSlider2 = CircularSlider.create({ container, color: "#000000", min: 0, max: 10, step: 1, radius: 100 })

console.log(circularSlider, circularSlider2)
