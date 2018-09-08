import { Text } from 'pixi.js';
import constants from '../constants';

export class GraphState {
    private temporary_node: GraphNode = null;

    constructor(public nodes: Array<GraphNode> = [], public connections: Array<NodeConnection> = []) { };

    add(node: GraphNode) {
        this.nodes.push(node);
    };

    remove(nodeId: number) {
        this.nodes = this.nodes.filter(elem => elem.id !== nodeId);
    };

    create_temporary_node(x: number, y: number) {
        this.store_and_null_temporary_node();

        const new_id = this.get_max_id() + 1;
        const new_text = new Text("", constants.DEFAULT_FONT);
        this.temporary_node = new GraphNode(new_id, new_text);
    }

    private store_and_null_temporary_node() {
        this.add(this.temporary_node);
        this.temporary_node = null;
    }

    private get_max_id(): number {
        const ids: Array<number> = this.nodes.map((node) => node.id);
        return ids.length > 0 ? Math.max(...ids) : 0;
    }
}

export class GraphNode {
    constructor(public readonly id: number, public text: Text) { };
}

export class NodeConnection {
    constructor(public readonly firstNodeId: number, public readonly secondNodeId: string, public text: Text) { };
}