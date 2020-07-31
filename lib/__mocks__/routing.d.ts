export declare const mockRouter: (push: any) => {
    push: any;
    createHref: (location: any) => string;
};
export declare const mockRouterContext: (push?: any, pathFor?: any) => {
    router: {
        push: any;
        createHref: (location: any) => string;
    };
    pathFor: any;
};
