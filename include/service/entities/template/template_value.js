module.exports = function (pb) {
    class TemplateValue {
        constructor(val, htmlEncode) {
            this.raw        = val;
            this.htmlEncode = !!htmlEncode;
        }
        set htmlEncode (shouldEncode) {
            this._encode = shouldEncode;
        }
        get htmlEncode () {
            return this._encode;
        }

        doEncode () {
            this.htmlEncode = true;
        }
        skipEncode () {
            this.htmlEncode = false;
        }

        get value () {
            let value = this.rawValue;
            return this.htmlEncode ? HtmlEncoder.htmlEncode(value) : value;
        }
        toString () {
            return this.value;
        }
    }
    return TemplateValue;
};
