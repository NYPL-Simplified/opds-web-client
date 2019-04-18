"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
/** Form for logging in with basic auth. */
var BasicAuthForm = /** @class */ (function (_super) {
    __extends(BasicAuthForm, _super);
    function BasicAuthForm(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { error: _this.props.error };
        _this.submit = _this.submit.bind(_this);
        return _this;
    }
    BasicAuthForm.prototype.render = function () {
        return (React.createElement("form", { onSubmit: this.submit },
            this.state.error &&
                React.createElement("div", { className: "auth-error" }, this.state.error),
            React.createElement("input", { className: "form-control", ref: "login", type: "text", autoFocus: true, placeholder: this.loginLabel() }),
            React.createElement("br", null),
            React.createElement("input", { className: "form-control", ref: "password", type: "password", placeholder: this.passwordLabel() }),
            React.createElement("br", null),
            React.createElement("input", { type: "submit", className: "btn btn-default", value: "Submit" }),
            this.props.cancel &&
                React.createElement("input", { type: "reset", className: "btn btn-default", onClick: this.props.cancel, value: "Cancel" })));
    };
    BasicAuthForm.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState({ error: nextProps.error });
    };
    BasicAuthForm.prototype.loginLabel = function () {
        return this.props.provider.method.labels.login || "username";
    };
    BasicAuthForm.prototype.passwordLabel = function () {
        return this.props.provider.method.labels.password || "password";
    };
    BasicAuthForm.prototype.validate = function () {
        var login = this.refs["login"].value;
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
        event.preventDefault();
        if (this.validate()) {
            var login = this.refs["login"].value;
            var password = this.refs["password"].value;
            var credentials = this.generateCredentials(login, password);
            this.props.saveCredentials({
                provider: this.props.provider.id,
                credentials: credentials
            });
            this.props.hide();
            if (this.props.callback) {
                this.props.callback();
            }
        }
    };
    BasicAuthForm.prototype.generateCredentials = function (login, password) {
        return "Basic " + btoa(login + ":" + password);
    };
    return BasicAuthForm;
}(React.Component));
exports.default = BasicAuthForm;
