module.exports = function(pb) {

    class GetObjectTypeNameAvailable extends pb.BaseActionController {
        render () {
            let name = this.query.name;

            if(!pb.validation.isNonEmptyStr(name, true)) {
                return this._sendClientError('Name was not passed');
            }

            let service = new pb.CustomObjectService(this.site, true);
            try {
                let exists = service.typeExists(name);
                return this._sendResponse(`${name} is ${exists ? 'not ' : ''}available`, !exists);
            }
            catch (err) {
                return this._serverError(err.stack, false);
            }
        }
    }

    //exports
    return GetObjectTypeNameAvailable;
};
