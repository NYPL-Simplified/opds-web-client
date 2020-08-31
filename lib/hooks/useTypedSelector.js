"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_redux_1 = require("react-redux");
/**
 * This creates a type-safe hook based on Redux's useSelector to be
 * able to easily get the needed data from the store.
 */
var useTypedSelector = react_redux_1.useSelector;
exports.default = useTypedSelector;
