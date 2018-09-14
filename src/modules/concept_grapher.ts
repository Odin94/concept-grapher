import { GraphState } from "./graph/graph_state";
import StatePersister from "./state_persister";
import constants from "../constants";
import { GraphWidget } from "./widgets/graph_widget";
import ControlsWidget from "./widgets/controls_widget";
import { GraphNode } from "./graph/graph_node";

export class ConceptGrapher {
    private active_graph_widget: GraphWidget;
    private graph_widgets: Array<GraphWidget>;  // private concept_grapher: ConceptGrapher, public graph_state: GraphState, private mouse_input: MouseInput

    private controls_widget = new ControlsWidget(this);

    private state_persister = new StatePersister();


    constructor(public viewport: Viewport) {
        const initial_graph_state = this.state_persister.load_graph("filename.json", viewport) || new GraphState(viewport);

        this.graph_widgets = [new GraphWidget(this, initial_graph_state)];
        this.active_graph_widget = this.graph_widgets[0];

        // const message: Text = new Text(
        //     'Hello Pixi!',
        //     constants.DEFAULT_FONT
        // );
        // message.position.set(app.view.width / 2 - message.width / 2, app.view.height / 2 - message.height / 2);
        // graph_state_container.active_graph_widget.add(new GraphNode(0, message));

    };

    on_select_new_node(node: GraphNode) {
        this.controls_widget.on_select_new_node(node.text.text);
    }

    save_active_graph(save_path: string = constants.GRAPH_STORAGE_PATH + "/graph.json") {
        this.state_persister.store_graph(this.active_graph_widget.graph_state, save_path);
    };

    write_to_selected_node(text: string) {
        this.active_graph_widget.write_to_selected_node(text);
    }
}