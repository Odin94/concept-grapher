import { GraphState } from "../graph/graph_state";
import { GraphNode } from "../graph/graph_node";
import CanvasInputs from "../io_handlers/canvas_inputs";
import { ConceptGrapher } from "../concept_grapher";
import { NodeConnection } from "../graph/node_connection";
import { PointLike } from "pixi.js";
import { zGraphics } from "../../classes_with_z_order";
import constants from "../../constants";

export class GraphWidget {
    public selected_node: GraphNode | null;
    private selected_node_outline = new zGraphics(constants.Z_ORDERS.NODE_OUTLINE);
    private canvas_input: CanvasInputs;

    constructor(private concept_grapher: ConceptGrapher, private graph_state: GraphState) {
        this.canvas_input = new CanvasInputs(concept_grapher.viewport, this);
    };

    add_graph_node(node: GraphNode) {
        this.graph_state.add_node(node);
    }

    add_connection(connection: NodeConnection) {
        this.graph_state.add_connection(connection);
    }

    create_temporary_node(mouse_point: PointLike) {
        this.graph_state.create_temporary_node(mouse_point);

        if (this.graph_state.temporary_node) this.select_node(this.graph_state.temporary_node);
    }

    write_to_graph_and_null_temporary_node() {
        this.graph_state.write_to_graph_and_null_temporary_node();
    }

    write_to_selected_node(new_text: string) {
        if (this.selected_node) this.selected_node.set_text(new_text);
    };

    select_node(node: GraphNode) {
        this.selected_node = node;

        this.concept_grapher.on_select_new_node(node);
    };

    remove_selected_node() {
        if (this.selected_node) {
            this.graph_state.remove_node(this.selected_node.id);
        }
    }

    set_new_graph(new_graph: GraphState) {
        this.clear_active_graph();
        this.graph_state = new_graph;
        this.concept_grapher.viewport.moveCenter(0, 0);

        this.graph_state.connections.forEach(connection => connection.update_connection_position(this.graph_state));
    };

    clear_active_graph() {
        this.graph_state.clear();
    };

    get_graph(): GraphState {
        return this.graph_state;
    }
};