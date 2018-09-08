import { GraphState, GraphNode } from './graph_state';
import { Point } from 'pixi.js';
import Controls from './controls';

export default class MouseInput {
    constructor(public viewport: Viewport, public graphState: GraphState, public controls: Controls) {
        this.addMouseListeners();
    };

    private addMouseListeners() {
        this.viewport.on("clicked", (data: Viewport.ClickEventData) => {
            console.log(data);
            const selected_node = this.select_node(data.world as Point);
            if (selected_node) {
                this.controls.set_selected_node(selected_node);
            } else {
                this.graphState.create_temporary_node(data.world);
                this.controls.set_selected_node(this.graphState.temporary_node as GraphNode);
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

    private select_node(mousePoint: Point): GraphNode | null {
        const allNodes: Array<GraphNode> = this.graphState.temporary_node ? this.graphState.nodes.concat(this.graphState.temporary_node) : this.graphState.nodes;

        return allNodes.find(({ text }) => {
            return text.containsPoint(mousePoint);
        }) || null;
    }
}