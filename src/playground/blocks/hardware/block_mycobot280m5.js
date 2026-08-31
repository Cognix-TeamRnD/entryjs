'use strict';

Entry.MyCobot280M5 = new (class MyCobot280M5 {
    constructor() {
        this.functionKeys = {
            SET_ANGLES: 'set_angles',
            HOME: 'home',
            SET_COORDS: 'set_coords',
            STOP: 'stop',
            GRIPPER_STATE: 'gripper_state',
            GRIPPER_VALUE: 'gripper_value',
        };

        this.id = ['6F.3'];
        this.url = '';
        this.imageName = 'mycobot280m5.png';

        this.title = {
            en: 'myCobot 280 M5',
            ko: '마이코봇 280 M5',
        };

        this.name = 'mycobot280m5';
        this.communicationType = 'manual';

        this.blockMenuBlocks = [
            'mycobot280m5_home',
            'mycobot280m5_stop',
            'mycobot280m5_set_angles',
            'mycobot280m5_set_coords',
            'mycobot280m5_gripper_open',
            'mycobot280m5_gripper_close',
        //  'mycobot280m5_set_gripper_value',
            'mycobot280m5_get_joint_angle',
            'mycobot280m5_get_coord',
        ];

        this.jointMenu = [
            ['1', '1'],
            ['2', '2'],
            ['3', '3'],
            ['4', '4'],
            ['5', '5'],
            ['6', '6'],
        ];

        this.moveModeMenu = [
            ['관절 이동', '0'],
            ['직선 이동', '1'],
        ];        

        this.coordMenu = [
            ['X', 'x'],
            ['Y', 'y'],
            ['Z', 'z'],
            ['RX', 'rx'],
            ['RY', 'ry'],
            ['RZ', 'rz'],
        ];        
    }

    setZero() {
        this.requestCommand(
            this.functionKeys.STOP,
            {
                time: Date.now(),
            }
        );
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
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    mycobot280m5_home:
                        '로봇팔을 기본 위치로 이동하기',

                    mycobot280m5_set_angles:
                        '관절 각도를 1번 %1 2번 %2 3번 %3 4번 %4 5번 %5 6번 %6 도로 속도 %7 으로 움직이기',

                    mycobot280m5_set_coords:
                        '좌표 X %1 Y %2 Z %3 RX %4 RY %5 RZ %6 로 속도 %7 방식 %8 로 움직이기',                        

                    mycobot280m5_get_joint_angle:
                        '%1 번 관절의 현재 각도',
                        
                    mycobot280m5_get_coord:
                        '현재 %1 값',          

                    mycobot280m5_stop:
                        '로봇팔 움직임 정지하기',

                    mycobot280m5_gripper_open:
                        '그리퍼를 속도 %1 으로 열기',

                    mycobot280m5_gripper_close:
                        '그리퍼를 속도 %1 으로 닫기',

                    mycobot280m5_set_gripper_value:
                        '그리퍼 값을 %1 로 속도 %2 으로 정하기',
                },

                Helper: {
                    mycobot280m5_home:
                        '로봇팔의 모든 관절을 기본 위치인 0도로 이동합니다.',

                    mycobot280m5_set_angles:
                        '6개 관절의 각도를 지정하고 모든 관절을 동시에 움직입니다.',

                    mycobot280m5_set_coords:
                        '로봇팔을 지정한 X, Y, Z 위치와 RX, RY, RZ 자세로 이동합니다.',                        

                    mycobot280m5_get_joint_angle:
                        '선택한 관절의 현재 각도를 확인합니다.',        
                        
                    mycobot280m5_stop:
                        '현재 로봇팔의 움직임을 즉시 정지합니다.',
                },
            },

            en: {
                template: {
                    mycobot280m5_home:
                        'move robot arm to home position',

                    mycobot280m5_set_angles:
                        'move joints to J1 %1 J2 %2 J3 %3 J4 %4 J5 %5 J6 %6 degrees at speed %7',

                    mycobot280m5_set_coords:
                        'move to X %1 Y %2 Z %3 RX %4 RY %5 RZ %6 at speed %7 mode %8',

                    mycobot280m5_get_joint_angle:
                        'current angle of joint %1',

                    mycobot280m5_stop:
                        'stop robot arm movement',

                    mycobot280m5_gripper_open:
                        'open gripper at speed %1',

                    mycobot280m5_gripper_close:
                        'close gripper at speed %1',

                    mycobot280m5_set_gripper_value:
                        'set gripper value to %1 at speed %2',
                },

                Helper: {
                    mycobot280m5_home:
                        'Moves all robot joints to the default zero position.',

                    mycobot280m5_set_angles:
                        'Moves all six joints simultaneously to the specified angles.',

                    mycobot280m5_set_coords:
                        'Moves the robot arm to the specified coordinates.',

                    mycobot280m5_get_joint_angle:
                        'Gets the current angle of the selected joint.',

                    mycobot280m5_stop:
                        'Stops the current robot arm movement.',
                },
            },
        };
    }

    getBlocks = function () {
        return {
            // ---------------------------------------------------------
            // 관절 이동
            // ---------------------------------------------------------

            mycobot280m5_set_angles: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.mycobot280m5_set_angles,

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
                        value: 20,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],

                events: {},
                class: 'mycobot280m5_joint',
                isNotFor: ['mycobot280m5'],

                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['20'],
                        },
                        null,
                    ],
                    type: 'mycobot280m5_set_angles',
                },

                paramsKeyMap: {
                    ANGLE1: 0,
                    ANGLE2: 1,
                    ANGLE3: 2,
                    ANGLE4: 3,
                    ANGLE5: 4,
                    ANGLE6: 5,
                    SPEED: 6,
                },

                func: (sprite, script) => {
                    const angles = [];

                    for (let joint = 1; joint <= 6; joint += 1) {
                        let angle = script.getNumberValue(
                            `ANGLE${joint}`,
                            script
                        );

                        if (!Number.isFinite(angle)) {
                            angle = 0;
                        }

                        angle = Math.max(-180, Math.min(180, angle));
                        angles.push(angle);
                    }

                    let speed = script.getNumberValue(
                        'SPEED',
                        script
                    );

                    if (!Number.isFinite(speed)) {
                        speed = 20;
                    }

                    speed = Math.round(speed);
                    speed = Math.max(1, Math.min(100, speed));

                    this.requestCommand(
                        this.functionKeys.SET_ANGLES,
                        {
                            angle1: angles[0],
                            angle2: angles[1],
                            angle3: angles[2],
                            angle4: angles[3],
                            angle5: angles[4],
                            angle6: angles[5],
                            speed,
                            time: Date.now(),
                        }
                    );
                },
            },

            // ---------------------------------------------------------
            // 현재 관절 각도
            // ---------------------------------------------------------

            mycobot280m5_get_joint_angle: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine:
                    EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',

                skeleton: 'basic_string_field',
                statements: [],

                template:
                    Lang.template.mycobot280m5_get_joint_angle,

                params: [
                    {
                        type: 'Dropdown',
                        options: this.jointMenu,
                        value: '1',
                        fontSize: 11,
                        bgColor:
                            EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor:
                            EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],

                events: {},

                class: 'mycobot280m5_sensor',

                isNotFor: ['mycobot280m5'],

                def: {
                    params: ['1'],
                    type: 'mycobot280m5_get_joint_angle',
                },

                paramsKeyMap: {
                    JOINT: 0,
                },

                func: (sprite, script) => {
                    const joint = Number(
                        script.getField('JOINT', script)
                    );

                    const value =
                        Entry.hw.portData[`angle${joint}`];

                    if (
                        value === undefined ||
                        value === null
                    ) {
                        return 0;
                    }

                    return value;
                },
            },

            mycobot280m5_home: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.mycobot280m5_home,
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'mycobot280m5_control',
                isNotFor: ['mycobot280m5'],
                def: {
                    params: [null],
                    type: 'mycobot280m5_home',
                },
                paramsKeyMap: {},
                func: () => {
                    this.requestCommand(
                        this.functionKeys.HOME,
                        {
                            speed: 20,
                            time: Date.now(),
                        }
                    );
                },
            },            

            mycobot280m5_set_coords: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.mycobot280m5_set_coords,

                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 0 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 200 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 0 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 0 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 0 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 20 },

                    {
                        type: 'Dropdown',
                        options: this.moveModeMenu,
                        value: '0',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },

                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],

                events: {},
                class: 'mycobot280m5_coords',
                isNotFor: ['mycobot280m5'],

                def: {
                    params: [
                        { type: 'number', params: ['100'] },
                        { type: 'number', params: ['0'] },
                        { type: 'number', params: ['200'] },
                        { type: 'number', params: ['0'] },
                        { type: 'number', params: ['0'] },
                        { type: 'number', params: ['0'] },
                        { type: 'number', params: ['20'] },
                        '0',
                        null,
                    ],
                    type: 'mycobot280m5_set_coords',
                },

                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                    Z: 2,
                    RX: 3,
                    RY: 4,
                    RZ: 5,
                    SPEED: 6,
                    MODE: 7,
                },

                func: (sprite, script) => {
                    const x = script.getNumberValue('X', script);
                    const y = script.getNumberValue('Y', script);
                    const z = script.getNumberValue('Z', script);
                    const rx = script.getNumberValue('RX', script);
                    const ry = script.getNumberValue('RY', script);
                    const rz = script.getNumberValue('RZ', script);

                    let speed = script.getNumberValue('SPEED', script);
                    const mode = Number(script.getField('MODE', script));

                    speed = Math.round(speed);
                    speed = Math.max(1, Math.min(100, speed));

                    this.requestCommand(
                        this.functionKeys.SET_COORDS,
                        {
                            x,
                            y,
                            z,
                            rx,
                            ry,
                            rz,
                            speed,
                            mode,
                            time: Date.now(),
                        }
                    );
                },
            },     

            mycobot280m5_get_coord: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',

                skeleton: 'basic_string_field',
                statements: [],

                template: Lang.template.mycobot280m5_get_coord,

                params: [
                    {
                        type: 'Dropdown',
                        options: this.coordMenu,
                        value: 'x',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],

                events: {},
                class: 'mycobot280m5_sensor',
                isNotFor: ['mycobot280m5'],

                def: {
                    params: ['x'],
                    type: 'mycobot280m5_get_coord',
                },

                paramsKeyMap: {
                    COORD: 0,
                },

                func: (sprite, script) => {
                    const coord = script.getField('COORD', script);
                    const value = Entry.hw.portData[coord];

                    if (value === undefined || value === null) {
                        return 0;
                    }

                    return value;
                },
            },     

            mycobot280m5_gripper_open: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.mycobot280m5_gripper_open,

                params: [
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
                class: 'mycobot280m5_gripper',
                isNotFor: ['mycobot280m5'],

                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['50'],
                        },
                        null,
                    ],
                    type: 'mycobot280m5_gripper_open',
                },

                paramsKeyMap: {
                    SPEED: 0,
                },

                func: (sprite, script) => {
                    let speed = script.getNumberValue('SPEED', script);

                    speed = Math.round(speed);
                    speed = Math.max(0, Math.min(100, speed));

                    this.requestCommand(
                        this.functionKeys.GRIPPER_STATE,
                        {
                            state: 0,
                            speed,
                            time: Date.now(),
                        }
                    );
                },
            },

            mycobot280m5_gripper_close: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.mycobot280m5_gripper_close,

                params: [
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
                class: 'mycobot280m5_gripper',
                isNotFor: ['mycobot280m5'],

                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['50'],
                        },
                        null,
                    ],
                    type: 'mycobot280m5_gripper_close',
                },

                paramsKeyMap: {
                    SPEED: 0,
                },

                func: (sprite, script) => {
                    let speed = script.getNumberValue('SPEED', script);

                    speed = Math.round(speed);
                    speed = Math.max(0, Math.min(100, speed));

                    this.requestCommand(
                        this.functionKeys.GRIPPER_STATE,
                        {
                            state: 1,
                            speed,
                            time: Date.now(),
                        }
                    );
                },
            },

            mycobot280m5_set_gripper_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.mycobot280m5_set_gripper_value,

                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 100,
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
                class: 'mycobot280m5_gripper',
                isNotFor: ['mycobot280m5'],

                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['100'],
                        },
                        {
                            type: 'number',
                            params: ['50'],
                        },
                        null,
                    ],
                    type: 'mycobot280m5_set_gripper_value',
                },

                paramsKeyMap: {
                    VALUE: 0,
                    SPEED: 1,
                },

                func: (sprite, script) => {
                    let value = script.getNumberValue('VALUE', script);
                    let speed = script.getNumberValue('SPEED', script);

                    value = Math.round(value);
                    speed = Math.round(speed);

                    value = Math.max(0, Math.min(100, value));
                    speed = Math.max(0, Math.min(100, speed));

                    this.requestCommand(
                        this.functionKeys.GRIPPER_VALUE,
                        {
                            value,
                            speed,
                            time: Date.now(),
                        }
                    );
                },
            },

            mycobot280m5_stop: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',

                skeleton: 'basic',
                statements: [],

                template: Lang.template.mycobot280m5_stop,

                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],

                events: {},

                class: 'mycobot280m5_control',

                isNotFor: ['mycobot280m5'],

                def: {
                    params: [null],
                    type: 'mycobot280m5_stop',
                },

                paramsKeyMap: {},

                func: () => {
                    this.requestCommand(
                        this.functionKeys.STOP,
                        {
                            time: Date.now(),
                        }
                    );
                },
            },
        };
    };
})();

module.exports = Entry.MyCobot280M5;