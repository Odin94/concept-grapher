// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { Application, Container, Text } from 'pixi.js';
import MouseInput from './modules/mouse_input';
import Controls from './modules/controls';
import StatePersister from './modules/state_persister';
import * as Viewport from 'pixi-viewport';
import { GraphState } from './modules/graph/graph_state';
import constants from './constants'
import { GraphNode } from './modules/graph/graph_node';

const canvasContainer = document.getElementById("pixi-canvas-container") as HTMLElement;

const app: Application = new Application(canvasContainer.offsetWidth, canvasContainer.offsetHeight, { backgroundColor: 0xeeeeee }, true);

app.view.style.position = 'absolute';
app.view.style.display = 'block';
canvasContainer.appendChild(app.view);

const viewport = addViewport();
const state_persister = new StatePersister();
const controls = new Controls();
const graph_state = state_persister.load_graph("filename.json", viewport) || new GraphState(viewport);
const mouse_input = new MouseInput(viewport, graph_state, controls);


const message: Text = new Text(
	'Hello Pixi!',
	constants.DEFAULT_FONT
);
message.position.set(app.view.width / 2 - message.width / 2, app.view.height / 2 - message.height / 2);
graph_state.add(new GraphNode(0, message));

window.onresize = () => {
	app.view.style.width = `${canvasContainer.offsetWidth}px`;
	app.view.style.height = `${canvasContainer.offsetHeight}px`;
};

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
}