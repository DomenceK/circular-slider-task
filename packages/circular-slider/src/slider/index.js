import "../styles/index.css"
import { DrawQueue } from "../draw-queue"
import { DEFAULT_CIRCLE_OFFSET, DEFAULT_STROKE_WIDTH } from "../defaults"

/**
 * Slider - A class that represents slider instance.
 */
export class Slider {
    /**
     * A static property for drawing queue. Every instance of this class shares same DrawQueue.
     * @static
     * @type {DrawQueue}
     */
    static drawQueue = new DrawQueue()

    /**
     * An private object that holds a set of listener functions.
     * @private
     * @type {Set}
     */
    _listeners = new Set()

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
     * The circle track node that allow tap the spot on a slider.
     * @private
     * @type {object}
     */
    _circleTrackTapNode

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
        this._circleTrackTapNode = this._sliderNode.querySelector(".svg-track-tap-overlay")

        /* Storing a reference to the event listeners functions */
        this._handleEvent = this._handleEvent.bind(this)
        this._attachMovingListeners = this._attachMovingListeners.bind(this)
        this._removeMovingListeners = this._removeMovingListeners.bind(this)

        /* Draw elements to container */
        this._draw()
    }

    /**
     * Subscribe to an event - adds new listener, restrict only to "valueChanged" event.
     * @param {string} eventName - Event name.
     * @param {string} listener - Listener function.
     */
    subscribe(eventName, listener) {
        if (eventName === "valueChanged") {
            this._listeners.add(listener)
        }
    }

    /**
     * Unsubscribe from event - removes listener.
     * @param {string} eventName - Event name.
     * @param {string} listener - Listener function.
     */
    unsubscribe(eventName, listener) {
        if (eventName === "valueChanged") {
            this._listeners.delete(listener)
        }
    }

    /**
     * Triggers specific event and notify listeners.
     * @param {string} eventName - Event name.
     * @param {number} data - Data sent to listeners.
     */
    triggerEvent(eventName, data) {
        if (eventName === "valueChanged") {
            this._listeners.forEach((listener) => listener(data))
        }
    }

    /**
     * Triggers drawing and attach events listeners.
     * @private
     */
    _draw() {
        Slider.drawQueue.draw(this._options, this._sliderNode)
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
        this._circleTrackTapNode.addEventListener("click", this._handleEvent)
    }

    /**
     * Attaches moving event listener to document.
     * @private
     */
    _attachMovingListeners() {
        document.addEventListener("mousemove", this._handleEvent)
        document.addEventListener("touchmove", this._handleEvent, {
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
        document.removeEventListener("mousemove", this._handleEvent)
        document.removeEventListener("touchmove", this._handleEvent)

        document.removeEventListener("mouseup", this._removeMovingListeners)
        document.removeEventListener("touchmove", this._removeMovingListeners)
    }

    /**
     * Handles move event when it is triggered.
     * Calculates new knob position and slider progress.
     * @param {Event} event - Mouse / touch event.
     * @private
     */
    _handleEvent(event) {
        const rect = this._sliderNode.getBoundingClientRect()

        // get X and Y coordinates of the center of the circle relative to document.
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Get X and Y coordinate of touch point relative to the viewport.
        const clientX = event.type === "touchmove" ? event.touches[0].clientX : event.clientX
        const clientY = event.type === "touchmove" ? event.touches[0].clientY : event.clientY

        // get X and Y coordinates of the mouse position relative to the center of the circle.
        const relativeX = clientX - centerX
        const relativeY = clientY - centerY

        // calculates the angle in radians between two points (circle center point and mouse position).
        const radians = Math.atan2(relativeY, relativeX)

        /**
         * calculating degrees from radians
         * the + 90 is added to make sure that 0 degrees starts at the top of the circle with X = 0
         */
        let degrees = radians * (180 / Math.PI) + 90
        degrees += degrees < 0 ? 360 : 0

        // get X and Y coordinates of the center of the circle relative to circle
        const cx = rect.width / 2
        const cy = rect.height / 2

        const { radius, min, max, step } = this._options

        const position = Slider.calculatePosition(cx, cy, radius, degrees)

        // set new knob position
        this._knobNode.setAttribute("cx", position.x)
        this._knobNode.setAttribute("cy", position.y)

        const circleCircumfence = Slider.getCircumfence(radius)
        const progressStrokeDasharrayValue = Slider.getProgressStrokeDasharray(degrees, circleCircumfence)

        // set stroke-dasharray defining pattern to paint progress indicator overlay
        this._progressIndicatorNode.setAttribute("stroke-dasharray", `${progressStrokeDasharrayValue} ${circleCircumfence}`)

        const newValue = Slider.calculateValue(degrees, max, min, step)
        // Trigger "propertyChanged" event and send new value to all listeners
        this.triggerEvent("valueChanged", newValue)
    }

    /**
     * A static helper method that calculates current slider value.
     * @static
     * @param {number} degrees - The new knob degrees from circle center.
     * @param {number} max - Maximum slider value.
     * @param {number} min - Minimum slider value.
     * @param {number} step - Step between minimum and maximum.
     * @returns {number} - Returns current step slider value.
     */
    static calculateValue(degrees, max, min, step) {
        const valueRange = max - min // Gets range between min and max.
        let currentValue = min + (degrees / 360) * valueRange // Current value based on degrees.

        // Calculates step value. At currentValue % step > .5 we return next pregress step.
        let stepValue = Math.round(currentValue / step) * step

        return stepValue
    }

    /**
     * A static method that creates new slider node.
     * @static
     * @param {number} cx - Attribute used to define the X coordinate of the center of a circle.
     * @param {number} cy - Attribute used to define the Y coordinate of the center of a circle.
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

        // Full circle width with default stroke width and offset.
        const containerDimensions = radius * 2 + DEFAULT_STROKE_WIDTH + DEFAULT_CIRCLE_OFFSET

        const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svgContainer.classList.add("svg-container")
        svgContainer.setAttribute("width", `${containerDimensions}px`)
        svgContainer.setAttribute("height", `${containerDimensions}px`)

        // Halved dimension for cx and cy attribute.
        const halvedDimension = containerDimensions / 2

        const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        circleElement.classList.add("svg-border-track")
        circleElement.setAttribute("cx", `${halvedDimension}px`)
        circleElement.setAttribute("cy", `${halvedDimension}px`)
        circleElement.setAttribute("r", `${radius}px`)

        const progressElement = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        progressElement.classList.add("svg-progress-indicator")
        progressElement.setAttribute("cx", `${halvedDimension}px`)
        progressElement.setAttribute("cy", `${halvedDimension}px`)
        progressElement.setAttribute("r", `${radius}px`)
        progressElement.setAttribute("stroke-linecap", "butt")
        progressElement.setAttribute("stroke", color)

        // Setting up stroke-dasharray requires calculating circle circumfence.
        progressElement.setAttribute("stroke-dasharray", `0 ${Slider.getCircumfence(radius)}px`)

        // Track tap element allows "tap progress" on a slider.
        const trackTapElement = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        trackTapElement.classList.add("svg-track-tap-overlay")
        trackTapElement.setAttribute("cx", `${halvedDimension}px`)
        trackTapElement.setAttribute("cy", `${halvedDimension}px`)
        trackTapElement.setAttribute("r", `${radius}px`)

        const knobElement = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        knobElement.classList.add("svg-knob")

        // Setting default knob position. Full container width minus half stroke width minus half offset.
        knobElement.setAttribute("cx", `${containerDimensions - DEFAULT_STROKE_WIDTH / 2 - DEFAULT_CIRCLE_OFFSET / 2}px`)
        knobElement.setAttribute("cy", `${containerDimensions / 2}px`)

        // Painting elements on main svg container. Knob needs to be on top, so it must be painted last.
        svgContainer.appendChild(circleElement)
        svgContainer.appendChild(progressElement)
        svgContainer.appendChild(trackTapElement)
        svgContainer.appendChild(knobElement)

        return svgContainer
    }

    /**
     * A static helper method that calculates circle circumfence.
     * @static
     * @param {number} radius - The circle radius.
     * @returns {number} Circumfence.
     */
    static getCircumfence(radius) {
        return 2 * Math.PI * radius
    }

    /**
     * A static helper method that calculates stroke dasharray used for showing progress of circle.
     * @static
     * @param {number} degrees - The circle radius.
     * @param {number} circumfence - The circle circumfence.
     * @returns {number} - Stroke dasharray length.
     */
    static getProgressStrokeDasharray(degrees, circumfence) {
        return (degrees * circumfence) / 360
    }
}
