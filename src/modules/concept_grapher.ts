import { GraphState } from "./graph/graph_state";
import StatePersister from "./state_persister";
import constants from "../constants";
import { GraphWidget } from "./widgets/graph_widget";
import ControlsWidget from "./widgets/controls_widget";
import { GraphNode } from "./graph/graph_node";
import { Text } from 'pixi.js';

export class ConceptGrapher {
    private active_graph_widget: GraphWidget;
    private graph_widgets: Array<GraphWidget>;  // private concept_grapher: ConceptGrapher, public graph_state: GraphState, private mouse_input: MouseInput

    private controls_widget = new ControlsWidget(this);

    private state_persister = new StatePersister();


    constructor(public viewport: Viewport) {
        const initial_graph_state = this.state_persister.load_graph("filename.json", viewport) || new GraphState(viewport);

        this.graph_widgets = [new GraphWidget(this, initial_graph_state)];
        this.active_graph_widget = this.graph_widgets[0];

        const message: Text = new Text(
            'Hello ConceptGrapher!',
            constants.DEFAULT_FONT
        );
        message.position.set(viewport.width / 2 - message.width / 2, viewport.height / 2 - message.height / 2);
        this.active_graph_widget.graph_state.add(new GraphNode(0, message));
    };

    on_select_new_node(node: GraphNode) {
        this.controls_widget.on_select_new_node(node.text.text);
    };

    write_to_selected_node(text: string) {
        this.active_graph_widget.write_to_selected_node(text);
    };

    save_active_graph(save_path: string = constants.GRAPH_STORAGE_PATH + "/graph.json") {
        this.state_persister.store_graph(this.active_graph_widget.graph_state, save_path);
    };

    load_graph(load_path: string) {
        const new_graph = this.state_persister.load_graph(load_path, this.viewport);

        // TODO: put create new graph_widget for new_graph and display it, hide old active graph
        if (new_graph) this.active_graph_widget.graph_state = new_graph;
    }
}