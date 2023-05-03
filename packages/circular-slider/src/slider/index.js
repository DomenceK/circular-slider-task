/**
 * Slider - A class that represents slider instance and logic.
 */
export class Slider {
    _options

    /**
     * Creates a new Slider object.
     * @param {object} options - An object containing options data.
     * @param {object} userData.container - The container of the slider.
     * @param {string} userData.color - The foreground color of the slider.
     * @param {number} userData.radius - The slider circle radius.
     * @param {number} userData.step - The step value of slider.
     * @param {number} userData.min - The min value of slider.
     * @param {number} userData.max - The max value of slider.
     */
    constructor(options) {
        this._options = options
    }
}
