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

        let spinnerContainer = container.querySelector(".circular-slider-container")
        let containerId = container.getAttribute("circular-slider-id")

        if (!containerId) {
            containerId = DrawQueue.generateRandomId()
            // Assigning unique identifier to each new container.
            container.setAttribute("circular-slider-id", containerId)

            // Appending container node that help handles all sliders in container.
            spinnerContainer = DrawQueue.createCircularSpinnerContainerNode()
            container.appendChild(spinnerContainer)
        }

        // Calcilating spinner dimension with all offsets //
        const spinnerOffsetDimension = radius * 2 + DEFAULT_CIRCLE_OFFSET + DEFAULT_STROKE_WIDTH

        const data = this._drawQueue.get(containerId)
        // Check if there are already elements for container
        if (!data) {
            // Save first element spinner radius
            this._drawQueue.set(containerId, [radius])

            // Set first dimensions and append to spinner container
            DrawQueue.setContainerDimensions(spinnerContainer, spinnerOffsetDimension)
            spinnerContainer.appendChild(node)
        } else {
            const radiusArr = data.concat(radius)
            radiusArr.sort((a, b) => b - a)

            // Set new ordered radius array
            this._drawQueue.set(containerId, radiusArr)

            const index = radiusArr.indexOf(radius)
            // Check if index is 0, means circle has largest radius
            if (index === 0) {
                // Set new dimension to spinner container
                DrawQueue.setContainerDimensions(spinnerContainer, spinnerOffsetDimension)
            }

            // Inserts new node to specific ordered index
            spinnerContainer.insertBefore(node, spinnerContainer.children[index])
        }
    }

    /**
     * A static method that sets dimensions to the container node
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
    static createCircularSpinnerContainerNode() {
        const circularSpinnerContainer = document.createElement("div")
        circularSpinnerContainer.classList.add("circular-slider-container")

        return circularSpinnerContainer
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
