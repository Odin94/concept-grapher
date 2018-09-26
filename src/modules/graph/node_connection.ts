import { TextStyleOptions } from 'pixi.js';
import { GraphNode } from './graph_node';
import { zText, zGraphics } from '../../classes_with_z_order';
import constants from '../../constants';
import { GraphState } from './graph_state';
import { Point } from 'electron';

export class NodeConnection {
    constructor(public readonly first_node_id: number, public readonly second_node_id: number, public line: zGraphics, public text: zText) { };

    add_to_viewport(viewport: Viewport) {
        viewport.addChild(this.text);
        viewport.addChild(this.line);
    };

    remove_from_viewport(viewport: Viewport) {
        viewport.removeChild(this.text);
        viewport.removeChild(this.line);
    };

    update_connection_position(graph_state: GraphState) {
        const first_node = graph_state.nodes.find(node => node.id === this.first_node_id) as GraphNode;
        const second_node = graph_state.nodes.find(node => node.id === this.second_node_id) as GraphNode;

        const first_x = first_node.get_x();
        const first_y = first_node.get_y();
        const first_w = first_node.get_w();
        const first_h = first_node.get_h();

        const second_x = second_node.get_x();
        const second_y = second_node.get_y();
        const second_w = second_node.get_w();
        const second_h = second_node.get_h();

        let first_node_position: Point, second_node_position: Point;
        // if ()
    }

    to_jsonable_node_connection(): JSONableNodeConnection {
        return new JSONableNodeConnection(
            this.first_node_id,
            this.second_node_id,
            this.text.text,
            {
                fontFamily: this.text.style.fontFamily,
                fontSize: this.text.style.fontSize,
                fill: this.text.style.fill
            },
            {
                width: this.line.lineWidth,
                color: this.line.lineColor,
                alpha: this.line.alpha
            }
        );
    };
};

export class JSONableNodeConnection {
    constructor(public first_node_id: number, public second_node_id: number, public text: string, public text_style: TextStyleOptions, public line_style: LineStyleOptions) { }

    to_node_connection(nodes: Array<GraphNode>): NodeConnection {
        const node_one = nodes.find(node => node.id === this.first_node_id);
        const node_two = nodes.find(node => node.id === this.second_node_id);

        if (!node_one || !node_two) {
            // TODO: display error somewhere somehow? Maybe look for one of these "null-connections" at a later step and report then?
            console.log(`ERROR: missing nodes in connection between nodes with id ${this.first_node_id}`);
            return new NodeConnection(this.first_node_id, this.second_node_id, new zGraphics(), new zText());
        }

        const loaded_text = new zText(this.text, this.text_style, constants.CONNECTION_Z_ORDER);
        const loaded_line = new zGraphics(constants.CONNECTION_Z_ORDER)
            .lineStyle(this.line_style.width, this.line_style.color, this.line_style.alpha)
            .moveTo(node_one.get_x(), node_one.get_y())
            .lineTo(node_two.get_x(), node_two.get_y());

        return new NodeConnection(this.first_node_id, this.second_node_id, loaded_line, loaded_text);
    };
};

export interface LineStyleOptions { width: number, color: number, alpha: number };