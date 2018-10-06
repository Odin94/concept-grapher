import { GraphNode } from "../graph/graph_node";
import { Point } from "pixi.js";
import constants from "../../constants";
import { zText } from "../../classes_with_z_order";
import { NodeConnection } from "../graph/node_connection";
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
            this.canvas_inputs.graph_widget.write_to_graph_and_null_temporary_node();
            this.canvas_inputs.graph_widget.select_node(selected_node);
        } else {
            this.canvas_inputs.graph_widget.write_to_graph_and_null_temporary_node();
            this.canvas_inputs.graph_widget.create_temporary_node(data.world);
            this.canvas_inputs.graph_widget.select_node(this.canvas_inputs.graph_widget.get_graph().temporary_node as GraphNode);
        }
    }

    private on_drag_start(event: PIXI.interaction.InteractionEvent) {
        const selected_node = this.select_node(event.data.global as Point);
        if (selected_node) {
            this.canvas_inputs.viewport.pausePlugin("drag");


            const line = new PIXI.Graphics();

            this.canvas_inputs.viewport.addChild(line);
            this.canvas_inputs.temp_connection = { start_node: selected_node, line: line };
        }
    }

    private on_drag_move(event: PIXI.interaction.InteractionEvent) {
        if (this.canvas_inputs.temp_connection) {
            const line_target = this.canvas_inputs.viewport.toWorld(new Point(event.data.global.x, event.data.global.y));
            const connection_line_points = this.canvas_inputs.temp_connection.start_node.get_connection_line_to_point(line_target);

            this.canvas_inputs.temp_connection.line
                .clear()
                .lineStyle(...constants.DEFAULT_LINE_STYLE)
                .moveTo(connection_line_points.first.x, connection_line_points.first.y)
                .lineTo(line_target.x, line_target.y);

            this.canvas_inputs.viewport.addChild(this.canvas_inputs.temp_connection.line);
        }
        else if (this.canvas_inputs.dragged_node) {
            this.canvas_inputs.dragged_node.set_x(event.data.global.x);
            this.canvas_inputs.dragged_node.set_y(event.data.global.y);
        }
    }

    private on_drag_complete(event: PIXI.interaction.InteractionEvent) {
        this.canvas_inputs.viewport.resumePlugin("drag");

        if (this.canvas_inputs.temp_connection) {
            const target_node = this.select_node(event.data.global as Point);
            if (target_node && target_node.id != this.canvas_inputs.temp_connection.start_node.id) {
                const line = new PIXI.Graphics()
                    .lineStyle(...constants.DEFAULT_LINE_STYLE)
                    .moveTo(this.canvas_inputs.temp_connection.start_node.get_x(), this.canvas_inputs.temp_connection.start_node.get_y())
                    .lineTo(target_node.get_x(), target_node.get_y());

                const text = new zText('', constants.DEFAULT_FONT, constants.NODE_Z_ORDER);

                const new_connection = new NodeConnection(this.canvas_inputs.temp_connection.start_node.id, target_node.id, line, text);
                this.canvas_inputs.graph_widget.add_connection(new_connection);
            }

            this.canvas_inputs.viewport.removeChild(this.canvas_inputs.temp_connection.line);
            this.canvas_inputs.temp_connection = null;
        }
        else if (this.canvas_inputs.dragged_node) {

        }
    }

    private select_node(mouse_point: Point): GraphNode | null {
        const graph_state = this.canvas_inputs.graph_widget.get_graph();
        const all_nodes: Array<GraphNode> = graph_state.temporary_node ? graph_state.nodes.concat(graph_state.temporary_node) : graph_state.nodes;

        return all_nodes.find(({ text }) => {
            return text.containsPoint(mouse_point);
        }) || null;
    }
};