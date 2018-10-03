import { Point } from 'pixi.js';
import { GraphNode } from './graph/graph_node';
import { GraphWidget } from './widgets/graph_widget';
import constants from '../constants';
import { NodeConnection } from './graph/node_connection';
import { zText } from '../classes_with_z_order';

export default class MouseInput {
    private temp_connection: { start_node: GraphNode, line: PIXI.Graphics } | null = null;

    constructor(private viewport: Viewport, private graph_widget: GraphWidget) {
        this.addMouseListeners();
    };

    private addMouseListeners() {
        this.viewport.on("clicked", (data: Viewport.ClickEventData) => this.on_click(data));

        this.viewport.on("pointerdown", (event: PIXI.interaction.InteractionEvent) => this.on_drag_start(event));

        this.viewport.on("pointerup", (event: PIXI.interaction.InteractionEvent) => this.on_drag_complete(event));

        this.viewport.on("pointermove", (event: PIXI.interaction.InteractionEvent) => {
            if (this.temp_connection) this.on_drag_move(event);
        });
    };

    private on_click(data: Viewport.ClickEventData) {
        const selected_node = this.select_node(data.screen as Point);
        if (selected_node) {
            this.graph_widget.write_to_graph_and_null_temporary_node();
            this.graph_widget.select_node(selected_node);
        } else {
            this.graph_widget.write_to_graph_and_null_temporary_node();
            this.graph_widget.create_temporary_node(data.world);
            this.graph_widget.select_node(this.graph_widget.get_graph().temporary_node as GraphNode);
        }
    };

    private on_drag_start(event: PIXI.interaction.InteractionEvent) {
        const selected_node = this.select_node(event.data.global as Point);
        if (selected_node) {
            this.viewport.pausePlugin("drag");

            const line = new PIXI.Graphics();

            this.viewport.addChild(line);
            this.temp_connection = { start_node: selected_node, line: line };
        }
    };

    private on_drag_move(event: PIXI.interaction.InteractionEvent) {
        if (this.temp_connection) {
            const line_target = this.viewport.toWorld(new Point(event.data.global.x, event.data.global.y));
            const connection_line_points = this.temp_connection.start_node.get_connection_line_to_point(line_target);

            this.temp_connection.line
                .clear()
                .lineStyle(...constants.DEFAULT_LINE_STYLE)
                .moveTo(connection_line_points.first.x, connection_line_points.first.y)
                .lineTo(line_target.x, line_target.y);

            this.viewport.addChild(this.temp_connection.line);
        }
    };

    private on_drag_complete(event: PIXI.interaction.InteractionEvent) {
        if (!this.temp_connection) return;

        this.viewport.resumePlugin("drag");

        const target_node = this.select_node(event.data.global as Point);
        if (target_node && target_node.id != this.temp_connection.start_node.id) {
            const line = new PIXI.Graphics()
                .lineStyle(...constants.DEFAULT_LINE_STYLE)
                .moveTo(this.temp_connection.start_node.get_x(), this.temp_connection.start_node.get_y())
                .lineTo(target_node.get_x(), target_node.get_y());

            const text = new zText('', constants.DEFAULT_FONT, constants.NODE_Z_ORDER);

            const new_connection = new NodeConnection(this.temp_connection.start_node.id, target_node.id, line, text);
            this.graph_widget.add_connection(new_connection);
        }

        this.viewport.removeChild(this.temp_connection.line);
        this.temp_connection = null;
    };

    private select_node(mouse_point: Point): GraphNode | null {
        const graph_state = this.graph_widget.get_graph();
        const all_nodes: Array<GraphNode> = graph_state.temporary_node ? graph_state.nodes.concat(graph_state.temporary_node) : graph_state.nodes;

        return all_nodes.find(({ text }) => {
            return text.containsPoint(mouse_point);
        }) || null;
    };
};