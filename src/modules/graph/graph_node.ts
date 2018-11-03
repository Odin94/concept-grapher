import { TextStyleOptions, Point } from 'pixi.js';
import { zText, zGraphics } from '../../classes_with_z_order';
import constants from '../../constants';
import { GraphState } from './graph_state';

export class GraphNode {

    public background_rect = new zGraphics(constants.Z_ORDERS.NODE_BACKGROUND);
    constructor(public readonly id: number, public text: zText) {
        this.update_background();
    }

    update_background() {
        // Note: text.x and border_rect.x aren't directly comparable. One is world offset, the other camera offset

        this.background_rect
            .clear()
            .beginFill(constants.DEFAULT_NODE_BACKGROUND_COLOR)
            .drawRoundedRect(
                this.text.x - constants.NODE_BACKGROUND_MARGIN,
                this.text.y - constants.NODE_BACKGROUND_MARGIN,
                this.text.width + 2 * constants.NODE_BACKGROUND_MARGIN,
                this.text.height + 2 * constants.NODE_BACKGROUND_MARGIN,
                10
            );
    }

    add_to_viewport(viewport: Viewport) {
        viewport.addChild(this.background_rect);
        viewport.addChild(this.text);
    }

    remove_from_viewport(viewport: Viewport) {
        viewport.removeChild(this.background_rect);
        viewport.removeChild(this.text);
    }

    set_text(text: string) {
        this.text.text = text;

        this.update_background();
    }

    get_x() {
        return this.text.x;
    }

    set_x(x: number) {
        this.text.x = x;

        this.update_background();
    }

    get_y() {
        return this.text.y;
    }

    set_y(y: number) {
        this.text.y = y;

        this.update_background();
    }

    get_w() {
        return this.text.width;
    }

    get_h() {
        return this.text.height;
    }

    get_connection_line_to_node(second_node: GraphNode): { first: Point, second: Point } {
        return this.get_connection_line(
            this.get_x(), this.get_y(), this.get_w(), this.get_h(),
            second_node.get_x(), second_node.get_y(), second_node.get_w(), second_node.get_h()
        );
    }

    get_connection_line_to_point(point: Point): { first: Point, second: Point } {
        return this.get_connection_line(
            this.get_x(), this.get_y(), this.get_w(), this.get_h(),
            point.x, point.y, point.x, point.y
        );
    }

    update_connections_positions(graph_state: GraphState) {
        const connections_to_update = graph_state.connections.filter(
            connection => connection.first_node_id === this.id || connection.second_node_id === this.id
        );

        for (const connection of connections_to_update) {
            connection.update_connection_position(graph_state);
        }
    }

    private get_connection_line(
        first_x: number, first_y: number, first_w: number, first_h: number,
        second_x: number, second_y: number, second_w: number, second_h: number): { first: Point, second: Point } {

        const first_xw = first_x + first_w;
        const first_yh = first_y + first_h;

        const second_xw = second_x + second_w;
        const second_yh = second_y + second_h;

        let first_node_x: number, first_node_y: number, second_node_x: number, second_node_y: number;

        // TODO: write some pretty functions to make this readable
        // first fully left of second
        if (first_xw < second_x) {
            first_node_x = first_xw;
            second_node_x = second_x;
        }
        // first slightly left of second
        else if (first_xw < second_xw) {
            first_node_x = first_x + first_w / 2;
            second_node_x = second_x + second_w / 2;
        }
        // first slightly right of second
        else if (first_x < second_xw) {
            first_node_x = first_x + first_w / 2;
            second_node_x = second_x + second_w / 2;
        }
        // first fully right of second
        else {
            first_node_x = first_x;
            second_node_x = second_xw;
        }

        // first fully above second
        if (first_yh < second_y) {
            first_node_y = first_yh;
            second_node_y = second_y;
        }
        // first slightly above second
        else if (first_yh < second_yh) {
            first_node_y = first_y + first_h / 2;
            second_node_y = second_y + second_h / 2;
        }
        // first slightly below second
        else if (first_y < second_y) {
            first_node_y = first_y + first_h / 2;
            second_node_y = second_y + second_h / 2;
        }
        // first fully below second
        else {
            first_node_y = first_y;
            second_node_y = second_yh;
        }

        return { first: new Point(first_node_x, first_node_y), second: new Point(second_node_x, second_node_y) };
    }

    to_jsonable_graph_node(): JSONableGraphNode {
        // text.x/y is in world-coords
        return new JSONableGraphNode(
            this.id,
            this.text.text,
            this.text.x,
            this.text.y,
            {
                fill: this.text.style.fill,
                fontFamily: this.text.style.fontFamily,
                fontSize: this.text.style.fontSize,
            },
        );
    }
}

export class JSONableGraphNode {
    constructor(public id: number, public text: string, public x: number, public y: number, public style: TextStyleOptions) { }

    to_graph_node(): GraphNode {
        const loaded_text = new zText(this.text, this.style, constants.Z_ORDERS.NODE_TEXT);
        loaded_text.position.set(this.x, this.y);

        return new GraphNode(this.id, loaded_text);
    }
}