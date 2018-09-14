import { GraphNode } from '../graph/graph_node';
import { remote } from 'electron';
import constants from '../../constants';
import { ConceptGrapher } from '../concept_grapher';


export default class ControlsWidget {
    private input: HTMLTextAreaElement;
    private save_as_button: HTMLButtonElement;
    private load_button: HTMLButtonElement;

    constructor(private concept_grapher: ConceptGrapher) {
        // TODO: create controls-widget html here?
        this.input = document.getElementById("text-input") as HTMLTextAreaElement;
        this.input.oninput = (event: Event) => {
            concept_grapher.write_to_selected_node(this.input.value);
        };

        this.save_as_button = document.getElementById("save-as-button") as HTMLButtonElement;
        this.save_as_button.onclick = (event: Event) => {
            const save_path = remote.dialog.showSaveDialog({ defaultPath: constants.GRAPH_STORAGE_PATH, filters: [{ name: 'JSON', extensions: ['json'] }] });
            if (save_path) {
                this.save_graph_as(save_path);
            } else {
                // TODO: display error message
            }
        };

        this.load_button = document.getElementById("load-button") as HTMLButtonElement;
        this.load_button.onclick = (event: Event) => {
            const load_path = remote.dialog.showOpenDialog({ defaultPath: constants.GRAPH_STORAGE_PATH, filters: [{ name: 'JSON', extensions: ['json'] }], properties: ["openFile"] })[0];
            if (load_path) {
                this.load_graph(load_path);
            } else {
                // TODO: display error message
            }
        };
    };

    on_select_new_node(node_text: string) {
        this.input.value = node_text;

        this.input.focus();
    };

    save_graph_as(save_path: string) {
        this.concept_grapher.save_active_graph(save_path);
    };

    load_graph(load_path: string) {
        this.concept_grapher.load_graph(load_path);
    }
};