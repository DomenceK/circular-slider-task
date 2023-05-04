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
        this._sliderNode = Slider.createSliderNode(this._options)
        this._knobNode = this._sliderNode.querySelector("#slider-knob")
    }

    draw() {
        this.container.appendChild(this._sliderNode)
    }

    /**
     * A static method that creates new slider node.
     * @static
     * @param {object} options - An object containing options data.
     * @returns {object} New slider node.
     */
    static createSliderNode(options) {
        const { radius, color } = options

        /**
         * @param {number} offset - Default 10px
         * @param {number} strokeWidth - Width of stripe circle border, defaults to 20px
         */
        const offset = 10
        const strokeWidth = 20

        /* Full circle width with default stroke width and offset */
        const containerDimensions = radius * 2 + strokeWidth + offset

        const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svgContainer.classList.add("svg-container")
        svgContainer.setAttribute("width", `${containerDimensions}px`)
        svgContainer.setAttribute("height", `${containerDimensions}px`)

        /* Center dimension. Used for cx and cy attribute */
        const dimensions2 = containerDimensions / 2

        const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        circleElement.classList.add("svg-border-track")
        circleElement.setAttribute("cx", `${dimensions2}px`)
        circleElement.setAttribute("cy", `${dimensions2}px`)
        circleElement.setAttribute("r", `${radius}px`)

        const progressElement = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        progressElement.classList.add("svg-progress-indicator")
        progressElement.setAttribute("cx", `${dimensions2}px`)
        progressElement.setAttribute("cy", `${dimensions2}px`)
        progressElement.setAttribute("r", `${radius}px`)
        progressElement.setAttribute("stroke-linecap", "butt")
        progressElement.setAttribute("stroke", color)

        /* Setting up stroke-dasharray requires calculating circle circumfence   */
        progressElement.setAttribute("stroke-dasharray", `0 ${Slider.getCircumfence(radius)}px`)

        const emptyCircleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        emptyCircleElement.classList.add("svg-inner-circle-empty")
        emptyCircleElement.setAttribute("cx", `${dimensions2}px`)
        emptyCircleElement.setAttribute("cy", `${dimensions2}px`)
        emptyCircleElement.setAttribute("r", `${radius}px`)

        const knobElement = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        knobElement.classList.add("svg-knob")

        /* Setting default knob position. Full container width minus half stroke width minus half offset */
        knobElement.setAttribute("cx", `${containerDimensions - strokeWidth / 2 - offset / 2}px`)
        knobElement.setAttribute("cy", `${containerDimensions / 2}px`)

        /* Painting elements on main svg container. Knob needs to be on top, so it must be painted last */
        svgContainer.appendChild(circleElement)
        svgContainer.appendChild(progressElement)
        svgContainer.appendChild(emptyCircleElement)
        svgContainer.appendChild(knobElement)

        return svgContainer
    }

    /**
     * A static method that calculates circle circumfence.
     * @static
     * @param {number} radius - The circle radius.
     * @returns {number} Circumfence.
     */
    static getCircumfence(radius) {
        return 2 * Math.PI * radius
    }
}
