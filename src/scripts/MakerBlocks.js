import {createRoot} from "react-dom/client";
import FlowState from "./apps/flowstate/FlowState";

class MakerBlocks {
	constructor() {
		this.componentRegistry = [
			{id: "flowstate-app", component: FlowState, name: "FlowState"},
		];

		this.init();
	}

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

	mountComponent(config, element) {
		const {component: Component, name} = config;
		const props = this.parseComponentProps(element, name);

		try {
			const root = createRoot(element);
			root.render(<Component {...props} />);
		} catch (error) {
			console.error(`Failed to mount ${name} component:`, error);
		}
	}

	initializeComponents() {
		this.componentRegistry.forEach((config) => {
			const element = document.getElementById(config.id);

			if (element) {
				this.mountComponent(config, element);
			}
		});
	}

	init() {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => {
				this.initializeComponents();
			});
		} else {
			this.initializeComponents();
		}
	}

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
