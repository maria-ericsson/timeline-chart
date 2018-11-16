import { TimeGraphAxisScale } from "./time-graph-axis-scale";
import { TimeGraphContainer, TimeGraphContainerOptions } from "./time-graph-container";
import { TimeGraphRange } from "./time-graph-model";
import { TimeGraphStateController } from "./time-graph-state-controller";

export class TimeGraphAxis extends TimeGraphContainer {

    protected scaleComponent: TimeGraphAxisScale;

    constructor(protected canvasOpts: TimeGraphContainerOptions, protected range: TimeGraphRange, protected controller: TimeGraphStateController) {
        super({
            id: canvasOpts.id,
            height: canvasOpts.height,
            width: canvasOpts.width,
            backgroundColor: 0xAA30f0
        }, controller);

        this.init();
        this.controller.timeGraphInteraction.addMousewheelZoomAndPan(this.canvas);
    }

    init() {
        this.scaleComponent = new TimeGraphAxisScale(this.canvasOpts.id + '_scale', {
            height: 30,
            width: (this.range.end - this.range.start) * this._controller.zoomFactor,
            position: {
                x: this._controller.positionOffset.x,
                y: 0
            }
        }, this._controller.timeGraphInteraction);

        this.addChild(this.scaleComponent);
    }

    update() {
        this.scaleComponent.clear();
        this.scaleComponent.render();
    }
}