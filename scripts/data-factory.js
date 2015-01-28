// The implementation as of mid July 2014 not very efficient, though it should
// be sufficient for small data packages. For bigger data packages it is would
// be better to manipulate `Uint8Array` objects directly, at the expense of user
// friendlyness of the API.

/*jslint browser: true, node: true, maxerr: 50, maxlen: 80 */

/*global define, ArrayBuffer, Uint8Array */

define(['./util'], function (util) {
    'use strict';

    var create, createByte, createWord, createDword, createWstring,
        internalProto = {};

    internalProto.setLittleEndian = function (offs, value, nBytes) {
        var i;
        for (i = 0; i < nBytes; i += 1) {
            /*jslint bitwise: true */
            this.arr[offs + i] = (value >> (8 * i)) & 0xff;
            /*jslint bitwise: false */
        }
    };

    internalProto.getLittleEndian = function (offs, nBytes) {
        var i, value = 0;
        for (i = 0; i < nBytes; i += 1) {
            /*jslint bitwise: true */
            value += this.arr[offs + i] << (8 * i);
            /*jslint bitwise: false */
        }
        return value;
    };

    internalProto.appendDword = function (value) {
        this.setLittleEndian(this.arr.length, value, 4);
    };

    internalProto.appendWord = function (value) {
        this.setLittleEndian(this.arr.length, value, 2);
    };

    internalProto.getByte = function (offs) {
        return this.arr[offs];
    };

    internalProto.getWord = function (offs) {
        return this.getLittleEndian(offs, 2);
    };

    internalProto.getDword = function (offs) {
        return this.getLittleEndian(offs, 4);
    };

    internalProto.appendData = function (data) {
        Array.prototype.push.apply(this.arr, data.byteArray);
    };

    internalProto.slice = function (offs, end) {
        return create(this.arr.slice(offs, end));
    };

    internalProto.setByte = function (offs, value) {
        this.arr[offs] = value;
    };

    internalProto.appendByte = function (value) {
        this.setByte(this.arr.length, value);
    };

    internalProto.appendWchar = function (character) {
        // As described in "PIMA 15740:2000", characters are encoded in PTP as
        // ISO10646 2-byte characters.
        this.appendWord(character.charCodeAt(0));
    };

    internalProto.getWchar = function (offs) {
        return String.fromCharCode(this.getWord(offs));
    };

    // String will be null terminated. Result is undefined if string is too
    // long to be stored in the first byte.
    internalProto.appendWstring = function (string) {
        var i, lengthWithNull = string.length + 1;
        this.appendByte(lengthWithNull);
        for (i = 0; i < string.length; i += 1) {
            this.appendWchar(string[i]);
        }
        this.appendWord(0);
    };

    internalProto.getWstring = function (offs) {
        var i, character, string = '', length;

        length = this.getByte(offs);
        for (i = 0; i < length; i += 1) {
            character = this.getWchar(offs + 1 + 2 * i);
            if (character === '\u0000') {
                break;
            }
            string += character;
        }

        return string;
    };

    internalProto.getWstringLength = function (offs) {
        return 1 + 2 * this.getByte(offs);
    };

    internalProto.setDword = function (offs, value) {
        this.setLittleEndian(offs, value, 4);
    };

    internalProto.appendArray = function (arrToAppend) {
        var i;
        for (i = 0; i < arrToAppend.length; i += 1) {
            this.arr.push(arrToAppend[i]);
        }
    };

    internalProto.wordArray = function () {
        var i, wordArray = [];

        for (i = 0; i < Math.floor(this.arr.length / 2); i += 1) {
            wordArray.push(this.getLittleEndian(2 * i, 2));
        }

        return wordArray;
    };

    internalProto.dwordArray = function () {
        var i, dwordArray = [];

        for (i = 0; i < Math.floor(this.arr.length / 4); i += 1) {
            dwordArray.push(this.getLittleEndian(4 * i, 4));
        }

        return dwordArray;
    };

    internalProto.shift = function (maxNumberOfBytes) {
        var i, outputData = create();
        for (i = 0; i < maxNumberOfBytes; i += 1) {
            if (this.arr.length === 0) {
                break;
            }
            outputData.appendByte(this.arr.shift());
        }
        return outputData;
    };

    internalProto.toString = function () {
        var s = '', hex, separator = '';
        this.arr.forEach(function (x) {
            hex = x.toString(16);
            s += separator + (hex.length === 1 ? '0' : '') + hex;
            separator = ' ';
        });
        return s;
    };

    create = function (values) {
        var internal = Object.create(internalProto, {
            arr: {value: []}
        });

        if (typeof ArrayBuffer === 'function' &&
                values instanceof ArrayBuffer) {
            internal.appendArray(new Uint8Array(values));
        } else if (values instanceof Array) {
            internal.appendArray(values);
        } else if (typeof Buffer === 'function' && values instanceof Buffer) {
            internal.appendArray(Array.prototype.slice.call(values, 0));
        }

        return Object.create(null, {
            setByte: {value: function (offs, value) {
                internal.setByte(offs, value);
            }},

            appendByte: {value: function (value) {
                internal.appendByte(value);
            }},

            appendWchar: {value: function (character) {
                internal.appendWchar(character);
            }},

            getWchar: {value: function (offs) {
                return internal.getWchar(offs);
            }},

            appendWstring: {value: function (string) {
                internal.appendWstring(string);
            }},

            getWstring: {value: function (offs) {
                return internal.getWstring(offs);
            }},

            getWstringLength: {value: function (offs) {
                return internal.getWstringLength(offs);
            }},

            appendDword: {value: function (value) {
                internal.appendDword(value);
            }},

            appendWord: {value: function (value) {
                internal.appendWord(value);
            }},

            getByte: {value: function (offs) {
                return internal.getByte(offs);
            }},

            getWord: {value: function (offs) {
                return internal.getWord(offs);
            }},

            setDword: {value: function (offs, value) {
                internal.setDword(offs, value);
            }},

            getDword: {value: function (offs) {
                return internal.getDword(offs);
            }},

            appendData: {value: function (data) {
                internal.appendData(data);
            }},

            slice: {value: function (offs, end) {
                return internal.slice(offs, end);
            }},

            length: {get: function () {
                return internal.arr.length;
            }},

            buffer: {get: function () {
                return (util.isRunningInBrowser ?
                        (new Uint8Array(internal.arr)).buffer :
                        new Buffer(internal.arr));
            }},

            toString: {value: function () {
                return internal.toString();
            }},

            array: {get: function () {
                return internal.arr;
            }},

            byteArray: {get: function () {
                return internal.arr;
            }},

            wordArray: {get: function () {
                return internal.wordArray();
            }},

            dwordArray: {get: function () {
                return internal.dwordArray();
            }},

            shift: {value: function (maxNumberOfBytes) {
                return internal.shift(maxNumberOfBytes);
            }}
        });
    };

    createByte = function (value) {
        var obj = create();
        obj.appendByte(value);
        return obj;
    };

    createWord = function (value) {
        var obj = create();
        obj.appendWord(value);
        return obj;
    };

    createDword = function (value) {
        var obj = create();
        obj.appendDword(value);
        return obj;
    };

    createWstring = function (value) {
        var obj = create();
        obj.appendWstring(value);
        return obj;
    };

    return Object.create(null, {
        create: {value: create},
        createByte: {value: createByte},
        createWord: {value: createWord},
        createDword: {value: createDword},
        createWstring: {value: createWstring}
    });
});
