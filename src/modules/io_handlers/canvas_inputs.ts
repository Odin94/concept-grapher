import { GraphNode } from '../graph/graph_node';
import { GraphWidget } from '../widgets/graph_widget';
import MouseEventHandler from './mouse_event_handler';
import KeyboardEventHandler from './keyboard_event_handler';
import { PointLike, Point } from 'pixi.js';
import constants from '../../constants';
import { NodeConnection } from '../graph/node_connection';
import { zText } from '../../classes_with_z_order';

export default class CanvasInputs {
    public mouse: MouseEventHandler;
    public keyboard: KeyboardEventHandler;

    public temp_connection: temp_connection | null = null;
    public dragged_node: GraphNode | null = null;

    constructor(public viewport: Viewport, public graph_widget: GraphWidget) {
        this.mouse = new MouseEventHandler(this);
        this.keyboard = new KeyboardEventHandler(this);
    }

    click_node(selected_node: GraphNode) {
        this.graph_widget.write_to_graph_and_null_temporary_node();
        this.graph_widget.select_node(selected_node);
    }

    click_empty_space(world_position: PointLike) {
        this.graph_widget.write_to_graph_and_null_temporary_node();
        this.graph_widget.create_temporary_node(world_position);
        this.graph_widget.select_node(this.graph_widget.get_graph().temporary_node as GraphNode);
    }

    start_drawing_connection(selected_node: GraphNode) {
        const line = new PIXI.Graphics();

        this.viewport.addChild(line);
        this.temp_connection = { start_node: selected_node, line: line };
    }

    start_dragging_node(dragged_node: GraphNode) {
        this.dragged_node = dragged_node;
    }

    drag_node(dragged_node: GraphNode, world_drag_target: Point) {
        dragged_node.set_x(world_drag_target.x - dragged_node.get_w() / 2);
        dragged_node.set_y(world_drag_target.y - dragged_node.get_h() / 2);

        dragged_node.update_connections_positions(this.graph_widget.get_graph());
    }

    stop_dragging_node() {
        this.dragged_node = null;
    }

    create_connection(target_node: GraphNode, temp_connection: temp_connection) {
        const line = new PIXI.Graphics()
            .lineStyle(...constants.DEFAULT_LINE_STYLE)
            .moveTo(temp_connection.start_node.get_x(), temp_connection.start_node.get_y())
            .lineTo(target_node.get_x(), target_node.get_y());

        const text = new zText('', constants.DEFAULT_FONT, constants.NODE_Z_ORDER);

        const new_connection = new NodeConnection(temp_connection.start_node.id, target_node.id, line, text);
        this.graph_widget.add_connection(new_connection);
    }

    stop_drawing_connection(temp_connection: temp_connection) {
        this.viewport.removeChild(temp_connection.line);
        this.temp_connection = null;
    }

    update_drawn_connection(line_target: Point, temp_connection: temp_connection) {
        const connection_line_points = temp_connection.start_node.get_connection_line_to_point(line_target);

        temp_connection.line
            .clear()
            .lineStyle(...constants.DEFAULT_LINE_STYLE)
            .moveTo(connection_line_points.first.x, connection_line_points.first.y)
            .lineTo(line_target.x, line_target.y);

        this.viewport.addChild(temp_connection.line);
    }
}

export interface temp_connection { start_node: GraphNode, line: PIXI.Graphics }