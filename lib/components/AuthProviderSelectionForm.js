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
/** Shows buttons for each available authentication provider, or the form for
    the selected authentication provider. */
var AuthProviderSelectionForm = /** @class */ (function (_super) {
    __extends(AuthProviderSelectionForm, _super);
    function AuthProviderSelectionForm(props) {
        var _a;
        var _this = _super.call(this, props) || this;
        var selectedProvider = null;
        if (_this.props.error && _this.props.attemptedProvider) {
            for (var _i = 0, _b = (_a = _this.props.providers, (_a !== null && _a !== void 0 ? _a : [])); _i < _b.length; _i++) {
                var provider = _b[_i];
                if (_this.props.attemptedProvider === provider.id) {
                    selectedProvider = provider;
                    break;
                }
            }
        }
        _this.state = { selectedProvider: selectedProvider };
        _this.selectProvider = _this.selectProvider.bind(_this);
        return _this;
    }
    AuthProviderSelectionForm.prototype.render = function () {
        var _this = this;
        var _a;
        var AuthForm = this.state.selectedProvider &&
            this.state.selectedProvider.plugin.formComponent;
        return (React.createElement("div", { className: "auth-form", role: "dialog", "aria-labelledby": "auth-form-title" },
            React.createElement("div", null,
                React.createElement("h3", { id: "auth-form-title" },
                    this.props.title ? this.props.title + " " : "",
                    "Login"),
                this.state.selectedProvider && AuthForm && (React.createElement(AuthForm, { hide: this.props.hide, saveCredentials: this.props.saveCredentials, callback: this.props.callback, cancel: this.props.cancel, error: this.props.error, provider: this.state.selectedProvider })),
                !this.state.selectedProvider &&
                    this.props.providers &&
                    this.props.providers.length > 0 && (React.createElement("div", null,
                    React.createElement("ul", { className: "subtle-list", "aria-label": "authentication options" }, this.props.providers.map(function (provider) { return (React.createElement("li", { key: provider.id },
                        React.createElement(provider.plugin.buttonComponent, { provider: provider, onClick: function () { return _this.selectProvider(provider); } }))); })),
                    React.createElement("button", { className: "btn btn-default", onClick: (_a = this.props.cancel, (_a !== null && _a !== void 0 ? _a : undefined)) }, "Cancel"))))));
    };
    AuthProviderSelectionForm.prototype.componentWillMount = function () {
        if (this.props.providers && this.props.providers.length === 1) {
            this.setState({ selectedProvider: this.props.providers[0] });
        }
    };
    AuthProviderSelectionForm.prototype.selectProvider = function (provider) {
        this.setState({ selectedProvider: provider });
    };
    return AuthProviderSelectionForm;
}(React.Component));
exports.default = AuthProviderSelectionForm;
