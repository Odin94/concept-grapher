import { GraphState } from "./graph_state";
import { writeFile, readFileSync } from 'fs';

export default class StatePersister {
    constructor() { };

    store_graph(graph: GraphState, filename: string) {
        const json_graph = graph.to_json();

        writeFile(filename, json_graph, err => {
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
        const json_graph = readFileSync(filename);
        if (json_graph) {
            return new GraphState(viewport);
        }

        // TODO: display error?
        return null;
    }
}

