import { Text, TextStyleOptions } from 'pixi.js';

export class JSONableGraphNode {
    constructor(public id: number, public text: string, public x: number, public y: number, public style: TextStyleOptions) { }

    to_graph_node(): GraphNode {
        const loaded_text = new Text(this.text, this.style);
        loaded_text.position.set(this.x, this.y);

        return new GraphNode(this.id, loaded_text);
    };
};
export class GraphNode {
    constructor(public readonly id: number, public text: Text) { };

    to_jsonable_graph_node(viewport: Viewport): JSONableGraphNode {
        const world_pos = viewport.toWorld(this.text.x, this.text.y);

        return new JSONableGraphNode(
            this.id,
            this.text.text,
            world_pos.x,
            world_pos.y,
            {
                fontFamily: this.text.style.fontFamily,
                fontSize: this.text.style.fontSize,
                fill: this.text.style.fill
            }
        );
    };
};