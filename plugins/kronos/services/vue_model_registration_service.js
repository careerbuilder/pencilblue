module.exports = function(pb) {

    class VueModelRegistrationService {
        constructor (context) {
            this.context = context;
            this.ts = context.ts;
            this.model = {};

            this.ts.registerLocal('vue_model', (flag, cb) => cb(null, new pb.TemplateValue(JSON.stringify(this.model), false)));
        }

        static init (cb) {
            cb(null, true);
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
