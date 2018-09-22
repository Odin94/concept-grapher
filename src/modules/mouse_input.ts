import { Point } from 'pixi.js';
import { GraphNode } from './graph/graph_node';
import { GraphWidget } from './widgets/graph_widget';

export default class MouseInput {
    constructor(private viewport: Viewport, private graph_widget: GraphWidget) {
        this.addMouseListeners();
    };

    private addMouseListeners() {
        this.viewport.on("clicked", (data: Viewport.ClickEventData) => {
            const selected_node = this.select_node(data.screen as Point);
            if (selected_node) {
                this.graph_widget.graph_state.write_to_graph_and_null_temporary_node();
                this.graph_widget.select_node(selected_node);
            } else {
                this.graph_widget.graph_state.write_to_graph_and_null_temporary_node();
                this.graph_widget.graph_state.create_temporary_node(data.world);
                this.graph_widget.select_node(this.graph_widget.graph_state.temporary_node as GraphNode);
            }
        });

        this.viewport.on("pointerdown", (event: PIXI.interaction.InteractionEvent) => {
            // TODO: determine if we pointerdowned on open space. If not, prevent drag
            if (false) {
                this.viewport.pausePlugin("drag");
            }
        });

        this.viewport.on("pointerup", (event: PIXI.interaction.InteractionEvent) => {
            this.viewport.resumePlugin("drag");
        });
    }

    private select_node(mouse_point: Point): GraphNode | null {
        const all_nodes: Array<GraphNode> = this.graph_widget.graph_state.temporary_node ? this.graph_widget.graph_state.nodes.concat(this.graph_widget.graph_state.temporary_node) : this.graph_widget.graph_state.nodes;

        return all_nodes.find(({ text }) => {
            return text.containsPoint(mouse_point);
        }) || null;
    }
}