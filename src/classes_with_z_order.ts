import { Text, TextStyleOptions, Graphics } from "pixi.js";
import * as Viewport from 'pixi-viewport';

export class zText extends Text {
    constructor(text?: string, style?: TextStyleOptions, public z_order?: number, canvas?: HTMLCanvasElement) {
        super(text, style, canvas);
    }
}

export class zGraphics extends Graphics {
    constructor(public z_order?: number, nativeLines?: boolean) {
        super(nativeLines);
    }
}

export class zViewport extends Viewport {
    constructor(options?: Viewport.Options) { super(options); }

    // TODO: make the z-order thing an interface implemented by all z-classes
    update_draw_order() {
        this.children.sort(function (a, b) {
            // @ts-ignore
            const a_order = a.z_order || 0;

            // @ts-ignore
            const b_order = b.z_order || 0;

            return a_order - b_order
        });
    }
}