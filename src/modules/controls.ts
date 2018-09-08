import { GraphNode } from './graph_state';

class Controls {
    selected_node: GraphNode;
    private input: HTMLTextAreaElement;

    constructor() {
        // TODO: create input window here
        this.input = document.getElementById("text-input") as HTMLTextAreaElement;
        this.input.oninput = (event: Event) => {
            if (this.selected_node) this.selected_node.text.text = this.input.value;
        };
    }

    set_selected_node(new_node: GraphNode) {
        this.selected_node = new_node;
        this.input.value = new_node.text.text;

        this.input.focus();
    }
}

export default new Controls();