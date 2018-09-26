import { GraphState } from "../graph/graph_state";
import { GraphNode } from "../graph/graph_node";
import MouseInput from "../mouse_input";
import { ConceptGrapher } from "../concept_grapher";
import { NodeConnection } from "../graph/node_connection";
import { PointLike } from "pixi.js";

export class GraphWidget {
    public selected_node: GraphNode | null;
    private mouse_input: MouseInput;

    constructor(private concept_grapher: ConceptGrapher, private graph_state: GraphState) {
        this.mouse_input = new MouseInput(concept_grapher.viewport, this);
    };

    add_graph_node(node: GraphNode) {
        this.graph_state.add_node(node);
    }

    add_connection(connection: NodeConnection) {
        this.graph_state.add_connection(connection);
    }

    create_temporary_node(mouse_point: PointLike) {
        this.graph_state.create_temporary_node(mouse_point);
    }

    write_to_graph_and_null_temporary_node() {
        this.graph_state.write_to_graph_and_null_temporary_node();
    }

    write_to_selected_node(new_text: string) {
        if (this.selected_node) this.selected_node.text.text = new_text;
    };

    select_node(node: GraphNode) {
        this.selected_node = node;

        this.concept_grapher.on_select_new_node(node);
    };

    set_new_graph(new_graph: GraphState) {
        this.clear_active_graph();
        this.graph_state = new_graph;
        this.concept_grapher.viewport.moveCenter(0, 0);
    };

    clear_active_graph() {
        this.graph_state.clear();
    };

    get_graph(): GraphState {
        return this.graph_state;
    }
};