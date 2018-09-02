export class GraphState {
    constructor(public nodes: Array<GraphNode>) { };

    add(node: GraphNode) {
        this.nodes.push(node);
    };

    remove(nodeId: string) {
        this.nodes = this.nodes.filter(elem => elem.id !== nodeId);
    }
}

export class GraphNode {
    constructor(public readonly id: string, public text: string, public color: string, public connections: Array<NodeConnection>) { };
}

export class NodeConnection {
    constructor(public readonly firstNodeId: string, public readonly secondNodeId: string, public text: string) { };
}