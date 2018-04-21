module.exports = function(pb) {

    class VueModelRegistrationService extends require('./base_service')(pb) {
        constructor (context) {
            super(context);
            this.ts = context.ts;
            this.model = {};

            this.ts.registerLocal('vue_model', (flag, cb) => cb(null, new pb.TemplateValue(JSON.stringify(this.model), false)));
        }

        static getName() {
            return 'VueModelRegistrationService';
        }
        add (item) {
            Object.keys(item).forEach(key => this.model[key] = item[key]);
        }

        remove (item) {
            Object.keys(item).forEach(key => delete this.model[key]);
        }
    }
    return VueModelRegistrationService;
};
