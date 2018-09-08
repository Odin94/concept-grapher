import { Text, PointLike } from 'pixi.js';
import constants from '../constants';

export class GraphState {
    temporary_node: GraphNode | null = null;

    constructor(public viewport: Viewport, public nodes: Array<GraphNode> = [], public connections: Array<NodeConnection> = []) { };

    add(node: GraphNode) {
        this.nodes.push(node);
        this.viewport.addChild(node.text);
    };

    remove(nodeId: number) {
        this.nodes = this.nodes.filter(elem => elem.id !== nodeId);

        const removed_node = this.nodes.find(elem => elem.id !== nodeId);
        if (removed_node) this.viewport.removeChild(removed_node.text);
    };

    create_temporary_node(mousePoint: PointLike) {
        this.store_and_null_temporary_node();

        const new_id = this.get_max_id() + 1;
        const new_text = new Text("TEST_REMOVE_THIS", constants.DEFAULT_FONT);
        new_text.position.set(mousePoint.x, mousePoint.y);
        this.temporary_node = new GraphNode(new_id, new_text);

        this.viewport.addChild(this.temporary_node.text);
    }

    destroy_temporary_node() {
        // TODO: remove temporary node's text from viewport
    }

    private store_and_null_temporary_node() {
        if (this.temporary_node) {
            this.viewport.removeChild(this.temporary_node.text);
            this.add(this.temporary_node);
        }
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