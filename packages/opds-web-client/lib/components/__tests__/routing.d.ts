export declare const mockRouter: (push: any) => {
    push: any;
    createHref: (location: any) => string;
    isActive: (location: any, onlyActiveOnIndex: any) => boolean;
};
export declare const mockRouterContext: (push?: any, pathFor?: any) => {
    router: {
        push: any;
        createHref: (location: any) => string;
        isActive: (location: any, onlyActiveOnIndex: any) => boolean;
    };
    pathFor: any;
};
