import { Text, TextStyleOptions } from 'pixi.js';

export class JSONableNodeConnection {
    constructor(public firstNodeId: number, public secondNodeId: number, public text: string, public style: TextStyleOptions) { }

    to_node_connection(): NodeConnection {
        const loaded_text = new Text(this.text, this.style);

        return new NodeConnection(this.firstNodeId, this.secondNodeId, loaded_text);
    };
};
export class NodeConnection {
    constructor(public readonly firstNodeId: number, public readonly secondNodeId: number, public text: Text) { };

    to_jsonable_node_connection(): JSONableNodeConnection {
        return new JSONableNodeConnection(
            this.firstNodeId,
            this.secondNodeId,
            this.text.text,
            {
                fontFamily: this.text.style.fontFamily,
                fontSize: this.text.style.fontSize,
                fill: this.text.style.fill
            }
        );
    };
};