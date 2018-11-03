import { GraphState } from "./graph/graph_state";
import StatePersister from "./state_persister";
import { join } from 'path';
import constants from "../constants";
import { GraphWidget } from "./widgets/graph_widget";
import ControlsWidget from "./widgets/controls_widget";
import { GraphNode } from "./graph/graph_node";
import { zViewport, zText } from "../classes_with_z_order";

export class ConceptGrapher {
    private active_graph_widget: GraphWidget;
    private graph_widgets: Array<GraphWidget>;

    private controls_widget = new ControlsWidget(this);

    private state_persister = new StatePersister();


    constructor(public viewport: zViewport) {
        const initial_graph_state = this.state_persister.load_graph(join(constants.DEFAULT_GRAPH_STORAGE_PATH, constants.DEFAULT_STORED_GRAPH_NAME), viewport) || new GraphState(viewport);

        this.graph_widgets = [new GraphWidget(this, initial_graph_state)];
        this.active_graph_widget = this.graph_widgets[0];

        const message: zText = new zText(
            'Hello ConceptGrapher!',
            constants.DEFAULT_FONT,
            constants.NODE_TEXT_Z_ORDER,
        );
        message.position.set(0 - message.width / 2, 0 - message.height / 2);
        
        this.active_graph_widget.add_graph_node(new GraphNode(0, message));
    };

    on_select_new_node(node: GraphNode) {
        this.controls_widget.on_select_new_node(node.text.text);
    };

    write_to_selected_node(text: string) {
        this.active_graph_widget.write_to_selected_node(text);
    };

    save_active_graph(save_path: string = join(constants.DEFAULT_GRAPH_STORAGE_PATH, constants.DEFAULT_STORED_GRAPH_NAME)) {
        this.active_graph_widget.write_to_graph_and_null_temporary_node();
        this.state_persister.store_graph(this.active_graph_widget.get_graph(), save_path);
    };

    load_graph(load_path: string) {
        const new_graph = this.state_persister.load_graph(load_path, this.viewport);

        if (new_graph) {
            this.active_graph_widget.clear_active_graph();
            this.active_graph_widget.set_new_graph(new_graph);
        }
    };
};