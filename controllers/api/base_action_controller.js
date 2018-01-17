module.exports = function (pb) {
    class BaseActionController extends pb.BaseController {

        _sendSuccess (message, data) {
            return { content: this.constructor.apiResponse(this.constructor.API_SUCCESS, message, data) };
        }

        _clientError (message, err) {
            return this._sendError(message, 400, err);
        }

        _serverError (message, err) {
            return this._sendError(message, 500, err);
        }

        _sendError (message, statusCode, err) {
            return {
                code: statusCode,
                content: this.constructor.apiResponse(this.constructor.API_FAILURE, message, err)
            };
        }
    }
}
