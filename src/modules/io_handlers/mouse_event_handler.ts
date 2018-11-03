import { GraphNode } from "../graph/graph_node";
import { Point } from "pixi.js";
import CanvasInputs from "./canvas_inputs";

export default class MouseEventHandler {
    constructor(
        private canvas_inputs: CanvasInputs
    ) {
        this.canvas_inputs.viewport.on("clicked", (data: Viewport.ClickEventData) => this.on_click(data));

        this.canvas_inputs.viewport.on("pointerdown", (event: PIXI.interaction.InteractionEvent) => this.on_drag_start(event));

        this.canvas_inputs.viewport.on("pointerup", (event: PIXI.interaction.InteractionEvent) => this.on_drag_complete(event));

        this.canvas_inputs.viewport.on("pointermove", (event: PIXI.interaction.InteractionEvent) => {
            if (this.canvas_inputs.temp_connection || this.canvas_inputs.dragged_node) this.on_drag_move(event);
        });
    }

    private on_click(data: Viewport.ClickEventData) {
        const selected_node = this.select_node(data.screen as Point);
        if (selected_node) {
            this.canvas_inputs.click_node(selected_node);
        } else {
            this.canvas_inputs.click_empty_space(data.world);
        }
    }

    private on_drag_start(event: PIXI.interaction.InteractionEvent) {
        const selected_node = this.select_node(event.data.global as Point);

        if (selected_node) {
            this.canvas_inputs.viewport.pausePlugin("drag");

            if (this.canvas_inputs.keyboard.key_states.control.isDown) {
                this.canvas_inputs.start_dragging_node(selected_node);
            }
            else {
                this.canvas_inputs.start_drawing_connection(selected_node);
            }
        }
    }

    private on_drag_move(event: PIXI.interaction.InteractionEvent) {
        const world_target = this.canvas_inputs.viewport.toWorld(new Point(event.data.global.x, event.data.global.y));

        if (this.canvas_inputs.temp_connection) {
            this.canvas_inputs.update_drawn_connection(world_target, this.canvas_inputs.temp_connection);
        }
        else if (this.canvas_inputs.dragged_node) {
            this.canvas_inputs.drag_node(this.canvas_inputs.dragged_node, world_target);
        }
    }

    private on_drag_complete(event: PIXI.interaction.InteractionEvent) {
        this.canvas_inputs.viewport.resumePlugin("drag");

        if (this.canvas_inputs.temp_connection) {
            const target_node = this.select_node(event.data.global as Point);
            if (target_node && target_node.id != this.canvas_inputs.temp_connection.start_node.id) {
                this.canvas_inputs.create_connection(target_node, this.canvas_inputs.temp_connection);
            }

            this.canvas_inputs.stop_drawing_connection(this.canvas_inputs.temp_connection);
        }
        else if (this.canvas_inputs.dragged_node) {
            this.canvas_inputs.stop_dragging_node();
        }
    }

    private select_node(mouse_point: Point): GraphNode | null {
        const graph_state = this.canvas_inputs.graph_widget.get_graph();
        const all_nodes: Array<GraphNode> = graph_state.temporary_node ? graph_state.nodes.concat(graph_state.temporary_node) : graph_state.nodes;

        return all_nodes.find(({ background }) => {
            return background.containsPoint(mouse_point);
        }) || null;
    }
}