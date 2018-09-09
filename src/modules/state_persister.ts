import { GraphState, JSONableGraphState } from "./graph_state";
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
        const json_graph = readFileSync(join(constants.GRAPH_STORAGE_PATH, filename));
        if (json_graph) {
            try {
                const jsonable_graph_state: JSONableGraphState = JSON.parse(json_graph.toString());
                return jsonable_graph_state.to_graph_state(viewport);
            } catch (err) {
                // TODO: display error?
                console.log(err);

                return null;
            }
        }

        // TODO: display error?
        return null;
    }
}

