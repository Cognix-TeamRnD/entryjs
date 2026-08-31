'use strict';

Entry.CodingBoxV1 = new (class CodingBoxV1 {
    constructor() {
        this.functionKeys = {
            SET_LED: 'led',
            RGB: 'rgb',
            RESET: 'reset',
            SERVO: 'servo',
            TONE: 'tone',
            TONE_STOP: 'tone_stop',
            FAN: 'fan',
            MATRIX: 'matrix',
            MATRIX_PIXEL: 'matrix_pixel',
            MATRIX_CLEAR: 'matrix_clear',
        };

        // codingboxv1.json 임시 ID 6F0102 -> EntryJS device key 6F.2
        this.id = ['6F.2'];
        this.url = '';
        this.imageName = 'codingboxv1.png';
        this.title = {
            en: 'PLAYCODING BOX V1.0',
            ko: '플레이코딩 박스 V1.0',
        };
        this.name = 'codingboxv1';
        this.communicationType = 'manual';

        this.commandStatus = {};
        this.commandValue = {};

        this.blockMenuBlocks = [
            'codingboxv1_set_led',
            'codingboxv1_set_rgb',
            'codingboxv1_set_rgb_value',
            'codingboxv1_rgb_off',

            'codingboxv1_get_light',
            'codingboxv1_get_sound',
            'codingboxv1_get_gas',
            'codingboxv1_get_temperature',
            'codingboxv1_get_potentiometer',
            'codingboxv1_is_pir_detected',
            'codingboxv1_is_magnetic_detected',
            'codingboxv1_is_button_pressed',

            'codingboxv1_set_servo',
            'codingboxv1_play_note',
            'codingboxv1_stop_tone',

            // 팬은 펌웨어 확인 후 사용
            'codingboxv1_set_fan',
            'codingboxv1_fan_off',

            'codingboxv1_led_matrix',
            'codingboxv1_matrix_pixel',
            'codingboxv1_matrix_clear',

            'codingboxv1_convert_scale',
        ];

        this.ledColorMenu = [
            ['빨강', 'red'],
            ['초록', 'green'],
        ];

        this.ledStateMenu = [
            ['켜기', 'on'],
            ['끄기', 'off'],
        ];

        this.buttonMenu = [
            ['왼쪽', '1'],
            ['오른쪽', '2'],
        ];

        this.fanMenu = [
            ['정방향', 'forward'],
            ['역방향', 'reverse'],
        ];

        this.noteMenu = [
            ['도', '262'],
            ['레', '294'],
            ['미', '330'],
            ['파', '349'],
            ['솔', '392'],
            ['라', '440'],
            ['시', '494'],
            ['높은 도', '523'],
        ];

        this.beatMenu = [
            ['0.25', '0.25'],
            ['0.5', '0.5'],
            ['1', '1'],
            ['2', '2'],
            ['4', '4'],
        ];
    }

    setZero() {
        this.requestCommand(this.functionKeys.RESET, 0);
        this.commandStatus = {};
        this.commandValue = {};
    }

    requestCommand(type, payload) {
        Entry.hw.sendQueue = {
            type,
            payload,
        };
        Entry.hw.update();
    }

    afterReceive(portData) {
        if (!portData) {
            return;
        }

        if (!Entry.engine.isState('run')) {
            this.commandStatus = {};
        }
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    codingboxv1_set_led: '%1 LED를 %2',
                    codingboxv1_set_rgb: 'RGB LED를 %1 색으로 정하기',
                    codingboxv1_set_rgb_value: 'RGB LED를 빨강 %1 초록 %2 파랑 %3 로 정하기',
                    codingboxv1_rgb_off: 'RGB LED 끄기',                    

                    codingboxv1_get_light: '조도 센서 값',
                    codingboxv1_get_sound: '사운드 센서 값',
                    codingboxv1_get_gas: '가스 센서 값',
                    codingboxv1_get_temperature: '온도 센서 값',
                    codingboxv1_get_potentiometer: '가변저항 값',
                    codingboxv1_is_pir_detected: '인체가 감지되었는가?',
                    codingboxv1_is_magnetic_detected: '자석이 감지되었는가?',
                    codingboxv1_is_button_pressed: '%1 버튼이 눌렸는가?',

                    codingboxv1_set_servo: '서보 모터 각도를 %1 도로 정하기',
                    codingboxv1_play_note: '부저로 %1 음을 %2 박자 연주하기',
                    codingboxv1_stop_tone: '부저 소리 끄기',

                    codingboxv1_set_fan: '모터 팬을 %1 방향으로 %2 (0~150)속도로 회전하기',
                    codingboxv1_fan_off: '모터 팬 끄기',

                    codingboxv1_matrix_pattern: '도트매트릭스를 %1 %2 %3 %4 %5 %6 %7 %8 로 표시하기',
                    codingboxv1_matrix_pixel: '도트매트릭스 X %1 Y %2 점을 %3',
                    codingboxv1_matrix_clear: '도트매트릭스 끄기',
                    codingboxv1_led_matrix: '도트매트릭스에 %1 표시하기',

                    codingboxv1_convert_scale: '%1 을 %2 ~ %3 에서 %4 ~ %5 로 변환',
                },
                Helper: {
                    codingboxv1_set_led: '선택한 LED를 켜거나 끕니다.',
                    codingboxv1_set_rgb: 'RGB LED를 선택한 색으로 정합니다.',
                    codingboxv1_get_light: '조도 센서에서 측정한 밝기 값을 확인합니다.',
                    codingboxv1_get_sound: '사운드 센서에서 측정한 소리 값을 확인합니다.',
                    codingboxv1_get_gas: '가스 센서에서 측정한 값을 확인합니다.',
                    codingboxv1_get_temperature: 'LM35 온도 센서에서 측정한 온도를 섭씨(℃) 단위로 확인합니다.',
                    codingboxv1_get_potentiometer: '가변저항의 값을 확인합니다.',
                    codingboxv1_is_pir_detected: '인체감지 센서에서 움직임이 감지되었는지 확인합니다.',
                    codingboxv1_is_magnetic_detected: '자기 센서에 자석이 감지되었는지 확인합니다.',
                    codingboxv1_is_button_pressed: '선택한 버튼이 눌렸는지 확인합니다.',
                    codingboxv1_set_servo: '서보 모터의 각도를 지정한 각도로 정합니다.',
                    codingboxv1_play_note: '부저로 선택한 음을 지정한 박자 동안 연주합니다.',
                    codingboxv1_stop_tone: '현재 재생 중인 부저 소리를 끕니다.',
                    codingboxv1_set_fan: '모터 팬의 방향과 속도를 정합니다. 속도는 0~150이며, 1~49는 50으로 보정됩니다.',
                    codingboxv1_fan_off: '모터 팬의 작동을 멈춥니다.',
                    codingboxv1_matrix_pattern: '8개의 행 값을 이용해 8x8 도트매트릭스에 그림을 표시합니다.',
                    codingboxv1_matrix_pixel: '도트매트릭스의 지정한 점을 켜거나 끕니다.',
                    codingboxv1_matrix_clear: '도트매트릭스의 모든 LED를 끕니다.',
                },
            },
            en: {
                template: {
                    codingboxv1_set_led: 'set %1 LED to %2',
                    codingboxv1_set_rgb: 'set RGB LED to %1',
                    codingboxv1_set_rgb_value: 'set RGB LED red %1 green %2 blue %3',
                    codingboxv1_rgb_off: 'turn off RGB LED',

                    codingboxv1_get_light: 'light sensor value',
                    codingboxv1_get_sound: 'sound sensor value',
                    codingboxv1_get_gas: 'gas sensor value',
                    codingboxv1_get_temperature: 'temperature(℃)',
                    codingboxv1_get_potentiometer: 'potentiometer value',
                    codingboxv1_is_pir_detected: 'human detected?',
                    codingboxv1_is_magnetic_detected: 'magnet detected?',
                    codingboxv1_is_button_pressed: 'is button %1 pressed?',

                    codingboxv1_set_servo: 'set servo angle to %1 degrees',
                    codingboxv1_play_note: 'play note %1 for %2 beat(s)',
                    codingboxv1_stop_tone: 'stop buzzer sound',

                    codingboxv1_set_fan: 'turn motor fan %1 at speed %2',
                    codingboxv1_fan_off: 'turn off motor fan',

                    codingboxv1_matrix_pattern: 'show dot matrix rows %1 %2 %3 %4 %5 %6 %7 %8',
                    codingboxv1_matrix_pixel: 'set dot matrix X %1 Y %2 to %3',
                    codingboxv1_matrix_clear: 'clear dot matrix',

                    codingboxv1_convert_scale: 'map %1 from %2 ~ %3 to %4 ~ %5',
                },
                Helper: {
                    codingboxv1_set_led: 'Turns the selected LED on or off.',
                    codingboxv1_set_rgb: 'Sets the RGB LED to the selected color.',
                    codingboxv1_get_light: 'Gets the brightness value measured by the light sensor.',
                    codingboxv1_get_sound: 'Gets the sound level measured by the sound sensor.',
                    codingboxv1_get_gas: 'Gets the value measured by the gas sensor.',
                    codingboxv1_get_temperature: 'Gets the temperature measured by the LM35 sensor in degrees Celsius.',
                    codingboxv1_get_potentiometer: 'Gets the potentiometer value.',
                    codingboxv1_is_pir_detected: 'Checks whether motion is detected by the PIR sensor.',
                    codingboxv1_is_magnetic_detected: 'Checks whether a magnet is detected.',
                    codingboxv1_is_button_pressed: 'Checks whether the selected button is pressed.',
                    codingboxv1_set_servo: 'Sets the servo motor to the specified angle.',
                    codingboxv1_play_note: 'Plays the selected note on the buzzer for the specified number of beats.',
                    codingboxv1_stop_tone: 'Stops the buzzer sound.',
                    codingboxv1_set_fan: 'Sets the motor fan direction and speed from 0 to 150. Values from 1 to 49 are raised to 50.',
                    codingboxv1_fan_off: 'Stops the motor fan.',
                    codingboxv1_matrix_pattern: 'Displays an 8x8 pattern using eight hexadecimal row values.',
                    codingboxv1_matrix_pixel: 'Turns the selected dot matrix pixel on or off.',
                    codingboxv1_matrix_clear: 'Turns off all LEDs on the dot matrix.',
                },
            },
        };
    }

    getBlocks = function () {
        const hardwareColor = EntryStatic.colorSet.block.default.HARDWARE;
        const hardwareDark = EntryStatic.colorSet.block.darken.HARDWARE;
        const arrowColor = EntryStatic.colorSet.arrow.default.HARDWARE;

        return {
            codingboxv1_set_led: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv1_set_led,
                params: [
                    {
                        type: 'Dropdown',
                        options: this.ledColorMenu,
                        value: 'red',
                        fontSize: 11,
                        bgColor: hardwareDark,
                        arrowColor,
                    },
                    {
                        type: 'Dropdown',
                        options: this.ledStateMenu,
                        value: 'on',
                        fontSize: 11,
                        bgColor: hardwareDark,
                        arrowColor,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv1_output',
                isNotFor: ['codingboxv1'],
                def: {
                    params: ['red', 'on', null],
                    type: 'codingboxv1_set_led',
                },
                paramsKeyMap: {
                    COLOR: 0,
                    STATE: 1,
                },
                func: (sprite, script) => {
                    const color = script.getField('COLOR', script);
                    const state = script.getField('STATE', script);
                    this.requestCommand(this.functionKeys.SET_LED, `${color},${state}`);
                },
            },

            codingboxv1_set_rgb: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv1_set_rgb,
                params: [
                    { type: 'Color' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv1_output',
                isNotFor: ['codingboxv1'],
                def: {
                    params: ['#ff0000', null],
                    type: 'codingboxv1_set_rgb',
                },
                paramsKeyMap: {
                    COLOR: 0,
                },
                func: (sprite, script) => {
                    const color = script.getField('COLOR', script) || '#ff0000';
                    const red = parseInt(color.substring(1, 3), 16);
                    const green = parseInt(color.substring(3, 5), 16);
                    const blue = parseInt(color.substring(5, 7), 16);

                    this.requestCommand(this.functionKeys.RGB, `${red},${green},${blue}`);
                },
            },

            codingboxv1_set_rgb_value: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv1_set_rgb_value,

                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 255,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 0,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 0,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],

                events: {},
                class: 'codingboxv1_output',
                isNotFor: ['codingboxv1'],

                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['255'],
                        },
                        {
                            type: 'text',
                            params: ['0'],
                        },
                        {
                            type: 'text',
                            params: ['0'],
                        },
                        null,
                    ],
                    type: 'codingboxv1_set_rgb_value',
                },

                paramsKeyMap: {
                    RED: 0,
                    GREEN: 1,
                    BLUE: 2,
                },

                func: (sprite, script) => {
                    let red = script.getNumberValue('RED', script);
                    let green = script.getNumberValue('GREEN', script);
                    let blue = script.getNumberValue('BLUE', script);

                    red = Math.max(0, Math.min(255, red));
                    green = Math.max(0, Math.min(255, green));
                    blue = Math.max(0, Math.min(255, blue));

                    this.requestCommand(
                        this.functionKeys.RGB,
                        `${red},${green},${blue}`
                    );
                },
            },

            codingboxv1_rgb_off: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv1_rgb_off,

                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],

                events: {},
                class: 'codingboxv1_output',
                isNotFor: ['codingboxv1'],

                def: {
                    params: [null],
                    type: 'codingboxv1_rgb_off',
                },

                paramsKeyMap: {},

                func: () => {
                    this.requestCommand(
                        this.functionKeys.RGB,
                        '0,0,0'
                    );
                },
            },            

            codingboxv1_get_light: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv1_sensor',
                isNotFor: ['codingboxv1'],
                def: { type: 'codingboxv1_get_light' },
                paramsKeyMap: {},
                func: () => Entry.hw.portData.light || 0,
            },

            codingboxv1_get_sound: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv1_sensor',
                isNotFor: ['codingboxv1'],
                def: { type: 'codingboxv1_get_sound' },
                paramsKeyMap: {},
                func: () => Entry.hw.portData.sound || 0,
            },

            codingboxv1_get_gas: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv1_sensor',
                isNotFor: ['codingboxv1'],
                def: { type: 'codingboxv1_get_gas' },
                paramsKeyMap: {},
                func: () => Entry.hw.portData.gas || 0,
            },

            codingboxv1_get_temperature: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv1_sensor',
                isNotFor: ['codingboxv1'],
                def: { type: 'codingboxv1_get_temperature' },
                paramsKeyMap: {},
                func: () => Entry.hw.portData.temperature || 0,
            },

            codingboxv1_get_potentiometer: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv1_sensor',
                isNotFor: ['codingboxv1'],
                def: { type: 'codingboxv1_get_potentiometer' },
                paramsKeyMap: {},
                func: () => Entry.hw.portData.potentiometer || 0,
            },

            codingboxv1_is_pir_detected: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv1_sensor',
                isNotFor: ['codingboxv1'],
                def: { type: 'codingboxv1_is_pir_detected' },
                paramsKeyMap: {},
                func: () => Number(Entry.hw.portData.pir || 0) === 1,
            },

            codingboxv1_is_magnetic_detected: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv1_sensor',
                isNotFor: ['codingboxv1'],
                def: { type: 'codingboxv1_is_magnetic_detected' },
                paramsKeyMap: {},
                func: () => Number(Entry.hw.portData.magnetic || 0) === 1,
            },

            codingboxv1_is_button_pressed: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                template: Lang.template.codingboxv1_is_button_pressed,
                params: [
                    {
                        type: 'Dropdown',
                        options: this.buttonMenu,
                        value: '1',
                        fontSize: 11,
                        bgColor: hardwareDark,
                        arrowColor,
                    },
                ],
                events: {},
                class: 'codingboxv1_sensor',
                isNotFor: ['codingboxv1'],
                def: {
                    params: ['1'],
                    type: 'codingboxv1_is_button_pressed',
                },
                paramsKeyMap: {
                    BUTTON: 0,
                },
                func: (sprite, script) => {
                    const button = script.getField('BUTTON', script);
                    if (button === '2') {
                        return Number(Entry.hw.portData.button2 || 0) === 1;
                    }
                    return Number(Entry.hw.portData.button1 || 0) === 1;
                },
            },

            codingboxv1_set_servo: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 0,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv1_output',
                isNotFor: ['codingboxv1'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['0'],
                        },
                    ],
                    type: 'codingboxv1_set_servo',
                },
                paramsKeyMap: {
                    ANGLE: 0,
                },
                func: (sprite, script) => {
                    let angle = script.getNumberValue('ANGLE');
                    angle = Math.max(0, Math.min(180, angle));
                    this.requestCommand(this.functionKeys.SERVO, angle);
                },
            },

            codingboxv1_play_note: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv1_play_note,
                params: [
                    {
                        type: 'Dropdown',
                        options: this.noteMenu,
                        value: '262',
                        fontSize: 11,
                        bgColor: hardwareDark,
                        arrowColor,
                    },
                    {
                        type: 'Dropdown',
                        options: this.beatMenu,
                        value: '1',
                        fontSize: 11,
                        bgColor: hardwareDark,
                        arrowColor,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv1_output',
                isNotFor: ['codingboxv1'],
                def: {
                    params: ['262', '1', null],
                    type: 'codingboxv1_play_note',
                },
                paramsKeyMap: {
                    NOTE: 0,
                    BEAT: 1,
                },
                func: (sprite, script) => {
                    const note = script.getField('NOTE', script);
                    const beat = script.getField('BEAT', script);
                    this.requestCommand(this.functionKeys.TONE, `${note},${beat}`);
                },
            },

            codingboxv1_stop_tone: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv1_stop_tone,
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv1_output',
                isNotFor: ['codingboxv1'],
                def: {
                    params: [null],
                    type: 'codingboxv1_stop_tone',
                },
                paramsKeyMap: {},
                func: () => {
                    this.requestCommand(this.functionKeys.TONE_STOP, 0);
                },
            },

            codingboxv1_set_fan: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv1_set_fan,
                params: [
                    {
                        type: 'Dropdown',
                        options: this.fanMenu,
                        value: 'forward',
                        fontSize: 11,
                        bgColor: hardwareDark,
                        arrowColor,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 50,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv1_fan',
                isNotFor: ['codingboxv1'],
                def: {
                    params: [
                        'forward',
                        {
                            type: 'text',
                            params: ['50'],
                        },
                        null,
                    ],
                    type: 'codingboxv1_set_fan',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                    SPEED: 1,
                },
                func: (sprite, script) => {
                    const direction =
                        script.getField('DIRECTION', script) || 'forward';

                    let speed = Number(
                        script.getNumberValue('SPEED', script)
                    );

                    if (Number.isNaN(speed)) {
                        speed = 50;
                    }

                    speed = Math.max(0, Math.min(150, speed));

                    if (speed > 0 && speed < 50) {
                        speed = 50;
                    }

                    this.requestCommand(
                        this.functionKeys.FAN,
                        `${direction},${speed}`
                    );
                },
            },

            codingboxv1_fan_off: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv1_fan_off,
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv1_fan',
                isNotFor: ['codingboxv1'],
                def: {
                    params: [null],
                    type: 'codingboxv1_fan_off',
                },
                paramsKeyMap: {},
                func: () => {
                    this.requestCommand(this.functionKeys.FAN, 'off');
                },
            },

            codingboxv1_matrix_pattern: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv1_matrix_pattern,
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'text', value: 'FF' },
                    { type: 'Block', accept: 'string', defaultType: 'text', value: '81' },
                    { type: 'Block', accept: 'string', defaultType: 'text', value: '81' },
                    { type: 'Block', accept: 'string', defaultType: 'text', value: '81' },
                    { type: 'Block', accept: 'string', defaultType: 'text', value: '81' },
                    { type: 'Block', accept: 'string', defaultType: 'text', value: '81' },
                    { type: 'Block', accept: 'string', defaultType: 'text', value: '81' },
                    { type: 'Block', accept: 'string', defaultType: 'text', value: 'FF' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv1_matrix',
                isNotFor: ['codingboxv1'],
                def: {
                    params: [
                        { type: 'text', params: ['FF'] },
                        { type: 'text', params: ['81'] },
                        { type: 'text', params: ['81'] },
                        { type: 'text', params: ['81'] },
                        { type: 'text', params: ['81'] },
                        { type: 'text', params: ['81'] },
                        { type: 'text', params: ['81'] },
                        { type: 'text', params: ['FF'] },
                        null,
                    ],
                    type: 'codingboxv1_matrix_pattern',
                },
                paramsKeyMap: {
                    ROW1: 0,
                    ROW2: 1,
                    ROW3: 2,
                    ROW4: 3,
                    ROW5: 4,
                    ROW6: 5,
                    ROW7: 6,
                    ROW8: 7,
                },
                func: (sprite, script) => {
                    const rows = [];
                    for (let i = 1; i <= 8; i++) {
                        let row = script.getStringValue(`ROW${i}`) || '00';
                        row = row.trim().toUpperCase();
                        if (!/^[0-9A-F]{1,2}$/.test(row)) {
                            row = '00';
                        }
                        rows.push(row.padStart(2, '0'));
                    }
                    this.requestCommand(this.functionKeys.MATRIX, rows.join(','));
                },
            },

            codingboxv1_matrix_pixel: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv1_matrix_pixel,
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 0,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 0,
                    },
                    {
                        type: 'Dropdown',
                        options: this.ledStateMenu,
                        value: 'on',
                        fontSize: 11,
                        bgColor: hardwareDark,
                        arrowColor,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv1_matrix',
                isNotFor: ['codingboxv1'],
                def: {
                    params: [
                        { type: 'text', params: ['0'] },
                        { type: 'text', params: ['0'] },
                        'on',
                        null,
                    ],
                    type: 'codingboxv1_matrix_pixel',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                    STATE: 2,
                },
                func: (sprite, script) => {
                    let x = Math.round(script.getNumberValue('X'));
                    let y = Math.round(script.getNumberValue('Y'));
                    const state = script.getField('STATE', script);

                    x = Math.max(0, Math.min(7, x));
                    y = Math.max(0, Math.min(7, y));

                    this.requestCommand(
                        this.functionKeys.MATRIX_PIXEL,
                        `${x},${y},${state}`
                    );
                },
            },

            codingboxv1_matrix_clear: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv1_matrix_clear,
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv1_matrix',
                isNotFor: ['codingboxv1'],
                def: {
                    params: [null],
                    type: 'codingboxv1_matrix_clear',
                },
                paramsKeyMap: {},
                func: () => {
                    this.requestCommand(this.functionKeys.MATRIX_CLEAR, 0);
                },
            },

            codingboxv1_led_matrix: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],

                params: [
                    {
                        type: 'Led8',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],

                events: {},

                def: {
                    type: 'codingboxv1_led_matrix',
                    params: [
                        [
                            [0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0],
                        ],
                        null,
                    ],
                },

                paramsKeyMap: {
                    VALUE: 0,
                },

                class: 'codingboxv1_matrix',
                isNotFor: ['codingboxv1'],

                func: (sprite, script) => {
                    const fieldValue = script.getField('VALUE', script);
                    const matrix = fieldValue?.params || fieldValue;

                    console.log('[LED MATRIX]', matrix);

                    if (!Array.isArray(matrix)) {
                        return script.callReturn();
                    }

                    const rows = [];

                    for (let y = 0; y < 8; y++) {
                        const sourceY = 7 - y;
                        const row = Array.isArray(matrix[sourceY]) ? matrix[sourceY] : [];
                        let byteValue = 0;

                        for (let x = 0; x < 8; x++) {
                            if (Number(row[x]) > 0) {
                                byteValue |= 1 << x;
                            }
                        }

                        rows.push(
                            byteValue
                                .toString(16)
                                .toUpperCase()
                                .padStart(2, '0')
                        );
                    }

                    this.requestCommand(
                        this.functionKeys.MATRIX,
                        rows.join(',')
                    );

                    return script.callReturn();
                },
            },

            codingboxv1_convert_scale: {
                color: hardwareColor,
                outerLine: hardwareDark,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: Lang.template.codingboxv1_convert_scale,

                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 0,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 0,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 1023,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 0,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 180,
                    },
                ],

                events: {},
                class: 'codingboxv1_util',
                isNotFor: ['codingboxv1'],

                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['0'],
                        },
                        {
                            type: 'text',
                            params: ['0'],
                        },
                        {
                            type: 'text',
                            params: ['1023'],
                        },
                        {
                            type: 'text',
                            params: ['0'],
                        },
                        {
                            type: 'text',
                            params: ['180'],
                        },
                    ],
                    type: 'codingboxv1_convert_scale',
                },

                paramsKeyMap: {
                    VALUE: 0,
                    IN_MIN: 1,
                    IN_MAX: 2,
                    OUT_MIN: 3,
                    OUT_MAX: 4,
                },

                func: (sprite, script) => {
                    const value = script.getNumberValue('VALUE', script);
                    const inMin = script.getNumberValue('IN_MIN', script);
                    const inMax = script.getNumberValue('IN_MAX', script);
                    const outMin = script.getNumberValue('OUT_MIN', script);
                    const outMax = script.getNumberValue('OUT_MAX', script);

                    if (inMin === inMax) {
                        return outMin;
                    }

                    const result =
                        ((value - inMin) * (outMax - outMin)) /
                            (inMax - inMin) +
                        outMin;

                    return Math.round(result);
                },
            },            
        };
    };
})();

module.exports = Entry.CodingBoxV1;
