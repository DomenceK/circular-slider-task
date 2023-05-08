# Circular slider task

Reusable circular slider for selecting a value within a circle range.

## Get started

Here's a sample script that uses circular-slider:

```javascript
import CircularSlider from "@circular-slider-task/circular-slider"

const container = document.getElementById("container")

const slider = CircularSlider.create({ container, color: "#000000", min: 0, max: 12, step: 3, radius: 60 })

slider.subscribe("valueChanged", (value) => {
    console.log("New value:", value)
})
```

## Setup

1. `npm install` installs dependencies.
2. Run the `npm run bootstrap` script to run the project
3. Open [http://localhost:4173](http://localhost:4173) to view Circular slider in the browser.

### Development

1. `npm run bootstrap:dev` runs the app in the development mode.
2. Open [http://localhost:5173](http://localhost:5173) to view Circular slider in the browser.

<br>

## Circular-slider API

### Creating an instance

You can create a new instance of circular-slider with a custom options.

##### CircularSlider.create([options])

```javascript
const instance = CircularSlider.create({
    container,
    color: "#000000",
    min: 0,
    max: 12,
    step: 3,
    radius: 60,
})
```

### Options parameters

The available config parameters are listed below.

##### container - parent element in which slider will be drawn.

##### color - progress indicator color.

##### min - starting value of circle slider.

##### max - maximum value of circle slider.

##### step - step value between [min] and [max] value.

##### radius - circle radius size.

<br>

### Event subscribing

You can subscribe to a valueChanged event.

```javascript
instance.subscribe("valueChanged", (value) => {
    console.log("New value:", value)
})
```
