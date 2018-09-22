// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { Application } from 'pixi.js';
import * as Viewport from 'pixi-viewport';
import { ConceptGrapher } from './modules/concept_grapher';

const canvasContainer = document.getElementById("pixi-canvas-container") as HTMLElement;

const app: Application = new Application(canvasContainer.offsetWidth, canvasContainer.offsetHeight, { backgroundColor: 0xeeeeee }, true);

app.view.style.position = 'absolute';
app.view.style.display = 'block';
canvasContainer.appendChild(app.view);

window.onresize = () => {
	app.view.style.width = `${canvasContainer.offsetWidth}px`;
	app.view.style.height = `${canvasContainer.offsetHeight}px`;
};

const viewport = addViewport();
viewport.moveCenter(0, 0);
const concept_grapher = new ConceptGrapher(viewport);

// Viewport handles rendering updates
function addViewport(): Viewport {
	const viewport = new Viewport({
		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight,
		worldWidth: 1000,
		worldHeight: 1000,

		interaction: app.renderer.plugins.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
	});
	app.stage.addChild(viewport);
	viewport
		.drag()
		.wheel();

	return viewport;
};