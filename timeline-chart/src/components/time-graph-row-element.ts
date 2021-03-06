import { TimeGraphComponent, TimeGraphStyledRect, TimeGraphElementPosition } from "./time-graph-component";
import { TimeGraphRow } from "./time-graph-row";
import { TimelineChart } from "../time-graph-model";
import { FontController } from "../time-graph-font-controller";
import * as PIXI from "pixi.js-legacy";

export interface TimeGraphRowElementStyle {
    color?: number
    height?: number
    borderWidth?: number
    borderColor?: number
}

export class TimeGraphRowElement extends TimeGraphComponent {

    protected _height: number;
    protected _position: TimeGraphElementPosition;
    static fontController: FontController = new FontController();

    protected _options: TimeGraphStyledRect;

    constructor(
        id: string,
        protected _model: TimelineChart.TimeGraphRowElementModel,
        protected range: TimelineChart.TimeGraphRange,
        protected _row: TimeGraphRow,
        protected _style: TimeGraphRowElementStyle = { color: 0xfffa66, height: 14 },
        protected displayWidth: number,
        displayObject?: PIXI.Graphics
    ) {
        super(id, displayObject);
        this._height = _style.height || 14;
        this._position = {
            x: this.range.start,
            y: this._row.position.y + ((this.row.height - this._height) / 2)
        };
        // min width of a state should never be less than 1 (for visibility)
        const width = Math.max(1, this.range.end - this.range.start);
        this._options = {
            color: _style.color,
            height: this._height,
            position: this._position,
            width,
            displayWidth,
            borderRadius: 2,
            borderWidth: _style.borderWidth || 0,
            borderColor: _style.borderColor || 0x000000
        };
    }

    renderLabel() {
        if (!this._model.label) {
            return;
        }
        const fontName = TimeGraphRowElement.fontController.getFontName(this._options.color ? this._options.color : 0, this._options.height - 2);
        const textObj = new PIXI.BitmapText(this._model.label, { fontName: fontName ? fontName : TimeGraphRowElement.fontController.getDefaultFontName() });
        const textWidth = textObj.getLocalBounds().width;
        const position = {
            x: this._options.position.x + this._options.width < 0 ? this._options.position.x : Math.max(0, this._options.position.x),
            y: this._options.position.y
        }
        const displayWidth = this._options.displayWidth ? this._options.displayWidth : 0;
        const labelText = this._model.label;

        let textObjX = position.x + 0.5;
        const textObjY = position.y + 0.5;
        let displayLabel = "";

        if (displayWidth > textWidth) {
            textObjX = position.x + (displayWidth - textWidth) / 2;
            displayLabel = labelText;
        }
        else {
            const textScaler = displayWidth / textWidth;
            const index = Math.min(Math.floor(textScaler * labelText.length), labelText.length - 1)
            const partialLabel = labelText.substr(0, Math.max(index - 3, 0));
            if (partialLabel.length > 0) {
                displayLabel = partialLabel.concat("...");
            }
        }

        textObj.text = displayLabel;
        textObj.x = textObjX;
        textObj.y = textObjY;
        this.displayObject.addChild(textObj);
    }

    clearLabel() {
        this.displayObject.removeChildren();
    }

    get height(): number {
        return this._height;
    }

    get position(): TimeGraphElementPosition {
        return this._position;
    }

    get model(): TimelineChart.TimeGraphRowElementModel {
        return this._model;
    }

    get row(): TimeGraphRow {
        return this._row;
    }

    get style() {
        return this._style;
    }

    set style(style: TimeGraphRowElementStyle) {
        if (style.color !== undefined) {
            this._options.color = style.color;
        }
        if (style.height !== undefined) {
            this._options.height = style.height;
        }
        if (style.borderColor !== undefined) {
            this._options.borderColor = style.borderColor;
        }
        if (style.borderWidth !== undefined) {
            this._options.borderWidth = style.borderWidth;
        }
        this.update();
    }

    update(opts?: TimeGraphStyledRect) {
        if (opts) {
            this._options.position = opts.position;
            this._options.width = opts.width;
            this._options.displayWidth = opts.displayWidth;
        }
        super.update();
    }

    render() {
        this.rect(this._options);
        this.renderLabel();
    }

    clear() {
        this.clearLabel();
        super.clear()
    }
}
