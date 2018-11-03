import { GraphState, JSONableGraphState } from "./graph/graph_state";
import { zViewport } from "../classes_with_z_order";

export class ActionStack {
    private stack_pointer: number;
    private state_stack: Array<JSONableGraphState> = [];

    constructor(states: Array<GraphState>) {
        for (const state of states) {
            this.push_state(state);
        }

        this.stack_pointer = this.state_stack.length - 1;
    }

    push_state(new_state: GraphState) {
        const jsonable_new_state = new_state.to_jsonanble_graph_state();

        // on push, discard all states later than current one
        this.state_stack.splice(this.stack_pointer + 1);

        this.state_stack.push(jsonable_new_state);
        this.stack_pointer = this.state_stack.length - 1;
    }

    get_state(viewport: zViewport): GraphState {
        return this.state_stack[this.stack_pointer].to_graph_state(viewport);
    }

    is_at_top(): boolean {
        return this.stack_pointer === this.state_stack.length - 1;
    }

    undo(viewport: zViewport): GraphState {
        this.stack_pointer = Math.max(this.stack_pointer - 1, 0);

        return this.state_stack[this.stack_pointer].to_graph_state(viewport);
    }

    redo(viewport: zViewport): GraphState {
        this.stack_pointer = Math.min(this.stack_pointer + 1, this.state_stack.length - 1);

        return this.state_stack[this.stack_pointer].to_graph_state(viewport);
    }
}