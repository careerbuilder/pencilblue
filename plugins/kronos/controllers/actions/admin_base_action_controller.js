module.exports = function (pb) {

    class AdminBaseActionController extends require('../admin_base_controller') (pb) {

        sendResponse(content, cb) {
            cb(this._buildResponseObj(content, 200));
        }

        sendServerError(content, cb) {
            pb.log.error(`A server error occurred: ${content.message}`);
            cb(this._buildResponseObj(content, 500));
        }

        sendClientError(content, cb) {
            cb(this._buildResponseObj(content, 400));
        }
        _buildResponseObj(content, code) {
            return {content, code};
        }
    }

    return AdminBaseActionController;
};
