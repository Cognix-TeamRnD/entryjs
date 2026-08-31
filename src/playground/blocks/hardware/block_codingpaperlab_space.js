'use strict';

Entry.CodingPaperLabSpace = new (class CodingPaperLabSpace {
    constructor() {
        this.id = ['FF.1', 'codingpaperlab_space'];
        this.name = 'codingpaperlab_space';
        this.url = '';
        this.imageName = 'codingpaperlab_space.png';
        this.title = {
            ko: '코딩 페이퍼 랩 - 우주',
            en: 'Coding Paper Lab - Space',
        };
        this.communicationType = 'manual';

        this.lastSensorRequest = {};

        this.stateMenu = [
            ['켜기', '1'],
            ['끄기', '0'],
        ];

        this.trafficLightColorMenu = [
            ['빨강', 'red'],
            ['노랑', 'yellow'],
            ['초록', 'green'],
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

        /*
         * 상황별 사용 핀
         *
         * 1. 로켓 발사
         * 버튼 D11 / 서보 D9 / LED 스트립 D6 / 부저 D3
         * 7세그먼트 CLK D4 / DIO D5
         *
         * 2. 블랙홀 전자석
         * 전자석 D10
         *
         * 3. 외계인 접근 경고
         * 근접 센서 D6 / 진동 D3 / LED 스트립 D9
         *
         * 4. 인공위성 제어
         * 조이스틱 A0 / 서보 D5
         *
         * 5. 별의 온도
         * DHT11 D3 / LED 스트립 D6
         *
         * 6. 우주선 공기질
         * MQ135 A0 / 빨강 D4 / 노랑 D3 / 초록 D2
         */
        this.blockMenuBlocks = [
            // 1. 로켓 발사
            'codingpaperlab_space_rocket_button',
            'codingpaperlab_space_rocket_servo',
            'codingpaperlab_space_rocket_led',
            'codingpaperlab_space_rocket_led_color',
            'codingpaperlab_space_rocket_led_clear',
            'codingpaperlab_space_rocket_buzzer',
            'codingpaperlab_space_rocket_buzzer_stop',
            'codingpaperlab_space_rocket_segment',
            'codingpaperlab_space_rocket_segment_clear',

            // 2. 블랙홀 전자석
            'codingpaperlab_space_blackhole_magnet',

            // 3. 외계인 접근 경고
            'codingpaperlab_space_alien_detected',
            'codingpaperlab_space_alien_vibration',
            'codingpaperlab_space_alien_led',
            'codingpaperlab_space_alien_led_color',
            'codingpaperlab_space_alien_led_clear',

            // 4. 인공위성 제어
            'codingpaperlab_space_satellite_joystick',
            'codingpaperlab_space_satellite_servo',

            // 5. 별의 온도
            'codingpaperlab_space_star_temperature',
            'codingpaperlab_space_star_humidity',
            'codingpaperlab_space_star_led',
            'codingpaperlab_space_star_led_color',
            'codingpaperlab_space_star_led_clear',

            // 6. 우주선 공기질
            'codingpaperlab_space_air_quality',
            'codingpaperlab_space_air_traffic_light',
        ];

        this.sensorWarmup = {};

        this.commandBuffer = [];
        this.commandFlushTimer = null;
        this.commandSequence = 0;
    }

    setZero() {
        /*
        * 아직 Entry-HW로 보내지 않은 일반 명령 제거
        */
        this.commandBuffer = [];

        if (this.commandFlushTimer) {
            clearTimeout(this.commandFlushTimer);
            this.commandFlushTimer = null;
        }

        this.commandSequence += 1;

        Entry.hw.sendQueue.COMMAND = {
            type: 'RESET',
            time: this.commandSequence,
        };

        if (Entry.hw.portData) {
            Entry.hw.portData[11] = 1;
            Entry.hw.portData.d11 = 1;
        }

        Entry.hw.update();

        this.lastSensorRequest = {};
        this.sensorWarmup = {};
    }

    requestCommand(command) {
        /*
        * Date.now()는 연속 블록에서 같은 값이 나올 수 있으므로
        * 증가 번호를 사용해 모든 명령을 구분한다.
        */
        this.commandSequence += 1;

        this.commandBuffer.push({
            ...command,
            time: this.commandSequence,
        });

        /*
        * 같은 실행 흐름에서 연속으로 발생한 명령들을 배열로 묶어서
        * Entry-HW에 한 번에 전달한다.
        */
        if (this.commandFlushTimer) {
            return;
        }

        this.commandFlushTimer = setTimeout(() => {
            const commands = this.commandBuffer.splice(0);

            this.commandFlushTimer = null;

            if (commands.length === 0) {
                return;
            }

            Entry.hw.sendQueue.COMMAND = commands;
            Entry.hw.update();
        }, 0);
    }

    requestSensor(key, command, interval = 100) {
        const now = Date.now();
        const lastTime = this.lastSensorRequest[key] || 0;

        if (now - lastTime < interval) {
            return;
        }

        this.lastSensorRequest[key] = now;
        this.requestCommand(command);
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    // 1. 로켓 발사
                    codingpaperlab_space_rocket_button:
                        '로켓 발사 버튼이 눌렸는가?',
                    codingpaperlab_space_rocket_servo:
                        '우주인 팔을 %1 도로 움직이기 %2',
                    codingpaperlab_space_rocket_led:
                        '로켓 LED를 R %1 G %2 B %3 로 정하기 %4',
                    codingpaperlab_space_rocket_led_color:
                        '로켓 LED를 %1 색으로 정하기 %2',
                    codingpaperlab_space_rocket_led_clear:
                        '로켓 LED 끄기 %1',
                    codingpaperlab_space_rocket_buzzer:
                        '로켓 부저로 %1 음을 %2 초 연주하기 %3',
                    codingpaperlab_space_rocket_buzzer_stop:
                        '로켓 부저 끄기 %1',
                    codingpaperlab_space_rocket_segment:
                        '카운트다운 표시기에 %1 표시하기 %2',
                    codingpaperlab_space_rocket_segment_clear:
                        '카운트다운 표시기 지우기 %1',

                    // 2. 블랙홀 전자석
                    codingpaperlab_space_blackhole_magnet:
                        '블랙홀 전자석을 %1 %2',

                    // 3. 외계인 접근 경고
                    codingpaperlab_space_alien_detected:
                        '외계인이 감지되었는가?',
                    codingpaperlab_space_alien_vibration:
                        '외계인 경고 진동을 %1 %2',
                    codingpaperlab_space_alien_led:
                        '외계인 경고등을 R %1 G %2 B %3 로 정하기 %4',
                    codingpaperlab_space_alien_led_color:
                        '외계인 경고등을 %1 색으로 정하기 %2',
                    codingpaperlab_space_alien_led_clear:
                        '외계인 경고등 끄기 %1',

                    // 4. 인공위성 제어
                    codingpaperlab_space_satellite_joystick:
                        '인공위성 조이스틱 값',
                    codingpaperlab_space_satellite_servo:
                        '인공위성 방향을 %1 도로 움직이기 %2',

                    // 5. 별의 온도
                    codingpaperlab_space_star_temperature:
                        '별의 온도(℃)',
                    codingpaperlab_space_star_humidity:
                        '별 주변의 습도(%)',
                    codingpaperlab_space_star_led:
                        '별빛을 R %1 G %2 B %3 로 정하기 %4',
                    codingpaperlab_space_star_led_color:
                        '별빛을 %1 색으로 정하기 %2',
                    codingpaperlab_space_star_led_clear:
                        '별빛 끄기 %1',

                    // 6. 우주선 공기질
                    codingpaperlab_space_air_quality:
                        '우주선 공기질 값',
                    codingpaperlab_space_air_traffic_light:
                        '공기질 신호등 %1을 %2 %3',
                },
                Device: {
                    codingpaperlab_space: '코딩 페이퍼 랩 - 우주',
                },
                Menus: {
                    codingpaperlab_space: '코딩 페이퍼 랩 - 우주',
                },
            },
            en: {
                template: {
                    // 1. Rocket launch
                    codingpaperlab_space_rocket_button:
                        'is the rocket launch button pressed?',
                    codingpaperlab_space_rocket_servo:
                        'move rocket engine servo to %1 degrees %2',
                    codingpaperlab_space_rocket_led:
                        'set rocket engine LED to R %1 G %2 B %3 %4',
                    codingpaperlab_space_rocket_led_color:
                        'set rocket engine LED to %1 %2',
                    codingpaperlab_space_rocket_led_clear:
                        'turn off rocket engine LED %1',
                    codingpaperlab_space_rocket_buzzer:
                        'play %1 on rocket buzzer for %2 seconds %3',
                    codingpaperlab_space_rocket_buzzer_stop:
                        'stop rocket buzzer %1',
                    codingpaperlab_space_rocket_segment:
                        'show %1 on countdown display %2',
                    codingpaperlab_space_rocket_segment_clear:
                        'clear countdown display %1',

                    // 2. Black hole magnet
                    codingpaperlab_space_blackhole_magnet:
                        'turn black hole magnet %1 %2',

                    // 3. Alien warning
                    codingpaperlab_space_alien_detected:
                        'is an alien detected?',
                    codingpaperlab_space_alien_vibration:
                        'turn alien warning vibration %1 %2',
                    codingpaperlab_space_alien_led:
                        'set alien warning light to R %1 G %2 B %3 %4',
                    codingpaperlab_space_alien_led_color:
                        'set alien warning light to %1 %2',
                    codingpaperlab_space_alien_led_clear:
                        'turn off alien warning light %1',

                    // 4. Satellite control
                    codingpaperlab_space_satellite_joystick:
                        'satellite joystick value',
                    codingpaperlab_space_satellite_servo:
                        'move satellite direction to %1 degrees %2',

                    // 5. Star temperature
                    codingpaperlab_space_star_temperature:
                        'star temperature (℃)',
                    codingpaperlab_space_star_humidity:
                        'humidity around star (%)',
                    codingpaperlab_space_star_led:
                        'set starlight to R %1 G %2 B %3 %4',
                    codingpaperlab_space_star_led_color:
                        'set starlight to %1 %2',
                    codingpaperlab_space_star_led_clear:
                        'turn off starlight %1',

                    // 6. Spacecraft air quality
                    codingpaperlab_space_air_quality:
                        'spacecraft air quality value',
                    codingpaperlab_space_air_traffic_light:
                        'turn %1 air quality light %2 %3',
                },
                Device: {
                    codingpaperlab_space: 'Coding Paper Lab - Space',
                },
                Menus: {
                    codingpaperlab_space: 'Coding Paper Lab - Space',
                },
            },
        };
    }

    getBlocks() {
        const color = EntryStatic.colorSet.block.default.HARDWARE;
        const outerLine = EntryStatic.colorSet.block.darken.HARDWARE;

        const indicator = {
            type: 'Indicator',
            img: 'block_icon/hardware_icon.svg',
            size: 12,
        };

        const dropdown = (options, value) => ({
            type: 'Dropdown',
            options,
            value,
            fontSize: 11,
            bgColor: outerLine,
            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        });

        const numberParam = {
            type: 'Block',
            accept: 'string',
            defaultType: 'number',
        };

        const numberBlock = (value) => ({
            type: 'number',
            params: [String(value)],
        });

        const colorParam = (value = '#ff0000') => ({
            type: 'Color',
            value,
        });

        const hexToRgb = (hex) => {
            const normalized = String(hex || '#000000').replace('#', '');
            const value = parseInt(normalized, 16);

            if (Number.isNaN(value)) {
                return { red: 0, green: 0, blue: 0 };
            }

            return {
                red: (value >> 16) & 255,
                green: (value >> 8) & 255,
                blue: value & 255,
            };
        };

        const clamp = (value, min, max) =>
            Math.max(min, Math.min(max, value));

        return {
            /*
             * ============================================================
             * 1. 로켓 발사
             * ============================================================
             */

            codingpaperlab_space_rocket_button: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                template: Lang.template.codingpaperlab_space_rocket_button,
                params: [],
                events: {},
                def: {
                    params: [],
                    type: 'codingpaperlab_space_rocket_button',
                },
                class: 'codingpaperlab_space_rocket',
                isNotFor: ['codingpaperlab_space'],
                func: () => {
                    const now = Date.now();

                    this.requestSensor(
                        'rocket_button',
                        {
                            type: 'DIGITAL_READ',
                            pin: 11,
                            pullup: 1,
                        },
                        50
                    );

                    // 시작 직후 이전 LOW값 오인식 방지
                    if (!this.sensorWarmup.rocketButton) {
                        this.sensorWarmup.rocketButton = now;
                        return false;
                    }

                    if (now - this.sensorWarmup.rocketButton < 200) {
                        return false;
                    }

                    return Number(Entry.hw.portData.d11) === 0;
                },
            },

            codingpaperlab_space_rocket_servo: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingpaperlab_space_rocket_servo,
                params: [numberParam, indicator],
                events: {},
                def: {
                    params: [numberBlock(0), null],
                    type: 'codingpaperlab_space_rocket_servo',
                },
                paramsKeyMap: { ANGLE: 0 },
                class: 'codingpaperlab_space_rocket',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    const angle = clamp(
                        script.getNumberValue('ANGLE', script),
                        0,
                        180
                    );

                    this.requestCommand({
                        type: 'SERVO',
                        pin: 9,
                        angle,
                    });

                    return script.callReturn();
                },
            },

            codingpaperlab_space_rocket_led: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingpaperlab_space_rocket_led,
                params: [numberParam, numberParam, numberParam, indicator],
                events: {},
                def: {
                    params: [
                        numberBlock(255),
                        numberBlock(0),
                        numberBlock(0),
                        null,
                    ],
                    type: 'codingpaperlab_space_rocket_led',
                },
                paramsKeyMap: {
                    RED: 0,
                    GREEN: 1,
                    BLUE: 2,
                },
                class: 'codingpaperlab_space_rocket',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    this.requestCommand({
                        type: 'NEOPIXEL',
                        pin: 6,
                        count: 6,
                        red: clamp(
                            script.getNumberValue('RED', script),
                            0,
                            255
                        ),
                        green: clamp(
                            script.getNumberValue('GREEN', script),
                            0,
                            255
                        ),
                        blue: clamp(
                            script.getNumberValue('BLUE', script),
                            0,
                            255
                        ),
                    });

                    return script.callReturn();
                },
            },


            codingpaperlab_space_rocket_led_color: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingpaperlab_space_rocket_led_color,
                params: [colorParam('#ff0000'), indicator],
                events: {},
                def: {
                    params: ['#ff0000', null],
                    type: 'codingpaperlab_space_rocket_led_color',
                },
                paramsKeyMap: { COLOR: 0 },
                class: 'codingpaperlab_space_rocket',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    const rgb = hexToRgb(script.getField('COLOR', script));

                    this.requestCommand({
                        type: 'NEOPIXEL',
                        pin: 6,
                        count: 6,
                        red: rgb.red,
                        green: rgb.green,
                        blue: rgb.blue,
                    });

                    return script.callReturn();
                },
            },

            codingpaperlab_space_rocket_led_clear: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingpaperlab_space_rocket_led_clear,
                params: [indicator],
                events: {},
                def: {
                    params: [null],
                    type: 'codingpaperlab_space_rocket_led_clear',
                },
                class: 'codingpaperlab_space_rocket',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    this.requestCommand({
                        type: 'NEOPIXEL_CLEAR',
                        pin: 6,
                        count: 6,
                    });

                    return script.callReturn();
                },
            },

            codingpaperlab_space_rocket_buzzer: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingpaperlab_space_rocket_buzzer,
                params: [
                    dropdown(this.noteMenu, '262'),
                    numberParam,
                    indicator,
                ],
                events: {},
                def: {
                    params: ['262', numberBlock(0.5), null],
                    type: 'codingpaperlab_space_rocket_buzzer',
                },
                paramsKeyMap: {
                    NOTE: 0,
                    SECOND: 1,
                },
                class: 'codingpaperlab_space_rocket',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    const seconds = Math.max(
                        0,
                        script.getNumberValue('SECOND', script)
                    );

                    this.requestCommand({
                        type: 'TONE',
                        pin: 3,
                        frequency: Number(
                            script.getField('NOTE', script)
                        ),
                        duration: Math.round(seconds * 1000),
                    });

                    return script.callReturn();
                },
            },

            codingpaperlab_space_rocket_buzzer_stop: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_rocket_buzzer_stop,
                params: [indicator],
                events: {},
                def: {
                    params: [null],
                    type: 'codingpaperlab_space_rocket_buzzer_stop',
                },
                class: 'codingpaperlab_space_rocket',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    this.requestCommand({
                        type: 'NO_TONE',
                        pin: 3,
                    });

                    return script.callReturn();
                },
            },

            codingpaperlab_space_rocket_segment: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingpaperlab_space_rocket_segment,
                params: [numberParam, indicator],
                events: {},
                def: {
                    params: [numberBlock(5), null],
                    type: 'codingpaperlab_space_rocket_segment',
                },
                paramsKeyMap: { NUMBER: 0 },
                class: 'codingpaperlab_space_rocket',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    this.requestCommand({
                        type: 'SEGMENT',
                        clk: 4,
                        dio: 5,
                        number: Math.round(
                            script.getNumberValue('NUMBER', script)
                        ),
                    });

                    return script.callReturn();
                },
            },

            codingpaperlab_space_rocket_segment_clear: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_rocket_segment_clear,
                params: [indicator],
                events: {},
                def: {
                    params: [null],
                    type: 'codingpaperlab_space_rocket_segment_clear',
                },
                class: 'codingpaperlab_space_rocket',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    this.requestCommand({
                        type: 'SEGMENT_CLEAR',
                        clk: 4,
                        dio: 5,
                    });

                    return script.callReturn();
                },
            },

            /*
             * ============================================================
             * 2. 블랙홀 전자석
             * ============================================================
             */

            codingpaperlab_space_blackhole_magnet: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_blackhole_magnet,
                params: [
                    dropdown(this.stateMenu, '1'),
                    indicator,
                ],
                events: {},
                def: {
                    params: ['1', null],
                    type: 'codingpaperlab_space_blackhole_magnet',
                },
                paramsKeyMap: { STATE: 0 },
                class: 'codingpaperlab_space_blackhole',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    this.requestCommand({
                        type: 'DIGITAL_WRITE',
                        pin: 10,
                        value: Number(
                            script.getField('STATE', script)
                        ),
                    });

                    return script.callReturn();
                },
            },

            /*
             * ============================================================
             * 3. 외계인 접근 경고
             * ============================================================
             */

            codingpaperlab_space_alien_detected: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_alien_detected,
                params: [],
                events: {},
                def: {
                    params: [],
                    type: 'codingpaperlab_space_alien_detected',
                },
                class: 'codingpaperlab_space_alien',
                isNotFor: ['codingpaperlab_space'],
                func: () => {
                    this.requestSensor('alien_proximity', {
                        type: 'DIGITAL_READ',
                        pin: 6,
                        pullup: 0,
                    });

                    /*
                     * 사용 중인 근접 센서는 Active Low
                     * 감지됨 = LOW(0)
                     */
                    return Number(Entry.hw.portData.d6) === 0;
                },
            },

            codingpaperlab_space_alien_vibration: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_alien_vibration,
                params: [
                    dropdown(this.stateMenu, '1'),
                    indicator,
                ],
                events: {},
                def: {
                    params: ['1', null],
                    type: 'codingpaperlab_space_alien_vibration',
                },
                paramsKeyMap: { STATE: 0 },
                class: 'codingpaperlab_space_alien',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    this.requestCommand({
                        type: 'DIGITAL_WRITE',
                        pin: 3,
                        value: Number(
                            script.getField('STATE', script)
                        ),
                    });

                    return script.callReturn();
                },
            },

            codingpaperlab_space_alien_led: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingpaperlab_space_alien_led,
                params: [numberParam, numberParam, numberParam, indicator],
                events: {},
                def: {
                    params: [
                        numberBlock(255),
                        numberBlock(0),
                        numberBlock(0),
                        null,
                    ],
                    type: 'codingpaperlab_space_alien_led',
                },
                paramsKeyMap: {
                    RED: 0,
                    GREEN: 1,
                    BLUE: 2,
                },
                class: 'codingpaperlab_space_alien',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    this.requestCommand({
                        type: 'NEOPIXEL',
                        pin: 9,
                        count: 6,
                        red: clamp(
                            script.getNumberValue('RED', script),
                            0,
                            255
                        ),
                        green: clamp(
                            script.getNumberValue('GREEN', script),
                            0,
                            255
                        ),
                        blue: clamp(
                            script.getNumberValue('BLUE', script),
                            0,
                            255
                        ),
                    });

                    return script.callReturn();
                },
            },


            codingpaperlab_space_alien_led_color: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingpaperlab_space_alien_led_color,
                params: [colorParam('#ff0000'), indicator],
                events: {},
                def: {
                    params: ['#ff0000', null],
                    type: 'codingpaperlab_space_alien_led_color',
                },
                paramsKeyMap: { COLOR: 0 },
                class: 'codingpaperlab_space_alien',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    const rgb = hexToRgb(script.getField('COLOR', script));

                    this.requestCommand({
                        type: 'NEOPIXEL',
                        pin: 9,
                        count: 6,
                        red: rgb.red,
                        green: rgb.green,
                        blue: rgb.blue,
                    });

                    return script.callReturn();
                },
            },

            codingpaperlab_space_alien_led_clear: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_alien_led_clear,
                params: [indicator],
                events: {},
                def: {
                    params: [null],
                    type: 'codingpaperlab_space_alien_led_clear',
                },
                class: 'codingpaperlab_space_alien',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    this.requestCommand({
                        type: 'NEOPIXEL_CLEAR',
                        pin: 9,
                        count: 6,
                    });

                    return script.callReturn();
                },
            },

            /*
             * ============================================================
             * 4. 인공위성 제어
             * ============================================================
             */

            codingpaperlab_space_satellite_joystick: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_satellite_joystick,
                params: [],
                events: {},
                def: {
                    params: [],
                    type: 'codingpaperlab_space_satellite_joystick',
                },
                class: 'codingpaperlab_space_satellite',
                isNotFor: ['codingpaperlab_space'],
                func: () => {
                    return Number(Entry.hw.portData.a0) || 0;
                },
            },

            codingpaperlab_space_satellite_servo: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_satellite_servo,
                params: [numberParam, indicator],
                events: {},
                def: {
                    params: [numberBlock(90), null],
                    type: 'codingpaperlab_space_satellite_servo',
                },
                paramsKeyMap: { ANGLE: 0 },
                class: 'codingpaperlab_space_satellite',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    const angle = clamp(
                        script.getNumberValue('ANGLE', script),
                        0,
                        180
                    );

                    this.requestCommand({
                        type: 'SERVO',
                        pin: 5,
                        angle,
                    });

                    return script.callReturn();
                },
            },

            /*
             * ============================================================
             * 5. 별의 온도
             * ============================================================
             */

            codingpaperlab_space_star_temperature: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_star_temperature,
                params: [],
                events: {},
                def: {
                    params: [],
                    type: 'codingpaperlab_space_star_temperature',
                },
                class: 'codingpaperlab_space_star',
                isNotFor: ['codingpaperlab_space'],
                func: () => {
                    this.requestSensor(
                        'star_dht',
                        {
                            type: 'DHT_READ',
                            pin: 3,
                        },
                        500
                    );

                    return Entry.hw.portData.temperature || 0;
                },
            },

            codingpaperlab_space_star_humidity: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_star_humidity,
                params: [],
                events: {},
                def: {
                    params: [],
                    type: 'codingpaperlab_space_star_humidity',
                },
                class: 'codingpaperlab_space_star',
                isNotFor: ['codingpaperlab_space'],
                func: () => {
                    this.requestSensor(
                        'star_dht',
                        {
                            type: 'DHT_READ',
                            pin: 3,
                        },
                        500
                    );

                    return Entry.hw.portData.humidity || 0;
                },
            },

            codingpaperlab_space_star_led: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingpaperlab_space_star_led,
                params: [numberParam, numberParam, numberParam, indicator],
                events: {},
                def: {
                    params: [
                        numberBlock(255),
                        numberBlock(0),
                        numberBlock(0),
                        null,
                    ],
                    type: 'codingpaperlab_space_star_led',
                },
                paramsKeyMap: {
                    RED: 0,
                    GREEN: 1,
                    BLUE: 2,
                },
                class: 'codingpaperlab_space_star',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    this.requestCommand({
                        type: 'NEOPIXEL',
                        pin: 6,
                        count: 6,
                        red: clamp(
                            script.getNumberValue('RED', script),
                            0,
                            255
                        ),
                        green: clamp(
                            script.getNumberValue('GREEN', script),
                            0,
                            255
                        ),
                        blue: clamp(
                            script.getNumberValue('BLUE', script),
                            0,
                            255
                        ),
                    });

                    return script.callReturn();
                },
            },


            codingpaperlab_space_star_led_color: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingpaperlab_space_star_led_color,
                params: [colorParam('#ff0000'), indicator],
                events: {},
                def: {
                    params: ['#ff0000', null],
                    type: 'codingpaperlab_space_star_led_color',
                },
                paramsKeyMap: { COLOR: 0 },
                class: 'codingpaperlab_space_star',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    const rgb = hexToRgb(script.getField('COLOR', script));

                    this.requestCommand({
                        type: 'NEOPIXEL',
                        pin: 6,
                        count: 6,
                        red: rgb.red,
                        green: rgb.green,
                        blue: rgb.blue,
                    });

                    return script.callReturn();
                },
            },

            codingpaperlab_space_star_led_clear: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_star_led_clear,
                params: [indicator],
                events: {},
                def: {
                    params: [null],
                    type: 'codingpaperlab_space_star_led_clear',
                },
                class: 'codingpaperlab_space_star',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    this.requestCommand({
                        type: 'NEOPIXEL_CLEAR',
                        pin: 6,
                        count: 6,
                    });

                    return script.callReturn();
                },
            },

            /*
             * ============================================================
             * 6. 우주선 공기질
             * ============================================================
             */

            codingpaperlab_space_air_quality: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_air_quality,
                params: [],
                events: {},
                def: {
                    params: [],
                    type: 'codingpaperlab_space_air_quality',
                },
                class: 'codingpaperlab_space_air',
                isNotFor: ['codingpaperlab_space'],
                func: () => {
                    this.requestSensor('air_quality', {
                        type: 'ANALOG_READ',
                        pin: 0,
                    });

                    return Entry.hw.portData.a0 || 0;
                },
            },

            codingpaperlab_space_air_traffic_light: {
                color,
                outerLine,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template:
                    Lang.template.codingpaperlab_space_air_traffic_light,
                params: [
                    dropdown(this.trafficLightColorMenu, 'red'),
                    dropdown(this.stateMenu, '1'),
                    indicator,
                ],
                events: {},
                def: {
                    params: ['red', '1', null],
                    type: 'codingpaperlab_space_air_traffic_light',
                },
                paramsKeyMap: {
                    COLOR: 0,
                    STATE: 1,
                },
                class: 'codingpaperlab_space_air',
                isNotFor: ['codingpaperlab_space'],
                func: (sprite, script) => {
                    const selectedColor =
                        script.getField('COLOR', script);
                    const state = Number(
                        script.getField('STATE', script)
                    );

                    const pinMap = {
                        red: 4,
                        yellow: 3,
                        green: 2,
                    };

                    this.requestCommand({
                        type: 'DIGITAL_WRITE',
                        pin: pinMap[selectedColor],
                        value: state,
                    });

                    return script.callReturn();
                },
            }
        };
    }
})();

module.exports = Entry.CodingPaperLabSpace;
