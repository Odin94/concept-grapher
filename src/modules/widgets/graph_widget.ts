import { GraphState } from "../graph/graph_state";
import { GraphNode } from "../graph/graph_node";
import MouseInput from "../mouse_input";
import { ConceptGrapher } from "../concept_grapher";

export class GraphWidget {
    public selected_node: GraphNode | null;
    private mouse_input: MouseInput;

    constructor(private concept_grapher: ConceptGrapher, public graph_state: GraphState) {
        this.mouse_input = new MouseInput(concept_grapher.viewport, this);
    }

    select_node(node: GraphNode) {
        this.selected_node = node;

        this.concept_grapher.on_select_new_node(node);
    }

    write_to_selected_node(new_text: string) {
        if (this.selected_node) this.selected_node.text.text = new_text;
    }

    set_new_graph(new_graph: GraphState) {
        this.clear_active_graph();
        this.graph_state = new_graph;
        this.concept_grapher.viewport.moveCenter(0, 0);
    }

    clear_active_graph() {
        this.graph_state.clear();
    }
}