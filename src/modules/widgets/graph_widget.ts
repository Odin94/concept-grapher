import { GraphState } from "../graph/graph_state";
import { GraphNode } from "../graph/graph_node";
import CanvasInputs from "../io_handlers/canvas_inputs";
import { ConceptGrapher } from "../concept_grapher";
import { NodeConnection } from "../graph/node_connection";
import { PointLike } from "pixi.js";
import { ActionStack } from "../action_stack";

export class GraphWidget {
    public selected_node: GraphNode | null;
    private canvas_input: CanvasInputs;
    private undo_stack: ActionStack;

    constructor(private concept_grapher: ConceptGrapher, private graph_state: GraphState) {
        this.canvas_input = new CanvasInputs(concept_grapher.viewport, this);
        this.undo_stack = new ActionStack([this.graph_state]);
    }

    undo() {
        this.clear_active_graph();
        this.graph_state = this.undo_stack.undo(this.graph_state.viewport);

        this.preserve_node_selection()
    }

    redo() {
        if (this.undo_stack.is_at_top()) return;

        this.clear_active_graph();
        this.graph_state = this.undo_stack.redo(this.graph_state.viewport);

        this.preserve_node_selection();
    }

    preserve_node_selection() {
        if (this.selected_node) {
            const selected_node = this.graph_state.get_node_by_id(this.selected_node.id) || null;
            if (selected_node) {
                this.select_node(selected_node);
            }
            else {
                this.concept_grapher.on_unselect_node();
            }
        }
    }

    add_graph_node(node: GraphNode) {
        this.graph_state.add_node(node);

        this.undo_stack.push_state(this.graph_state);
    }

    add_connection(connection: NodeConnection) {
        this.graph_state.add_connection(connection);

        this.undo_stack.push_state(this.graph_state);
    }

    create_node(mouse_point: PointLike) {
        const new_node = this.graph_state.create_node(mouse_point);
        this.select_node(new_node);

        this.undo_stack.push_state(this.graph_state);
    }

    write_to_selected_node(new_text: string) {
        if (this.selected_node) {
            this.selected_node.set_text(new_text);
        }
    }

    select_node(node: GraphNode) {
        if (this.selected_node) this.selected_node.on_deselect();
        node.on_select();

        this.selected_node = node;

        this.concept_grapher.on_select_new_node(node);
    }

    on_stop_dragging_node() {
        this.undo_stack.push_state(this.graph_state);
    }

    remove_selected_node() {
        if (this.selected_node) {
            this.graph_state.remove_node(this.selected_node.id);
            this.concept_grapher.on_unselect_node();

            this.undo_stack.push_state(this.graph_state);
        }
    }

    set_new_graph(new_graph: GraphState) {
        this.clear_active_graph();
        this.graph_state = new_graph;
        this.concept_grapher.viewport.moveCenter(0, 0);

        this.undo_stack.push_state(this.graph_state);
    }

    clear_active_graph() {
        this.graph_state.clear();
    }

    get_graph(): GraphState {
        return this.graph_state;
    }
};