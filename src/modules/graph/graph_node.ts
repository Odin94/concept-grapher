import { Text, TextStyleOptions, Point } from 'pixi.js';

export class JSONableGraphNode {
    constructor(public id: number, public text: string, public x: number, public y: number, public style: TextStyleOptions) { }

    to_graph_node(viewport: Viewport): GraphNode {
        const loaded_text = new Text(this.text, this.style);
        const screen_pos = viewport.toScreen(this.x, this.y);
        loaded_text.position.set(screen_pos.x, screen_pos.y);

        return new GraphNode(this.id, loaded_text);
    };
};
export class GraphNode {
    constructor(public readonly id: number, public text: Text) { };

    to_jsonable_graph_node(): JSONableGraphNode {
        return new JSONableGraphNode(
            this.id,
            this.text.text,
            this.text.x,
            this.text.y,
            {
                fontFamily: this.text.style.fontFamily,
                fontSize: this.text.style.fontSize,
                fill: this.text.style.fill
            }
        );
    };
};