// Compiled using typings@0.6.6
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/86dbea8fc37d9473fee465da4f0a21bea4f8cbd9/jest/jest.d.ts
// Type definitions for Jest 0.1.18
// Project: http://facebook.github.io/jest/
// Definitions by: Asana <https://asana.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare function afterEach(fn: any): void;
declare function beforeEach(fn: any): void;
declare function describe(name: string, fn: any): void;
declare function it(name: string, fn: any): void;
declare function pit(name: string, fn: any): void;

declare function xdescribe(name: string, fn: any): void;
declare function xit(name: string, fn: any): void;

declare function expect(actual: any): any;

interface NodeRequire {
    requireActual(moduleName: string): any;
}

declare module jest {
    function autoMockOff(): void;
    function dontMock(moduleName: string): void;
    function genMockFunction(): any;
    function mock(moduleName: string): void;
    function setMock(moduleName: string, fn: any): void;
}