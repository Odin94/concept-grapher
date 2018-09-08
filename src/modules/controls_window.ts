import { Text } from 'pixi.js';

export default class ControlsWindow {
    selected_text: Text;
    constructor() {
        // TODO: create input window here
        const input: HTMLTextAreaElement = document.getElementById("text-input") as HTMLTextAreaElement;
        input.oninput = (event: Event) => {
            if (this.selected_text) this.selected_text.text = input.value;
        };
    }
}