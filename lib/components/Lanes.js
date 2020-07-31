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
var react_redux_1 = require("react-redux");
var OPDSDataAdapter_1 = require("../OPDSDataAdapter");
var DataFetcher_1 = require("../DataFetcher");
var actions_1 = require("../actions");
var Lane_1 = require("./Lane");
var spinner_1 = require("../images/spinner");
/** All the lanes for a collection. */
var Lanes = /** @class */ (function (_super) {
    __extends(Lanes, _super);
    function Lanes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Lanes.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "lanes" },
            this.props.isFetching && (React.createElement("div", { className: "spinner" },
                React.createElement("img", { src: spinner_1.default, role: "presentation", alt: "" }))),
            this.props.lanes && this.props.lanes.length > 0 ? (React.createElement("ul", { "aria-label": "groups of books", className: "subtle-list" }, this.props.lanes &&
                this.props.lanes.map(function (lane, index) { return (React.createElement("li", { key: index },
                    React.createElement(Lane_1.default, { lane: lane, hideMoreLink: _this.props.hideMoreLinks, collectionUrl: _this.props.url, hiddenBookIds: _this.props.hiddenBookIds, updateBook: _this.props.updateBook, isSignedIn: _this.props.isSignedIn, epubReaderUrlTemplate: _this.props.epubReaderUrlTemplate }))); }))) : null));
    };
    Lanes.prototype.componentWillMount = function () {
        if (this.props.fetchCollection &&
            (!this.props.lanes || !this.props.lanes.length)) {
            this.props.fetchCollection(this.props.url);
        }
    };
    Lanes.prototype.componentWillReceiveProps = function (newProps) {
        if (newProps.url !== this.props.url) {
            if (this.props.clearCollection) {
                this.props.clearCollection();
            }
            if (this.props.fetchCollection) {
                this.props.fetchCollection(newProps.url);
            }
        }
    };
    Lanes.prototype.componentWillUnmount = function () {
        if (this.props.clearCollection) {
            this.props.clearCollection();
        }
    };
    return Lanes;
}(React.Component));
exports.Lanes = Lanes;
function mapStateToProps(state, ownProps) {
    var key = ownProps.namespace || "collection";
    return {
        lanes: state[key].data ? state[key].data.lanes : [],
        isFetching: state[key].isFetching
    };
}
function mapDispatchToProps(dispatch) {
    return {
        createDispatchProps: function (fetcher) {
            var actions = new actions_1.default(fetcher);
            return {
                fetchCollection: function (url) {
                    return dispatch(actions.fetchCollection(url));
                },
                clearCollection: function () { return dispatch(actions.clearCollection()); }
            };
        }
    };
}
function mergeLanesProps(stateProps, createDispatchProps, componentProps) {
    var fetcher = new DataFetcher_1.default({
        proxyUrl: componentProps.proxyUrl,
        adapter: OPDSDataAdapter_1.adapter
    });
    var dispatchProps = createDispatchProps.createDispatchProps(fetcher);
    return Object.assign({}, componentProps, stateProps, dispatchProps);
}
var ConnectedLanes = react_redux_1.connect(mapStateToProps, mapDispatchToProps, mergeLanesProps)(Lanes);
exports.default = ConnectedLanes;
