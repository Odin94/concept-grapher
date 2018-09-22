import { Text, PointLike } from 'pixi.js';
import constants from '../../constants';
import { GraphNode, JSONableGraphNode } from './graph_node';
import { NodeConnection, JSONableNodeConnection } from './node_connection';

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

    clear() {
        for (const node of this.nodes) {
            this.viewport.removeChild(node.text);
        }
        this.nodes = [];

        for (const connection of this.connections) {
            this.viewport.removeChild(connection.text);
        }
        this.connections = [];
    }

    create_temporary_node(mouse_point: PointLike) {
        this.store_and_null_temporary_node();

        const new_id = this.get_max_id() + 1;
        const new_text = new Text("TEST_REMOVE_THIS", constants.DEFAULT_FONT);
        new_text.position.set(mouse_point.x, mouse_point.y);
        this.temporary_node = new GraphNode(new_id, new_text);

        this.viewport.addChild(this.temporary_node.text);
    };

    destroy_temporary_node() {
        if (this.temporary_node === null) return;

        this.viewport.removeChild(this.temporary_node.text);
        this.temporary_node = null;
    };

    // TODO: find a better name - store implies persistance, but this just "stores" to the in-memory graph
    store_and_null_temporary_node() {
        if (this.temporary_node === null) return;

        this.viewport.removeChild(this.temporary_node.text);
        this.add(this.temporary_node);
        this.temporary_node = null;
    };

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
    };

    private get_max_id(): number {
        const ids: Array<number> = this.nodes.map((node) => node.id);
        return ids.length > 0 ? Math.max(...ids) : 0;
    };
};

export class JSONableGraphState {
    constructor(public nodes: Array<JSONableGraphNode>, public connections: Array<JSONableNodeConnection>) { }

    to_graph_state(viewport: Viewport): GraphState {
        const loaded_nodes: Array<GraphNode> = [];
        for (const node of this.nodes) {
            const graph_node = node.to_graph_node(viewport);
            loaded_nodes.push(graph_node);
            viewport.addChild(graph_node.text);
        }

        const loaded_connections: Array<NodeConnection> = [];
        for (const connection of this.connections) {
            const node_connection = connection.to_node_connection()
            loaded_connections.push(node_connection);
            viewport.addChild(node_connection.text);
        }

        return new GraphState(viewport, loaded_nodes, loaded_connections);
    }
};