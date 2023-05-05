import "../styles/index.css"

/**
 * Slider - A class that represents slider instance.
 */
export class Slider {
    /**
     * An private object containing options data.
     * @private
     * @type {object}
     */
    _options

    /**
     * The main slider node.
     * @private
     * @type {object}
     */
    _sliderNode

    /**
     * The knob node.
     * @private
     * @type {object}
     */
    _knobNode

    /**
     * The progress indicator node.
     * @private
     * @type {object}
     */
    _progressIndicatorNode

    /**
     * Getter for accessing the "container" property from the options object
     * @private
     * @type {object}
     */
    get container() {
        return this._options.container
    }

    /**
     * Getter for accessing the "radius" property from the options object
     * @private
     * @type {number}
     */
    get radius() {
        return this._options.radius
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
        this._knobNode = this._sliderNode.querySelector(".svg-knob")
        this._progressIndicatorNode = this._sliderNode.querySelector(".svg-progress-indicator")

        /* Storing a reference to the event listeners functions */
        this._handleMoveEvent = this._handleMoveEvent.bind(this)
        this._attachMovingListeners = this._attachMovingListeners.bind(this)
        this._removeMovingListeners = this._removeMovingListeners.bind(this)

        /* Draw elements to container */
        this._draw()
    }

    /**
     * Appends slider to a container and attach events listeners.
     * @private
     */
    _draw() {
        this.container.appendChild(this._sliderNode)
        this._attachEventListeners()
    }

    /**
     * Attaches event listener to knob node.
     * @private
     */
    _attachEventListeners() {
        this._knobNode.addEventListener("mousedown", this._attachMovingListeners)
        this._knobNode.addEventListener("touchstart", this._attachMovingListeners, {
            passive: true,
        })
    }

    /**
     * Attaches moving event listener to document.
     * @private
     */
    _attachMovingListeners() {
        document.addEventListener("mousemove", this._handleMoveEvent)
        document.addEventListener("touchmove", this._handleMoveEvent, {
            passive: true,
        })

        document.addEventListener("mouseup", this._removeMovingListeners)
        document.addEventListener("touchend", this._removeMovingListeners, {
            passive: true,
        })
    }

    /**
     * Removes moving event listener from a document.
     * @private
     */
    _removeMovingListeners() {
        document.removeEventListener("mousemove", this._handleMoveEvent)
        document.removeEventListener("touchmove", this._handleMoveEvent)

        document.removeEventListener("mouseup", this._removeMovingListeners)
        document.removeEventListener("touchmove", this._removeMovingListeners)
    }

    /**
     * Handles move event when it is triggered
     * Calculates new knob position and slider progress
     * @param {Event} event - Mouse / touch event.
     * @private
     */
    _handleMoveEvent(event) {
        const rect = this._sliderNode.getBoundingClientRect()

        /* get X and Y coordinates of the center of the circle relative to document */
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        /* get X and Y coordinates of the mouse position relative to the center of the circle. */
        const relativeX = event.clientX - centerX
        const relativeY = event.clientY - centerY

        /* calculates the angle in radians between two points (circle center point and mouse position) */
        const radians = Math.atan2(relativeY, relativeX)

        /**
         * calculating degrees from radians
         * the + 90 is added to make sure that 0 degrees starts at the top of the circle with X = 0
         */
        let degrees = radians * (180 / Math.PI) + 90
        degrees += degrees < 0 ? 360 : 0

        /* get X and Y coordinates of the center of the circle relative to circle */
        const cx = rect.width / 2
        const cy = rect.height / 2

        const position = Slider.calculatePosition(cx, cy, this.radius, degrees)

        /* set new knob position */
        this._knobNode.setAttribute("cx", position.x)
        this._knobNode.setAttribute("cy", position.y)

        const circleCircumfence = Slider.getCircumfence(this.radius)
        const progressStrokeDasharrayValue = Slider.getProgressStrokeDasharray(degrees, circleCircumfence)

        /* set stroke-dasharray defining pattern to paint progress indicator overlay */
        this._progressIndicatorNode.setAttribute("stroke-dasharray", `${progressStrokeDasharrayValue} ${circleCircumfence}`)
    }

    /**
     * A static method that creates new slider node.
     * @static
     * @param {number} cx - Attribute used to define the X coordinate of the center of a circle
     * @param {number} cy - Attribute used to define the Y coordinate of the center of a circle
     * @param {number} r - The circle radius.
     * @param {number} degrees - The mouse degrees from circle center.
     * @returns {object} - Returns the X and Y coordinate of a point on the circle given its angle in degrees.
     */
    static calculatePosition(cx, cy, r, degrees) {
        const x = cx + r * Math.cos((degrees * Math.PI) / 180)
        const y = cy + r * Math.sin((degrees * Math.PI) / 180)
        return { x, y }
    }

    /**
     * A static method that creates new slider node.
     * @static
     * @param {object} options - An object containing options data.
     * @returns {object} - New slider node.
     */
    static createSliderNode(options) {
        const { radius, color } = options

        /**
         * @param {number} offset - Default to 10px
         * @param {number} strokeWidth - Width of circle stripe border, defaults to 20px
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

        /* Setting up stroke-dasharray requires calculating circle circumfence */
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

    /**
     * A static method that calculates stroke dasharray used for showing progress of circle.
     * @static
     * @param {number} degrees - The circle radius.
     * @param {number} circumfence - The circle circumfence.
     * @returns {number} - Stroke dasharray length.
     */
    static getProgressStrokeDasharray(degrees, circumfence) {
        return (degrees * circumfence) / 360
    }
}
