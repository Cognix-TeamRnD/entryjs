/*
 * PLAYCODING BOX V1.0 전용 8x8 LED 매트릭스 필드
 * LedPicker를 사용하지 않고 독립적인 8x8 클릭 UI를 생성합니다.
 */
'use strict';

const DEFAULT_LED_MATRIX_8X8 = Array.from({ length: 8 }, () =>
    Array(8).fill(0)
);

Entry.FieldLed8 = class FieldLed8 extends Entry.Field {
    constructor(content, blockView, index) {
        super(content, blockView, index);

        this._block = blockView.block;
        this._blockView = blockView;
        this.box = new Entry.BoxModel();
        this.svgGroup = null;

        this._contents = content;
        this._index = index;
        this._position = content.position;
        this.key = content.key;

        this._CONTENT_HEIGHT = 30;
        this._CONTENT_WIDTH = 38;

        this.setValue(this._normalizeMatrix(this.getValue()));
        this.renderStart();
    }

    _cloneDefaultMatrix() {
        return DEFAULT_LED_MATRIX_8X8.map((row) => row.slice());
    }

    _normalizeMatrix(value) {
        const source = value && value.params ? value.params : value;

        if (!Array.isArray(source)) {
            return this._cloneDefaultMatrix();
        }

        return Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) =>
                Number(source[row]?.[col]) > 0 ? 1 : 0
            )
        );
    }

    renderStart() {
        const width = this._CONTENT_WIDTH;
        const height = this._CONTENT_HEIGHT;

        if (this.svgGroup) {
            $(this.svgGroup).remove();
        }

        const { contentSvgGroup } = this._blockView;

        this.svgGroup = contentSvgGroup.elem('g', {
            class: 'entry-field-codingboxv1-led8',
        });

        let x = 0;
        let y = -height / 2;

        if (this._position) {
            x = this._position.x || 0;
            y = this._position.y || 0;
        }

        this._header = this.svgGroup.elem('rect', {
            x,
            y,
            width,
            height,
            rx: 2,
            ry: 2,
            fill: '#008380',
        });

        this._rect = Array.from({ length: 8 }, () => []);
        this.renderLed();

        this._arrow = this.svgGroup.elem('path', {
            d: `
                M ${width - 5.2} ${y + height / 2 - 1.2}
                L ${width - 7.7} ${y + height / 2 + 1.8}
                a 0.5 0.5 0 0 1 -0.8 0
                L ${width - 10.1} ${y + height / 2 - 1.2}
                A 0.5 0.5 0 0 1 ${width - 9.7} ${y + height / 2 - 2}
                h 4.9
                a 0.5 0.5 0 0 1 0.4 0.8
                z
            `,
            fill: '#ffffff',
            stroke: '#ffffff',
        });

        this._bindRenderOptions();

        this.box.set({
            x,
            y,
            width,
            height,
        });
    }

    renderLed() {
        const matrix = this._normalizeMatrix(this.getValue());
        const ledDistance = 3;
        const ledSize = 2.5;
        const startX = 3;
        const startY = -11;

        matrix.forEach((row, rowIndex) => {
            row.forEach((state, colIndex) => {
                if (this._rect[rowIndex][colIndex]) {
                    this._rect[rowIndex][colIndex].remove();
                }

                this._rect[rowIndex][colIndex] = this.svgGroup.elem('rect', {
                    x: startX + colIndex * ledDistance,
                    y: startY + rowIndex * ledDistance,
                    width: ledSize,
                    height: ledSize,
                    rx: 0.5,
                    ry: 0.5,
                    fill: state ? '#ffffff' : '#00b6b1',
                });
            });
        });
    }

    _attachDisposeEvent(func) {
        let action = func;

        if (!action) {
            action = (skipCommand) => {
                this.destroyOption(skipCommand);
                this._selectBlockView();
            };
        }

        this.disposeEvent = Entry.disposeEvent.attach(this, action);
    }

    renderOptions() {
        this.destroyOption();

        const matrix = this._normalizeMatrix(this.getValue());

        this.optionGroup = Entry.Dom('div', {
            class: 'entry-field-codingboxv1-led8-picker',
            parent: $('body'),
        });

        const $picker = $(this.optionGroup);

        $picker.css({
            position: 'absolute',
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 24px)',
            gridTemplateRows: 'repeat(8, 24px)',
            gap: '3px',
            padding: '12px',
            background: '#ffffff',
            border: '1px solid #d8d8d8',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            zIndex: 10000,
            userSelect: 'none',
        });

        const anchor = this.svgGroup?.node || this.svgGroup;
        const rect = anchor?.getBoundingClientRect
            ? anchor.getBoundingClientRect()
            : { left: 0, bottom: 0 };

        $picker.css({
            left: `${rect.left + window.scrollX}px`,
            top: `${rect.bottom + window.scrollY + 6}px`,
        });

        const updateCell = ($cell, state) => {
            $cell.css({
                width: '24px',
                height: '24px',
                padding: 0,
                border: '1px solid #008380',
                borderRadius: '4px',
                background: state ? '#00b6b1' : '#eef7f7',
                cursor: 'pointer',
                outline: 'none',
            });
        };

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const $cell = $('<button type="button"></button>');

                updateCell($cell, matrix[row][col]);

                $cell.on('mousedown touchstart', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    matrix[row][col] = matrix[row][col] ? 0 : 1;
                    updateCell($cell, matrix[row][col]);

                    this.applyValue(matrix);
                });

                $picker.append($cell);
            }
        }

        this._attachDisposeEvent();
        this.optionDomCreated();
    }

    applyValue(value) {
        const matrix = this._normalizeMatrix(value);

        this.setValue(matrix);
        this.renderLed();
    }

    destroyOption() {
        if (this.optionGroup) {
            $(this.optionGroup).off();
            $(this.optionGroup).remove();
            this.optionGroup = null;
        }

        super.destroyOption();
    }

    getContentWidth() {
        return this._CONTENT_WIDTH;
    }
};
