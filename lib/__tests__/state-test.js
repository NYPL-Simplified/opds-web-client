"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var state_1 = require("../state");
// standard redux dispatch returns the action you pass in
var dispatch = function (action) { return action; };
// we have to cast the string states to type State
var initialState = "initial state";
var alteredState = "state with collection and book";
var testState = initialState;
var mergeRootProps = require("../components/mergeRootProps");
var store = require("../store");
describe("buildInitialState", function () {
    var collectionUrl = "collection url";
    var bookUrl = "book url";
    var fetchCollectionAndBookStub;
    var createFetchCollectionAndBookStub;
    var storeStub;
    beforeEach(function () {
        fetchCollectionAndBookStub = sinon_1.stub().returns(new Promise(function (resolve, reject) {
            testState = alteredState;
            resolve({ collectionData: null, bookData: null });
        }));
        createFetchCollectionAndBookStub = sinon_1.stub(mergeRootProps, "createFetchCollectionAndBook").returns(fetchCollectionAndBookStub);
        storeStub = sinon_1.stub(store, "default").returns({
            dispatch: dispatch,
            getState: function () { return testState; },
            subscribe: sinon_1.stub(),
            replaceReducer: sinon_1.stub()
        });
    });
    afterEach(function () {
        createFetchCollectionAndBookStub.restore();
        storeStub.restore();
    });
    it("fetches given collection and book into state", function (done) {
        state_1.default(collectionUrl, bookUrl)
            .then(function (state) {
            chai_1.expect(createFetchCollectionAndBookStub.callCount).to.equal(1);
            chai_1.expect(createFetchCollectionAndBookStub.args[0][0]).to.equal(dispatch);
            chai_1.expect(fetchCollectionAndBookStub.callCount).to.equal(1);
            chai_1.expect(fetchCollectionAndBookStub.args[0][0]).to.equal(collectionUrl);
            chai_1.expect(fetchCollectionAndBookStub.args[0][1]).to.equal(bookUrl);
            chai_1.expect(state).to.equal(alteredState);
            done();
        })
            .catch(function (err) {
            console.log(err);
            throw err;
        });
    });
});
