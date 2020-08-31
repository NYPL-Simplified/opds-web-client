"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var actions_1 = require("../../actions");
// synchronous actions for simple testing
// of createFetchCollectionAndBook
var fetchCollectionStub = sinon_1.stub().returns(new Promise(function (resolve, reject) {
    resolve({});
}));
var fetchBookStub = sinon_1.stub().returns(new Promise(function (resolve, reject) {
    resolve({});
}));
var mergeRootProps_1 = require("../mergeRootProps");
var collectionData_1 = require("./collectionData");
describe("findBookInCollection", function () {
    it("returns nothing if no collection", function () {
        var result = mergeRootProps_1.findBookInCollection(null, "test");
        chai_1.expect(result).to.equal(null);
    });
    it("finds a book in the collection by url", function () {
        var collection = collectionData_1.groupedCollectionData;
        var book = collectionData_1.groupedCollectionData.lanes[0].books[0];
        if (!book.url)
            throw new Error("Book is missing url");
        var result = mergeRootProps_1.findBookInCollection(collection, book.url);
        chai_1.expect(result).to.equal(book);
    });
    it("finds a book in the collection by id", function () {
        var collection = collectionData_1.groupedCollectionData;
        var book = collectionData_1.groupedCollectionData.lanes[0].books[0];
        var result = mergeRootProps_1.findBookInCollection(collection, book.id);
        chai_1.expect(result).to.equal(book);
    });
    it("returns nothing if given a book url/id not in the collection", function () {
        var collection = collectionData_1.groupedCollectionData;
        var result = mergeRootProps_1.findBookInCollection(collection, "nonexistent");
        chai_1.expect(result).not.to.be.ok;
    });
});
describe("createFetchCollectionAndBook", function () {
    var collectionUrl = "collection url";
    var bookUrl = "book url";
    var dispatch = sinon_1.stub().returns(new Promise(function (resolve, reject) { return resolve(); }));
    var actionFetchCollectionStub;
    var actionBookCollectionStub;
    beforeEach(function () {
        actionFetchCollectionStub = sinon_1.stub(actions_1.default.prototype, "fetchCollection").callsFake(function () { return fetchCollectionStub; });
        actionBookCollectionStub = sinon_1.stub(actions_1.default.prototype, "fetchBook").callsFake(function () { return fetchBookStub; });
    });
    afterEach(function () {
        actionFetchCollectionStub.restore();
        actionBookCollectionStub.restore();
    });
    it("returns fetch function that uses the provided dispatch", function (done) {
        var fetchCollectionAndBook = mergeRootProps_1.createFetchCollectionAndBook(dispatch);
        fetchCollectionAndBook(collectionUrl, bookUrl)
            .then(function (_a) {
            var collectionData = _a.collectionData, bookData = _a.bookData;
            // we are only testing that the provided dispatch is called twice,
            // once for fetchCollection and once for fetchBook
            chai_1.expect(dispatch.callCount).to.equal(2);
            chai_1.expect(dispatch.args[0][0]).to.equal(fetchCollectionStub);
            chai_1.expect(dispatch.args[1][0]).to.equal(fetchBookStub);
            done();
        })
            .catch(function (err) {
            console.log(err);
            throw err;
        });
    });
});
describe("mergeRootProps", function () {
    var stateProps, dispatchProps, componentProps;
    var fetchCollection, clearCollection, fetchBook, loadBook, clearBook, navigate, updateBook, fetchLoans;
    var fakeCollection = collectionData_1.ungroupedCollectionData;
    var fakeBook = {
        id: "fake book id",
        title: "fake book title",
        url: "fake book url"
    };
    beforeEach(function () {
        fetchCollection = sinon_1.spy(function (url) {
            return new Promise(function (resolve, reject) {
                resolve(fakeCollection);
            });
        });
        fetchBook = sinon_1.spy(function (url) {
            return new Promise(function (resolve, reject) {
                resolve(fakeBook);
            });
        });
        loadBook = sinon_1.stub();
        clearCollection = sinon_1.stub();
        clearBook = sinon_1.stub();
        updateBook = sinon_1.spy(function (url) {
            return new Promise(function (resolve, reject) { return resolve(fakeBook); });
        });
        fetchLoans = sinon_1.stub();
        dispatchProps = {
            createDispatchProps: function (fetcher) {
                return {
                    fetchCollection: fetchCollection,
                    clearCollection: clearCollection,
                    loadBook: loadBook,
                    fetchBook: fetchBook,
                    clearBook: clearBook,
                    updateBook: updateBook,
                    fetchLoans: fetchLoans
                };
            }
        };
        componentProps = {};
    });
    describe("setCollection", function () {
        var props;
        beforeEach(function () {
            stateProps = {
                loadedCollectionUrl: "test url",
                collectionData: collectionData_1.groupedCollectionData,
                bookData: null
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
        });
        it("fetches collection data if given a collection url", function (done) {
            props
                .setCollection("new collection url")
                .then(function (data) {
                chai_1.expect(data).to.equal(fakeCollection);
                chai_1.expect(fetchCollection.callCount).to.equal(1);
                chai_1.expect(fetchCollection.args[0][0]).to.equal("new collection url");
                chai_1.expect(clearCollection.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("does nothing and returns existing data if given the existing collection url", function (done) {
            props
                .setCollection("test url")
                .then(function (data) {
                chai_1.expect(data).to.equal(collectionData_1.groupedCollectionData);
                chai_1.expect(fetchCollection.callCount).to.equal(0);
                chai_1.expect(clearCollection.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("clears collection data if given a falsy collection url", function (done) {
            props
                .setCollection(null)
                .then(function (data) {
                chai_1.expect(data).not.to.be.ok;
                chai_1.expect(fetchCollection.callCount).to.equal(0);
                chai_1.expect(clearCollection.callCount).to.equal(1);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
    });
    describe("setBook", function () {
        var props;
        beforeEach(function () {
            stateProps = {
                currentCollectionUrl: "test collection url",
                collectionData: collectionData_1.groupedCollectionData,
                currentBookUrl: "test book url",
                bookData: {
                    id: "test book id",
                    title: "test book title",
                    url: "test book url"
                }
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
        });
        it("fetches book data if given a book url not in the current collection", function (done) {
            props
                .setBook("fake book url", collectionData_1.groupedCollectionData)
                .then(function (data) {
                chai_1.expect(data).to.equal(fakeBook);
                chai_1.expect(fetchBook.callCount).to.equal(1);
                chai_1.expect(fetchBook.args[0][0]).to.equal("fake book url");
                chai_1.expect(clearBook.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("doesn't fetch book data if given a book url in the current collection", function (done) {
            props
                .setBook(collectionData_1.groupedCollectionData.lanes[0].books[0].url, collectionData_1.groupedCollectionData)
                .then(function (data) {
                chai_1.expect(data).to.equal(collectionData_1.groupedCollectionData.lanes[0].books[0]);
                chai_1.expect(fetchBook.callCount).to.equal(0);
                chai_1.expect(clearBook.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("does nothing and returns book data if given book data", function (done) {
            var bookDataWithoutUrl = {
                id: "test id",
                title: "test title"
            };
            props
                .setBook(bookDataWithoutUrl)
                .then(function (data) {
                chai_1.expect(data).to.equal(bookDataWithoutUrl);
                chai_1.expect(fetchBook.callCount).to.equal(0);
                chai_1.expect(clearBook.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("tries to refresh book data if given the existing book url and no collection", function (done) {
            props
                .setBook("test book url")
                .then(function (data) {
                chai_1.expect(data).to.equal(fakeBook);
                chai_1.expect(fetchBook.callCount).to.equal(1);
                chai_1.expect(clearBook.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("clears book data if given a falsy book url", function (done) {
            props
                .setBook(null)
                .then(function (data) {
                chai_1.expect(data).not.to.be.ok;
                chai_1.expect(fetchBook.callCount).to.equal(0);
                chai_1.expect(clearBook.callCount).to.equal(1);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
    });
    describe("setCollectionAndBook", function () {
        var props;
        beforeEach(function () {
            stateProps = {
                loadedCollectionUrl: collectionData_1.groupedCollectionData.url,
                collectionData: collectionData_1.groupedCollectionData,
                bookData: collectionData_1.groupedCollectionData.lanes[0].books[0]
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
        });
        it("does not fetch book if given book url belonging to given collection", function (done) {
            props
                .setCollectionAndBook(fakeCollection.url, fakeCollection.books[0].url)
                .then(function (data) {
                chai_1.expect(data).to.deep.equal({
                    collectionData: fakeCollection,
                    bookData: fakeCollection.books[0]
                });
                chai_1.expect(fetchCollection.callCount).to.equal(1);
                chai_1.expect(fetchCollection.args[0][0]).to.equal(fakeCollection.url);
                chai_1.expect(fetchBook.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("fetches book if given book url not belonging to given collection", function (done) {
            props
                .setCollectionAndBook(fakeCollection.url, "fake book url")
                .then(function (data) {
                chai_1.expect(data).to.deep.equal({
                    collectionData: fakeCollection,
                    bookData: fakeBook
                });
                chai_1.expect(fetchCollection.callCount).to.equal(1);
                chai_1.expect(fetchCollection.args[0][0]).to.equal(fakeCollection.url);
                chai_1.expect(fetchBook.callCount).to.equal(1);
                chai_1.expect(fetchBook.args[0][0]).to.equal("fake book url");
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("fetches book if not given a collection url", function (done) {
            props
                .setCollectionAndBook(null, "fake book url")
                .then(function (data) {
                chai_1.expect(data).to.deep.equal({
                    collectionData: null,
                    bookData: fakeBook
                });
                chai_1.expect(fetchCollection.callCount).to.equal(0);
                chai_1.expect(fetchBook.callCount).to.equal(1);
                chai_1.expect(fetchBook.args[0][0]).to.equal("fake book url");
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("does nothing and returns existing data if given the existing collection and book urls", function (done) {
            props
                .setCollectionAndBook(stateProps.loadedCollectionUrl, stateProps.bookData.url)
                .then(function (data) {
                chai_1.expect(data).to.deep.equal({
                    collectionData: stateProps.collectionData,
                    bookData: stateProps.bookData
                });
                chai_1.expect(fetchCollection.callCount).to.equal(0);
                chai_1.expect(fetchBook.callCount).to.equal(0);
                chai_1.expect(clearCollection.callCount).to.equal(0);
                chai_1.expect(clearBook.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("clears collection and book data if given falsy urls", function (done) {
            props
                .setCollectionAndBook(null, null)
                .then(function (data) {
                chai_1.expect(data).to.deep.equal({
                    collectionData: null,
                    bookData: null
                });
                chai_1.expect(fetchCollection.callCount).to.equal(0);
                chai_1.expect(fetchBook.callCount).to.equal(0);
                chai_1.expect(clearCollection.callCount).to.equal(1);
                chai_1.expect(clearBook.callCount).to.equal(1);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
    });
    describe("refreshCollectionAndBook", function () {
        var props;
        it("calls fetchCollection", function () {
            stateProps = {
                loadedCollectionUrl: "test collection",
                loadedBookUrl: "test book"
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
            props.refreshCollectionAndBook();
            chai_1.expect(fetchCollection.callCount).to.equal(1);
            chai_1.expect(fetchCollection.args[0][0]).to.equal("test collection");
        });
        it("calls fetchBook", function (done) {
            stateProps = {
                loadedCollectionUrl: "test collection",
                loadedBookUrl: "test book"
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
            props
                .refreshCollectionAndBook()
                .then(function (data) {
                chai_1.expect(fetchBook.callCount).to.equal(1);
                chai_1.expect(fetchBook.args[0][0]).to.equal("test book");
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("only fetches collection if only collection is loaded", function () {
            stateProps = {
                loadedCollectionUrl: "test collection",
                loadedBookUrl: null
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
            props.refreshCollectionAndBook();
            chai_1.expect(fetchCollection.callCount).to.equal(1);
            chai_1.expect(fetchCollection.args[0][0]).to.equal("test collection");
            chai_1.expect(fetchBook.callCount).to.equal(0);
        });
        it("only fetches book if only book is loaded", function (done) {
            stateProps = {
                loadedCollectionUrl: null,
                loadedBookUrl: "test book"
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
            props
                .refreshCollectionAndBook()
                .then(function (data) {
                chai_1.expect(fetchBook.callCount).to.equal(1);
                chai_1.expect(fetchBook.args[0][0]).to.equal("test book");
                chai_1.expect(fetchCollection.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("does not fetch if neither collection nor book are loaded", function (done) {
            stateProps = {
                loadedCollectionUrl: null,
                loadedBookUrl: null
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
            props
                .refreshCollectionAndBook()
                .then(function (data) {
                chai_1.expect(fetchCollection.callCount).to.equal(0);
                chai_1.expect(fetchBook.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
    });
    describe("retryCollectionAndBook", function () {
        var props;
        it("calls fetchCollection", function () {
            stateProps = {
                collectionUrl: "test collection",
                bookUrl: "test book",
                loadedCollectionUrl: null,
                loadedBookUrl: null
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
            props.retryCollectionAndBook();
            chai_1.expect(fetchCollection.callCount).to.equal(1);
            chai_1.expect(fetchCollection.args[0][0]).to.equal("test collection");
        });
        it("calls fetchBook", function (done) {
            stateProps = {
                collectionUrl: "test collection",
                bookUrl: "test book",
                loadedCollectionUrl: null,
                loadedBookUrl: null
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
            props
                .retryCollectionAndBook()
                .then(function (data) {
                chai_1.expect(fetchBook.callCount).to.equal(1);
                chai_1.expect(fetchBook.args[0][0]).to.equal("test book");
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("only fetches collection if only collectionUrl is present", function () {
            stateProps = {
                collectionUrl: "test collection",
                bookUrl: null,
                loadedCollectionUrl: null,
                loadedBookUrl: null
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
            props.retryCollectionAndBook();
            chai_1.expect(fetchCollection.callCount).to.equal(1);
            chai_1.expect(fetchCollection.args[0][0]).to.equal("test collection");
            chai_1.expect(fetchBook.callCount).to.equal(0);
        });
        it("only fetches book if only book is loaded", function (done) {
            stateProps = {
                collectionUrl: null,
                bookUrl: "test book",
                loadedCollectionUrl: null,
                loadedBookUrl: null
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
            props
                .retryCollectionAndBook()
                .then(function (data) {
                chai_1.expect(fetchBook.callCount).to.equal(1);
                chai_1.expect(fetchBook.args[0][0]).to.equal("test book");
                chai_1.expect(fetchCollection.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("does not fetch if neither collection nor book are loaded", function (done) {
            stateProps = {
                collectionUrl: null,
                bookUrl: null,
                loadedCollectionUrl: null,
                loadedBookUrl: null
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
            props
                .retryCollectionAndBook()
                .then(function (data) {
                chai_1.expect(fetchCollection.callCount).to.equal(0);
                chai_1.expect(fetchBook.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
    });
    describe("updateBook", function () {
        var props;
        it("calls updateBook", function () {
            stateProps = {
                loansUrl: "loans"
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
            props.updateBook("borrow url");
            chai_1.expect(updateBook.callCount).to.equal(1);
            chai_1.expect(updateBook.args[0][0]).to.equal("borrow url");
        });
        it("calls fetchLoans if loansUrl is present", function (done) {
            stateProps = {
                loansUrl: "loans"
            };
            props = mergeRootProps_1.mergeRootProps(stateProps, dispatchProps, componentProps);
            props
                .updateBook()
                .then(function (data) {
                chai_1.expect(fetchLoans.callCount).to.equal(1);
                chai_1.expect(fetchLoans.args[0][0]).to.equal("loans");
                chai_1.expect(data).to.equal(fakeBook);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
        it("doesn't call fetchLoans if loansUrl is blank", function (done) {
            props = mergeRootProps_1.mergeRootProps({}, dispatchProps, componentProps);
            props
                .updateBook()
                .then(function (data) {
                chai_1.expect(fetchLoans.callCount).to.equal(0);
                done();
            })
                .catch(function (err) {
                console.log(err);
                throw err;
            });
        });
    });
});
