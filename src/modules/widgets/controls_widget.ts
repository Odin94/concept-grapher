import { GraphNode } from '../graph/graph_node';
import { remote } from 'electron';
import constants from '../../constants';
import { ConceptGrapher } from '../concept_grapher';


export default class ControlsWidget {
    private input: HTMLTextAreaElement;
    private save_button: HTMLButtonElement;

    constructor(private concept_grapher: ConceptGrapher) {
        // TODO: create input window here
        this.input = document.getElementById("text-input") as HTMLTextAreaElement;
        this.input.oninput = (event: Event) => {
            concept_grapher.write_to_selected_node(this.input.value);
        };

        this.save_button = document.getElementById("save-as-button") as HTMLButtonElement;
        this.save_button.onclick = (event: Event) => {
            const save_path = remote.dialog.showSaveDialog({ defaultPath: constants.GRAPH_STORAGE_PATH });
            this.save_graph_as(save_path);
        };
    };

    on_select_new_node(node_text: string) {
        this.input.value = node_text;

        this.input.focus();
    };

    save_graph_as(save_path: string) {
        this.concept_grapher.save_active_graph(save_path);
    };
};