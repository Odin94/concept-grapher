import { Text, TextStyleOptions } from 'pixi.js';
import { GraphNode } from './graph_node';

export class NodeConnection {
    constructor(public readonly first_node_id: number, public readonly second_node_id: number, public line: PIXI.Graphics, public text: Text) { };

    add_to_viewport(viewport: Viewport) {
        viewport.addChild(this.text);
        viewport.addChild(this.line);
    };

    remove_from_viewport(viewport: Viewport) {
        viewport.removeChild(this.text);
        viewport.removeChild(this.line);
    };

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
            return new NodeConnection(this.first_node_id, this.second_node_id, new PIXI.Graphics(), new Text());
        }

        const loaded_text = new Text(this.text, this.text_style);
        const loaded_line = new PIXI.Graphics()
            .lineStyle(this.line_style.width, this.line_style.color, this.line_style.alpha)
            .moveTo(node_one.text.x, node_one.text.y)
            .lineTo(node_two.text.x, node_two.text.y);

        return new NodeConnection(this.first_node_id, this.second_node_id, loaded_line, loaded_text);
    };
};

export interface LineStyleOptions { width: number, color: number, alpha: number };