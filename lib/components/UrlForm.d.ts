import * as React from "react";
import { NavigateContext } from "../interfaces";
export interface UrlFormProps {
    collectionUrl?: string;
}
/** Page for entering the URL of an OPDS feed that's shown when no feed
    is specified in the URL. Submitting the form adds the feed to the URL. */
export default class UrlForm extends React.Component<UrlFormProps, {}> {
    private inputRef;
    context: NavigateContext;
    constructor(props: any);
    static contextTypes: React.ValidationMap<NavigateContext>;
    render(): JSX.Element;
    onSubmit(event: any): void;
}
