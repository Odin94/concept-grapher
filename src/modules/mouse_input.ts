import { GraphState, GraphNode } from './graph_state';
import { Point } from 'pixi.js';

export default class MouseInput {
    constructor(public viewport: Viewport, public graphState: GraphState) {
        this.addMouseListeners();
    };

    private addMouseListeners() {
        this.viewport.on("clicked", (data: Viewport.ClickEventData) => {
            console.log(data);
            const selected_node = this.select_node(data.world as Point);
            if (selected_node) {

            } else {
                this.graphState.create_temporary_node(data.world);
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