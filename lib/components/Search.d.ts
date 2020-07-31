import * as React from "react";
import { SearchData, NavigateContext } from "../interfaces";
export interface SearchProps extends SearchData, React.HTMLProps<Search> {
    fetchSearchDescription?: (url: string) => void;
    allLanguageSearch?: boolean;
}
/** Search box. */
export default class Search extends React.Component<SearchProps, {}> {
    context: NavigateContext;
    constructor(props: any);
    static contextTypes: React.ValidationMap<NavigateContext>;
    render(): JSX.Element;
    componentWillMount(): void;
    componentWillUpdate(props: any): void;
    onSubmit(event: any): void;
}
