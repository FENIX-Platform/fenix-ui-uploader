define([
    "jquery",
    "loglevel",
    '../../../src/js/index'

], function ($, log, Uploader) {

    "use strict";

    var s = {
        DATA_UPLOADER: "#dataUploader"
    };

    function Dev() {
        console.clear();
        log.setLevel("trace");
        this._render();

    }

    Dev.prototype._render = function () {

        this.uploader = new Uploader();

        this.uploader.render({
            container : s.DATA_UPLOADER
        });

    };

    return new Dev();
});