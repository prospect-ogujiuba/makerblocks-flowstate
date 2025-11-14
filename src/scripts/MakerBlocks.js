// MakerBlocks.js - Class-based consolidated component renderer
import {createRoot} from "react-dom/client";

// Import all React components
import FlowState from "./apps/flowstate/layouts/DashboardLayout";

class MakerBlocks {
	constructor() {
		// Component registry - maps element IDs to their React components
		this.componentRegistry = [
			{id: "flowstate-app", component: FlowState, name: "FlowState"},
		];

		this.init();
	}

	/**
	 * Parse component props from data attribute
	 * @param {HTMLElement} element - The DOM element
	 * @param {string} componentName - Name of component for error logging
	 * @returns {Object} - Parsed props object
	 */
	parseComponentProps(element, componentName) {
		const propsData = element.getAttribute("component-data");
		let props = {};

		if (propsData) {
			try {
				props = JSON.parse(propsData);
			} catch (e) {
				console.warn(`Failed to parse ${componentName} component props:`, e);
			}
		}

		return props;
	}

	/**
	 * Mount a single React component
	 * @param {Object} config - Component configuration
	 * @param {HTMLElement} element - Target DOM element
	 */
	mountComponent(config, element) {
		const {component: Component, name} = config;
		const props = this.parseComponentProps(element, name);

		try {
			const root = createRoot(element);
			root.render(<Component {...props} />);
			// console.log(`✅ Mounted ${name} component`);
		} catch (error) {
			// console.error(`❌ Failed to mount ${name} component:`, error);
		}
	}

	/**
	 * Initialize all components present on the page
	 */
	initializeComponents() {
		this.componentRegistry.forEach((config) => {
			const element = document.getElementById(config.id);

			if (element) {
				this.mountComponent(config, element);
			}
		});
	}

	/**
	 * Initialize the MakerBlocks system
	 */
	init() {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => {
				this.initializeComponents();
			});
		} else {
			// DOM is already ready
			this.initializeComponents();
		}
	}

	/**
	 * Manually mount a specific component (for dynamic usage)
	 * @param {string} componentId - The element ID to mount
	 */
	mountById(componentId) {
		const config = this.componentRegistry.find((c) => c.id === componentId);
		const element = document.getElementById(componentId);

		if (config && element) {
			this.mountComponent(config, element);
		} else {
			console.warn(`Component or element not found for ID: ${componentId}`);
		}
	}
}

export default MakerBlocks;
