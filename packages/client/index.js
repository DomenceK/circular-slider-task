import CircularSlider from "@circular-slider-task/circular-slider"

const container = document.getElementById("slider-container")

const transport = CircularSlider.create({ container, color: "#6c4e81", min: 0, max: 1000, step: 1, radius: 210 })
const transportContainer = document.getElementById("transport")

transport.subscribe("valueChanged", (newValue) => {
    transportContainer.children[0].innerText = newValue
})

const food = CircularSlider.create({ container, color: "#0477bf", min: 0, max: 1000, step: 1, radius: 170 })
const foodContainer = document.getElementById("food")

food.subscribe("valueChanged", (newValue) => {
    foodContainer.children[0].innerText = newValue
})

const insurance = CircularSlider.create({ container, color: "#7dad2a", min: 0, max: 1000, step: 1, radius: 130 })
const insuranceContainer = document.getElementById("insurance")

insurance.subscribe("valueChanged", (newValue) => {
    insuranceContainer.children[0].innerText = newValue
})

const entertainment = CircularSlider.create({ container, color: "#f08d2a", min: 0, max: 1000, step: 1, radius: 90 })
const entertainmentContainer = document.getElementById("entertainment")

entertainment.subscribe("valueChanged", (newValue) => {
    entertainmentContainer.children[0].innerText = newValue
})

const health_care = CircularSlider.create({ container, color: "#f05746", min: 0, max: 1000, step: 1, radius: 50 })
const healthCareContainer = document.getElementById("health_care")

health_care.subscribe("valueChanged", (newValue) => {
    healthCareContainer.children[0].innerText = newValue
})
