import { TextStyleOptions, Point } from 'pixi.js';
import { zText } from '../../classes_with_z_order';
import constants from '../../constants';

export class GraphNode {
    constructor(public readonly id: number, public text: zText) { }

    add_to_viewport(viewport: Viewport) {
        viewport.addChild(this.text);
    }

    remove_from_viewport(viewport: Viewport) {
        viewport.removeChild(this.text);
    }

    get_x() {
        return this.text.x;
    }

    set_x(x: number) {
        this.text.x = x;
    }

    get_y() {
        return this.text.y;
    }

    set_y(y: number) {
        this.text.y = y;
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
        const loaded_text = new zText(this.text, this.style, constants.NODE_Z_ORDER);
        loaded_text.position.set(this.x, this.y);

        return new GraphNode(this.id, loaded_text);
    }
}