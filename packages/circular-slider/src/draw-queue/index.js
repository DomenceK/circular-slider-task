import { DEFAULT_CIRCLE_OFFSET, DEFAULT_STROKE_WIDTH } from "../defaults"

/**
 * DrawQueue - A helper class for drawing and enabling nodes to be aware of each other in a container.
 */
export class DrawQueue {
    /**
     * An private key-value object containing containers draw order.
     * @private
     * @type {Map}
     */
    _drawQueue = new Map()

    /**
     * Handles drawing of nodes to a specific container
     * @param {object} container - Container on which we draw nodes.
     * @param {object} node - The node element which will be appended to container.
     */
    draw(options, node) {
        const { container, radius } = options

        let sliderContainer = container.querySelector(".circular-slider-container")
        let containerId = container.getAttribute("circular-slider-id")

        if (!containerId) {
            containerId = DrawQueue.generateRandomId()
            // Assigning unique identifier to each new container.
            container.setAttribute("circular-slider-id", containerId)

            // Appending container node that help positioning all sliders in container.
            sliderContainer = DrawQueue.createCircularSliderContainerNode()
            container.appendChild(sliderContainer)
        }

        // Calculating slider dimension with circle and stroke offset.
        const sliderOffsetDimension = radius * 2 + DEFAULT_CIRCLE_OFFSET + DEFAULT_STROKE_WIDTH

        const data = this._drawQueue.get(containerId)
        // Check if container has no elements
        if (!data) {
            // Save first element slider radius
            this._drawQueue.set(containerId, [radius])

            // Set initial container dimensions and append to slider container
            DrawQueue.setContainerDimensions(sliderContainer, sliderOffsetDimension)
            sliderContainer.appendChild(node)
        } else {
            // Sort by radius size
            const radiusArr = data.concat(radius)
            radiusArr.sort((a, b) => b - a)

            // Set new ordered radius array
            this._drawQueue.set(containerId, radiusArr)

            const index = radiusArr.indexOf(radius)
            // Check if index is 0. Means circle has largest radius
            if (index === 0) {
                // Set new dimension to slider container
                DrawQueue.setContainerDimensions(sliderContainer, sliderOffsetDimension)
            }

            // Inserts new node to specific ordered index
            sliderContainer.insertBefore(node, sliderContainer.children[index])
        }
    }

    /**
     * A static method that sets dimensions to the container node.
     * @static
     * @param {object} container - Container node object.
     * @param {number} dimension - Calculated dimension we set to cintainer.
     */
    static setContainerDimensions(container, dimension) {
        container.style.height = `${dimension}px`
        container.style.width = `${dimension}px`
    }

    /**
     * A static method that creates new circle container node.
     * @static
     * @returns {object} - New circular slider container node.
     */
    static createCircularSliderContainerNode() {
        const circularSliderContainer = document.createElement("div")
        circularSliderContainer.classList.add("circular-slider-container")

        return circularSliderContainer
    }

    /**
     * A static method that generates new random ID.
     * @static
     * @returns {string} Generated ID.
     */
    static generateRandomId() {
        const timestamp = Date.now().toString(36) // Convert timestamp to base 36 string
        const randomNumber = Math.random().toString(16).substring(0, 8) // Get last 8 characters of random number
        return `${timestamp}-${randomNumber}`
    }
}
