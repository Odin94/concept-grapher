import { GraphState, JSONableGraphState, JSONableGraphNode, JSONableNodeConnection } from "./graph_state";
import { writeFile, readFileSync } from 'fs';
import { join } from 'path';
import constants from "../constants";

export default class StatePersister {
    constructor() { };

    store_graph(graph: GraphState, filename: string) {
        const json_graph = JSON.stringify(graph.to_jsonanble_graph_state(), null, 2);

        writeFile(join(constants.GRAPH_STORAGE_PATH, filename), json_graph, err => {
            if (err) {
                console.log(err);
                // TODO: display that there was an error somewhere
            }
            else {
                // TODO: display that store was successful somewhere
            }
        });
    }

    load_graph(filename: string, viewport: Viewport): GraphState | null {
        try {
            const json_graph = JSON.parse(readFileSync(join(constants.GRAPH_STORAGE_PATH, filename)).toString());

            // TODO: find better way to transform plain json objects into class instances. Maybe https://github.com/typestack/class-transformer ?
            const jsonable_graph_state = new JSONableGraphState(
                json_graph.nodes.map(
                    (node: JSONableGraphNode) => new JSONableGraphNode(node.id, node.text, node.x, node.y, node.style)
                ),
                json_graph.connections.map(
                    (node: JSONableNodeConnection) => new JSONableNodeConnection(node.firstNodeId, node.secondNodeId, node.text, node.style)
                ));
            return jsonable_graph_state.to_graph_state(viewport);
        }
        catch (err) {
            // TODO: display error?
            console.log(err);

            return null;
        }
    }
}

