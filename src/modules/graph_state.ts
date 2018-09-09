import { Text, PointLike, TextStyleOptions } from 'pixi.js';
import constants from '../constants';
import StatePersister from './state_persister';

export class JSONableGraphState {
    constructor(public nodes: Array<JSONableGraphNode>, public connections: Array<JSONableNodeConnection>) { }

    to_graph_state(viewport: Viewport): GraphState {
        const loaded_nodes: Array<GraphNode> = [];
        for (const node of this.nodes) {
            loaded_nodes.push(node.to_graph_node());
        }

        const loaded_connections: Array<NodeConnection> = [];
        for (const connection of this.connections) {
            loaded_connections.push(connection.to_node_connection());
        }

        return new GraphState(viewport, loaded_nodes, loaded_connections);

    }
}
export class GraphState {
    temporary_node: GraphNode | null = null;

    constructor(public viewport: Viewport, public nodes: Array<GraphNode> = [], public connections: Array<NodeConnection> = []) { };

    add(node: GraphNode) {
        this.nodes.push(node);
        this.viewport.addChild(node.text);

        new StatePersister().store_graph(this, "filename.json");
    };

    remove(nodeId: number) {
        this.nodes = this.nodes.filter(elem => elem.id !== nodeId);

        const removed_node = this.nodes.find(elem => elem.id !== nodeId);
        if (removed_node) this.viewport.removeChild(removed_node.text);
    };

    create_temporary_node(mouse_point: PointLike) {
        this.store_and_null_temporary_node();

        const new_id = this.get_max_id() + 1;
        const new_text = new Text("TEST_REMOVE_THIS", constants.DEFAULT_FONT);
        new_text.position.set(mouse_point.x, mouse_point.y);
        this.temporary_node = new GraphNode(new_id, new_text);

        this.viewport.addChild(this.temporary_node.text);
    }

    destroy_temporary_node() {
        // TODO: remove temporary node's text from viewport
    }

    store_and_null_temporary_node() {
        if (this.temporary_node == null) return;

        this.viewport.removeChild(this.temporary_node.text);
        this.add(this.temporary_node);
        this.temporary_node = null;
    }

    to_jsonanble_graph_state(): JSONableGraphState {
        const jsonable_nodes: Array<JSONableGraphNode> = [];
        for (const node of this.nodes) {
            jsonable_nodes.push(node.to_jsonable_graph_node());
        }

        const jsonable_connections: Array<JSONableNodeConnection> = [];
        for (const connection of this.connections) {
            jsonable_connections.push(connection.to_jsonable_node_connection());
        }

        return new JSONableGraphState(jsonable_nodes, jsonable_connections);
    }

    private get_max_id(): number {
        const ids: Array<number> = this.nodes.map((node) => node.id);
        return ids.length > 0 ? Math.max(...ids) : 0;
    }
}

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