import { GraphState } from "./graph/graph_state";
import StatePersister from "./state_persister";
import { join } from 'path';
import constants from "../constants";
import { GraphWidget } from "./widgets/graph_widget";
import ControlsWidget from "./widgets/controls_widget";
import { GraphNode } from "./graph/graph_node";
import { Text } from 'pixi.js';

export class ConceptGrapher {
    private active_graph_widget: GraphWidget;
    private graph_widgets: Array<GraphWidget>;

    private controls_widget = new ControlsWidget(this);

    private state_persister = new StatePersister();


    constructor(public viewport: Viewport) {
        const initial_graph_state = this.state_persister.load_graph(join(constants.DEFAULT_GRAPH_STORAGE_PATH, constants.DEFAULT_STORED_GRAPH_NAME), viewport) || new GraphState(viewport);

        this.graph_widgets = [new GraphWidget(this, initial_graph_state)];
        this.active_graph_widget = this.graph_widgets[0];

        const message: Text = new Text(
            'Hello ConceptGrapher!',
            constants.DEFAULT_FONT
        );
        this.active_graph_widget.graph_state.add(new GraphNode(0, message));
        message.position.set(viewport.screenWidth / 2 - message.width / 2, viewport.screenHeight / 2 - message.height / 2);
    };

    on_select_new_node(node: GraphNode) {
        this.controls_widget.on_select_new_node(node.text.text);
    };

    write_to_selected_node(text: string) {
        this.active_graph_widget.write_to_selected_node(text);
    };

    save_active_graph(save_path: string = join(constants.DEFAULT_GRAPH_STORAGE_PATH, constants.DEFAULT_STORED_GRAPH_NAME)) {
        this.active_graph_widget.graph_state.write_to_graph_and_null_temporary_node();
        this.state_persister.store_graph(this.active_graph_widget.graph_state, save_path);
    };

    load_graph(load_path: string) {
        const new_graph = this.state_persister.load_graph(load_path, this.viewport);

        // TODO: put create new graph_widget for new_graph and display it, hide old active graph
        if (new_graph) {
            this.active_graph_widget.clear_active_graph();
            this.active_graph_widget.set_new_graph(new_graph);
        }
    }
}