import { PointLike } from 'pixi.js';
import constants from '../../constants';
import { GraphNode, JSONableGraphNode } from './graph_node';
import { NodeConnection, JSONableNodeConnection } from './node_connection';
import { zViewport, zText } from '../../classes_with_z_order';

export class GraphState {
    temporary_node: GraphNode | null = null;

    constructor(public viewport: zViewport, public nodes: Array<GraphNode> = [], public connections: Array<NodeConnection> = []) { }

    add_node(node: GraphNode) {
        this.nodes.push(node);
        node.add_to_viewport(this.viewport);

        this.viewport.update_draw_order();
    }

    add_connection(connection: NodeConnection) {
        this.write_to_graph_and_null_temporary_node();
        connection.update_connection_position(this);
        this.connections.push(connection);
        connection.add_to_viewport(this.viewport);

        this.viewport.update_draw_order();
    }

    remove_node(nodeId: number) {
        const removed_node = this.nodes.find(elem => elem.id === nodeId);

        if (removed_node) {
            this.connections = this.connections.filter(
                connection => connection.first_node_id !== removed_node.id || connection.second_node_id !== removed_node.id
            );

            removed_node.remove_from_viewport(this.viewport);
            this.nodes = this.nodes.filter(elem => elem.id !== nodeId);
        }
    }

    remove_connection(connection: NodeConnection) {
        const removed_connection = this.connections.find(
            elem => elem.first_node_id !== connection.first_node_id && elem.second_node_id !== connection.second_node_id
        );

        if (removed_connection) {
            removed_connection.remove_from_viewport(this.viewport);
            this.connections = this.connections.filter(
                elem => elem.first_node_id !== connection.first_node_id && elem.second_node_id !== connection.second_node_id
            );
        }
    }

    clear() {
        for (const node of this.nodes) {
            node.remove_from_viewport(this.viewport);
        }
        this.nodes = [];

        for (const connection of this.connections) {
            connection.remove_from_viewport(this.viewport);
        }
        this.connections = [];
    }

    create_temporary_node(mouse_point: PointLike) {
        this.write_to_graph_and_null_temporary_node();

        const new_id = this.get_max_id() + 1;
        const new_text = new zText("TEST_REMOVE_THIS", constants.DEFAULT_FONT, constants.NODE_Z_ORDER);
        new_text.position.set(mouse_point.x, mouse_point.y);
        this.temporary_node = new GraphNode(new_id, new_text);

        this.temporary_node.add_to_viewport(this.viewport);
    }

    destroy_temporary_node() {
        if (this.temporary_node === null) return;

        this.temporary_node.remove_from_viewport(this.viewport);
        this.temporary_node = null;
    }

    write_to_graph_and_null_temporary_node() {
        if (this.temporary_node === null) return;

        this.viewport.removeChild(this.temporary_node.text);
        this.add_node(this.temporary_node);
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

export class JSONableGraphState {
    constructor(public nodes: Array<JSONableGraphNode>, public connections: Array<JSONableNodeConnection>) { }

    to_graph_state(viewport: zViewport): GraphState {
        const loaded_nodes: Array<GraphNode> = [];
        for (const node of this.nodes) {
            const graph_node = node.to_graph_node();
            loaded_nodes.push(graph_node);
            graph_node.add_to_viewport(viewport);
        }

        const loaded_connections: Array<NodeConnection> = [];
        for (const connection of this.connections) {
            const node_connection = connection.to_node_connection(loaded_nodes)
            loaded_connections.push(node_connection);
            node_connection.add_to_viewport(viewport);
        }

        return new GraphState(viewport, loaded_nodes, loaded_connections);
    }
}