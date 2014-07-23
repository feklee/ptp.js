/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(function () {
    'use strict';

    return Object.freeze({
        'undefined': 0x5000,
        batteryLevel: 0x5001,
        functionalMode: 0x5002,
        imageSize: 0x5003,
        compressionSetting: 0x5004,
        whiteBalance: 0x5005,
        rgbGain: 0x5006,
        fNumber: 0x5007,
        focalLength: 0x5008,
        focusDistance: 0x5009,
        focusMode: 0x500a,
        exposureMeteringMode: 0x500b,
        flashMode: 0x500c,
        exposureTime: 0x500d,
        exposureProgramMode: 0x500e,
        exposureIndex: 0x500f,
        exposureBiasCompensation: 0x5010,
        dateTime: 0x5011,
        captureDelay: 0x5012,
        stillCaptureMode: 0x5013,
        contrast: 0x5014,
        sharpness: 0x5015,
        digitalZoom: 0x5016,
        effectMode: 0x5017,
        burstNumber: 0x5018,
        burstInterval: 0x5019,
        timelapseNumber: 0x501a,
        timelapseInterval: 0x501b,
        focusMeteringMode: 0x501c,
        uploadURL: 0x501d,
        artist: 0x501e,
        copyrightInfo: 0x501f
    });
});
