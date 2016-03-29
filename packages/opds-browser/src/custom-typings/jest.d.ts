// Modified type definitions for Jest 0.1.18
//
// * Altered it() to allow Jasmine 2's done() as a second parameter
// * Removed all other unused definitions
// * Replaced various types with "any" for greater flexibility
//
// Original definitions: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/86dbea8fc37d9473fee465da4f0a21bea4f8cbd9/jest/jest.d.ts


declare function afterEach(fn: any): void;
declare function beforeEach(fn: any): void;
declare function describe(name: string, fn: any): void;
declare function it(name: string, fn: any): any;
declare function pit(name: string, fn: any): void;

declare function xdescribe(name: string, fn: any): void;
declare function xit(name: string, fn: any): void;

declare function expect(actual: any): any;
declare function spyOn(object: any, method: any): any;

interface NodeRequire {
  requireActual(moduleName: string): any;
}

declare namespace jest {
  function autoMockOff(): void;
  function dontMock(moduleName: string): void;
  function genMockFunction(): any;
  function mock(moduleName: string): void;
  function setMock(moduleName: string, fn: any): void;
}