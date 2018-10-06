import CanvasInputs from "./canvas_inputs";
import * as Mousetrap from 'mousetrap';

export default class KeyboardEventHandler {
    public key_states = {
        control: { isDown: false }
    }

    constructor(private canvas_inputs: CanvasInputs) {
        // force mousetrap to keep capturing keys when an input field is focused 
        Mousetrap.prototype.stopCallback = () => { return false; }

        Mousetrap.bind(["ctrl", "command"], () => { this.control_down() }, 'keydown');
        Mousetrap.bind(["ctrl", "command"], () => { this.control_up() }, 'keyup');
    }

    private control_down() {
        this.key_states.control.isDown = true;
    }

    private control_up() {
        this.key_states.control.isDown = false;
    }
}