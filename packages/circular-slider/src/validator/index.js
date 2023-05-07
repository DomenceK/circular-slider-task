const colorRx = /(^[a-zA-Z]+$)|(#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}|(?:rgba?|hsla?)\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s/]*[\d.]+%?\))/i

const handler = {
    /**
     * A trap handler for setting the value of a property.
     * @param {Object} target - The target object.
     * @param {string} key - The key of the property to set.
     * @param {*} value - The new value of the property.
     * @returns {boolean} true if the property was set successfully, error otherwise.
     */
    set(target, key, value) {
        if (!Object.prototype.hasOwnProperty.call(target, key)) {
            throw new Error(`Cannot set unknown property ${key}`)
        }

        switch (key) {
            case "container":
                if (typeof value !== "object") {
                    throw new TypeError(`${key} must be an object`)
                }
                break
            case "color":
                if (typeof value !== "string") {
                    throw new TypeError(`${key} must be a string`)
                } else if (!colorRx.test(value)) {
                    throw new TypeError(`${key} not a valid color`)
                }
                break
            case "radius":
                if (typeof value !== "number") {
                    throw new TypeError(`${key} must be a number`)
                } else if (value < 1) {
                    throw new TypeError(`${key} must be larger than 0`)
                }
                break
            case "step":
            case "max":
            case "min":
                if (typeof value !== "number") {
                    throw new TypeError(`${key} must be a number`)
                }
                break
            default:
                throw new Error(`Cannot set unknown property ${key}`)
        }

        target[key] = value

        return true
    },

    /**
     * A trap for getting the value of a property.
     * @param {Object} target - The target object.
     * @param {string} key - The key of the property to get.
     * @param {Object} receiver - The Proxy object or a derived object.
     * @returns {*} The value of the property.
     */
    get(target, key) {
        if (!Object.prototype.hasOwnProperty.call(target, key)) {
            throw new Error(`Unknown property ${key}`)
        }

        return target[key]
    },
}

export function validate(target) {
    /**
     * A Proxy object that intercepts property access on the target object.
     * @param {Object} target - The object to be proxied.
     * @param {Object} handler - An object that defines the traps to be used for the Proxy object.
     * @returns {Object} A new Proxy object on success. On invalid object throws error.
     */
    const options = new Proxy(target, handler)

    options.container = target.container
    options.color = target.color
    options.min = target.min
    options.max = target.max
    options.step = target.step
    options.radius = target.radius

    return options
}
