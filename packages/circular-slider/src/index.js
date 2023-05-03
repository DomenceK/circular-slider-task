import { validate } from "./validator"
import { Slider } from "./slider"

/**
 * CircularSlider - A class that exposes use of Circular Slider.
 */
export class CircularSlider {
    /**
     * create - A static method that validates and creates Slider object.
     *
     * @param {Object} _options - An object containing options for the CircularSlider.
     * @returns {Slider} Returns new instance of Slider.
     */
    static create(_options) {
        const options = validate(_options)
        return new Slider(options)
    }
}
