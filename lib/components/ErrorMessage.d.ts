import * as React from "react";
export interface ErrorMessageProps {
    message: string;
    retry?: () => void;
    close?: () => void;
}
/** Shows an error message dialog when a request fails. */
export default class ErrorMessage extends React.Component<ErrorMessageProps, {}> {
    render(): JSX.Element;
    maxWordLength(): number;
}
