export default class MouseInput {
    mouseX = 0;
    mouseY = 0;

    constructor(public viewport: Viewport) {
        this.addMouseListeners();
    };

    private addMouseListeners() {
        this.viewport.on("clicked", (data: Viewport.ClickEventData) => {

        });

        this.viewport.on("pointerdown", (event: PIXI.interaction.InteractionEvent) => {
            // TODO: determine if we pointerdowned on open space. If not, prevent drag
            if (false) {
                this.viewport.pausePlugin("drag");
            }
        });

        this.viewport.on("pointerup", (event: PIXI.interaction.InteractionEvent) => {
            this.viewport.resumePlugin("drag");
        });
    }
}