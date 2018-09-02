export default class MouseInput {
    constructor(public viewport: Viewport) {
        this.addMouseListeners();
    };

    private addMouseListeners() {
        this.viewport.on("clicked", (data: Viewport.ClickEventData) => {
            console.log(data);
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