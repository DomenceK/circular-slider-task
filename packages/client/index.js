import CircularSlider from "@circular-slider-task/circular-slider"

const container = document.getElementById("container")

const circularSlider = CircularSlider.create({ container, color: "#000000", min: 0, max: 12, step: 3, radius: 60 })

circularSlider.subscribe("valueChanged", (newValue) => {
    console.log("circularSlider Property value changed:", newValue)
})

const circularSlider2 = CircularSlider.create({ container, color: "#000000", min: -10, max: 10, step: 1, radius: 100 })

circularSlider2.subscribe("valueChanged", (newValue) => {
    console.log("circularSlider2 Property value changed:", newValue)
})

const circularSlider3 = CircularSlider.create({ container, color: "#000000", min: 0, max: 360, step: 1, radius: 200 })

circularSlider3.subscribe("valueChanged", (newValue) => {
    console.log("circularSlider3 Property value changed:", newValue)
})
