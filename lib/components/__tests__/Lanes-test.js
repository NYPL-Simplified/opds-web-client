"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var enzyme_1 = require("enzyme");
var Lanes_1 = require("../Lanes");
var Lane_1 = require("../Lane");
var collectionData_1 = require("./collectionData");
var spinner_1 = require("../../images/spinner");
describe("Lanes", function () {
    var wrapper;
    var hiddenBookIds = ["book id"];
    var updateBook;
    var fulfillBook;
    var indirectFulfillBook;
    beforeEach(function () {
        updateBook = sinon_1.stub();
        fulfillBook = sinon_1.stub();
        indirectFulfillBook = sinon_1.stub();
        wrapper = enzyme_1.shallow(React.createElement(Lanes_1.Lanes, { url: collectionData_1.groupedCollectionData.url, lanes: collectionData_1.groupedCollectionData.lanes, isFetching: true, hideMoreLinks: true, hiddenBookIds: hiddenBookIds, updateBook: updateBook }));
    });
    it("shows lanes in order", function () {
        var lanes = wrapper.find(Lane_1.default);
        lanes.forEach(function (lane, i) {
            chai_1.expect(lane.props().lane).to.equal(collectionData_1.groupedCollectionData.lanes[i]);
            chai_1.expect(lane.props().collectionUrl).to.equal(collectionData_1.groupedCollectionData.url);
            chai_1.expect(lane.props().hideMoreLink).to.equal(true);
            chai_1.expect(lane.props().hiddenBookIds).to.equal(hiddenBookIds);
        });
    });
    it("shows spinner", function () {
        var spinnerImage = wrapper.find(".spinner img");
        chai_1.expect(spinnerImage.props().src).to.equal(spinner_1.default);
    });
    it("fetches collection on mount", function () {
        var fetchCollection = sinon_1.stub();
        wrapper = enzyme_1.shallow(React.createElement(Lanes_1.Lanes, { url: collectionData_1.groupedCollectionData.url, lanes: [], fetchCollection: fetchCollection, updateBook: updateBook }));
        chai_1.expect(fetchCollection.callCount).to.equal(1);
        chai_1.expect(fetchCollection.args[0][0]).to.equal(collectionData_1.groupedCollectionData.url);
    });
    it("fetches new collection on componentWillReceiveProps if there's a new url", function () {
        var clearCollection = sinon_1.stub();
        var fetchCollection = sinon_1.stub();
        wrapper = enzyme_1.shallow(React.createElement(Lanes_1.Lanes, { url: "test1", lanes: [], clearCollection: clearCollection, fetchCollection: fetchCollection, updateBook: updateBook }));
        chai_1.expect(clearCollection.callCount).to.equal(0);
        chai_1.expect(fetchCollection.callCount).to.equal(1);
        wrapper.instance().componentWillReceiveProps({ url: "test1" });
        chai_1.expect(clearCollection.callCount).to.equal(0);
        chai_1.expect(fetchCollection.callCount).to.equal(1);
        wrapper.instance().componentWillReceiveProps({ url: "test2" });
        chai_1.expect(clearCollection.callCount).to.equal(1);
        chai_1.expect(fetchCollection.callCount).to.equal(2);
        chai_1.expect(fetchCollection.args[1][0]).to.equal("test2");
    });
    it("clears collection on unmount", function () {
        var clearCollection = sinon_1.stub();
        wrapper = enzyme_1.shallow(React.createElement(Lanes_1.Lanes, { url: collectionData_1.groupedCollectionData.url, lanes: [], clearCollection: clearCollection, updateBook: updateBook }));
        wrapper.instance().componentWillUnmount();
        chai_1.expect(clearCollection.callCount).to.equal(1);
    });
});
