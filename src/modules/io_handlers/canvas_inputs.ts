import { GraphNode } from '../graph/graph_node';
import { GraphWidget } from '../widgets/graph_widget';
import MouseEventHandler from './mouse_event_handler';

export default class CanvasInputs {
    private mouse_event_handler: MouseEventHandler;

    public temp_connection: { start_node: GraphNode, line: PIXI.Graphics } | null = null;
    public dragged_node: GraphNode | null = null;

    constructor(public viewport: Viewport, public graph_widget: GraphWidget) {
        this.mouse_event_handler = new MouseEventHandler(this);

    }
};