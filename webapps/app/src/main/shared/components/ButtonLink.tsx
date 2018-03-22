import * as React from "react";
import { withRouter } from 'react-router-dom';
import {compose, withHandlers} from 'recompose';
import {History} from "history";

interface ButtonLinkProps {
    href: string;
    className?: string;
    children: JSX.Element | string;
    onClick: () => React.EventHandler<React.MouseEvent<HTMLAnchorElement>>;
    history: History;
}

const handlers = {
    onClick: (props: ButtonLinkProps) => (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        props.history.push(props.href);
    },
}

// this component renders button and uses history to navigate
export const ButtonLinkComponent : React.StatelessComponent<ButtonLinkProps> = (props: ButtonLinkProps) => {
    return <button
        className={props.className}
        onClick={props.onClick}
    >
        {props.children}
    </button>;
}

const enhance = compose<ButtonLinkProps, Partial<ButtonLinkProps>>(
    withRouter,
    withHandlers(handlers)
);

export const ButtonLink = enhance(ButtonLinkComponent);