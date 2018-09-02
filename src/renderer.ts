// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { Application, Container, Text } from 'pixi.js';
import MouseInput from './modules/mouse_input';
import * as Viewport from 'pixi-viewport';

const canvasContainer = document.getElementById("pixi-canvas-container");

const app: Application = new Application(canvasContainer.offsetWidth, canvasContainer.offsetHeight, { backgroundColor: 0xeeeeee }, true);

app.view.style.position = 'absolute';
app.view.style.display = 'block';
canvasContainer.appendChild(app.view);

const viewport = addViewport();

const stage: Container = new Container();

const message: Text = new Text(
	'Hello Pixi!',
	{ fontFamily: 'Arial', fontSize: 32, fill: 'red' }
);

message.position.set(app.view.width / 2 - message.width / 2, app.view.height / 2 - message.height / 2);
viewport.addChild(message);

const mouseInput = new MouseInput(viewport);

const input: HTMLTextAreaElement = document.getElementById("text-input") as HTMLTextAreaElement;
input.oninput = (event: Event) => {
	message.text = input.value;
};
// document.body.appendChild(input);

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