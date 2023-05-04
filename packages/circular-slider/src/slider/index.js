import "../styles/index.css"

/**
 * Slider - A class that represents slider instance.
 */
export class Slider {
    _options

    _sliderNode
    _knobNode

    get container() {
        return this._options.container
    }

    /**
     * Creates a new Slider object.
     * @param {object} options - An object containing options data.
     * @param {object} options.container - The container of the slider.
     * @param {string} options.color - The foreground color of the slider.
     * @param {number} options.radius - The slider circle radius.
     * @param {number} options.step - The step value of slider.
     * @param {number} options.min - The min value of slider.
     * @param {number} options.max - The max value of slider.
     */
    constructor(options) {
        this._options = options
        this._sliderNode = Slider.createSliderNode(this._options.radius)
        this._knobNode = this._sliderNode.querySelector("#slider-knob")
    }

    draw() {
        this.container.appendChild(this._sliderNode)
    }

    /**
     * A static method that creates new slider node.
     * @static
     * @param {number} radius - The circle radius.
     * @returns {object} New slider node.
     */
    static createSliderNode(radius) {
        const slider = document.createElement("div")
        slider.setAttribute("id", "slider")

        const dimension = `${radius * 2}px`
        slider.style.width = dimension
        slider.style.height = dimension

        const sliderKnob = document.createElement("div")
        sliderKnob.setAttribute("id", "slider-knob")
        sliderKnob.style.left = `${radius - 10}px`

        slider.appendChild(sliderKnob)

        return slider
    }
}
