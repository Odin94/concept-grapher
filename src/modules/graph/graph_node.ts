import { TextStyleOptions } from 'pixi.js';
import { zText } from '../../classes_with_z_order';
import constants from '../../constants';

export class GraphNode {
    constructor(public readonly id: number, public text: zText) { };

    add_to_viewport(viewport: Viewport) {
        viewport.addChild(this.text);
    };

    remove_from_viewport(viewport: Viewport) {
        viewport.removeChild(this.text);
    };

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
    };
};