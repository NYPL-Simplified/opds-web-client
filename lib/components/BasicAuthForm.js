"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var auth_1 = require("../utils/auth");
/** Form for logging in with basic auth. */
var BasicAuthForm = /** @class */ (function (_super) {
    __extends(BasicAuthForm, _super);
    function BasicAuthForm(props) {
        var _this = _super.call(this, props) || this;
        _this.loginRef = React.createRef();
        _this.passwordRef = React.createRef();
        _this.state = { error: _this.props.error };
        _this.submit = _this.submit.bind(_this);
        return _this;
    }
    BasicAuthForm.prototype.render = function () {
        return (React.createElement("form", { onSubmit: this.submit },
            this.state.error && (React.createElement("div", { className: "auth-error" }, this.state.error)),
            React.createElement("input", { "aria-label": "Input for " + this.loginLabel(), className: "form-control", ref: this.loginRef, type: "text", autoFocus: true, placeholder: this.loginLabel() }),
            React.createElement("br", null),
            React.createElement("input", { "aria-label": "Input for " + this.passwordLabel(), className: "form-control", ref: this.passwordRef, type: "password", placeholder: this.passwordLabel() }),
            React.createElement("br", null),
            React.createElement("input", { type: "submit", className: "btn btn-default", value: "Submit" }),
            this.props.cancel && (React.createElement("input", { type: "reset", className: "btn btn-default", onClick: this.props.cancel, value: "Cancel" }))));
    };
    BasicAuthForm.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState({ error: nextProps.error });
    };
    BasicAuthForm.prototype.loginLabel = function () {
        var _a;
        return ((_a = this.props.provider) === null || _a === void 0 ? void 0 : _a.method.labels.login) || "username";
    };
    BasicAuthForm.prototype.passwordLabel = function () {
        var _a;
        return ((_a = this.props.provider) === null || _a === void 0 ? void 0 : _a.method.labels.password) || "password";
    };
    /**
     * validate()
     * Not all libraries require a password to log in so that value is not checked.
     */
    BasicAuthForm.prototype.validate = function (login) {
        // const login = this.loginRef.current && this.loginRef.current.value;
        if (!login) {
            this.setState({
                error: this.loginLabel() + " is required"
            });
            return false;
        }
        else {
            this.setState({ error: null });
        }
        return true;
    };
    BasicAuthForm.prototype.submit = function (event) {
        var _a, _b, _c, _d, _e, _f;
        event.preventDefault();
        if (this.validate((_a = this.loginRef.current) === null || _a === void 0 ? void 0 : _a.value)) {
            var login = this.loginRef.current && this.loginRef.current.value;
            var password = this.passwordRef.current && this.passwordRef.current.value;
            var credentials = auth_1.generateCredentials(login, (password !== null && password !== void 0 ? password : ""));
            (_c = (_b = this.props).saveCredentials) === null || _c === void 0 ? void 0 : _c.call(_b, {
                provider: (_d = this.props.provider) === null || _d === void 0 ? void 0 : _d.id,
                credentials: credentials
            });
            (_f = (_e = this.props).hide) === null || _f === void 0 ? void 0 : _f.call(_e);
            if (this.props.callback) {
                this.props.callback();
            }
        }
    };
    return BasicAuthForm;
}(React.Component));
exports.default = BasicAuthForm;
