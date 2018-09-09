import { Text, PointLike } from 'pixi.js';
import constants from '../constants';
import StatePersister from './state_persister';

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

    to_json(): string {
        let json_graph = `{"nodes": [\n`;
        for (const node of this.nodes) {
            json_graph += `${node.to_json()},\n`;
        }
        if (this.nodes.length > 0) json_graph = json_graph.substring(0, json_graph.length - 2);  // remove trailing comma in json array
        json_graph += `\n],\n"connections": [\n`;

        for (const connection of this.connections) {
            json_graph += `${connection.to_json()},\n`;
        }
        if (this.connections.length > 0) json_graph = json_graph.substring(0, json_graph.length - 2);
        json_graph += "\n]}";

        return json_graph;
    }

    private get_max_id(): number {
        const ids: Array<number> = this.nodes.map((node) => node.id);
        return ids.length > 0 ? Math.max(...ids) : 0;
    }
}

export class GraphNode {
    constructor(public readonly id: number, public text: Text) { };

    to_json(): string {
        return JSON.stringify({
            id: this.id,
            text: this.text.text,
            x: this.text.x,
            y: this.text.y,
            style: {
                fontFamily: this.text.style.fontFamily,
                fontSize: this.text.style.fontSize,
                fill: this.text.style.fill
            }
        }, null, 2);
    }
}

export class NodeConnection {
    constructor(public readonly firstNodeId: number, public readonly secondNodeId: string, public text: Text) { };

    to_json(): string {
        return JSON.stringify({
            firstNodeId: this.firstNodeId,
            secondNodeId: this.secondNodeId,
            text: this.text.text,
            style: {
                fontFamily: this.text.style.fontFamily,
                fontSize: this.text.style.fontSize,
                fill: this.text.style.fill
            }
        }, null, 2);
    }
}