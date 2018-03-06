import * as React from "react";
import { withRouter } from 'react-router-dom';
import {compose, withHandlers} from 'recompose';

interface ButtonLinkProps {
    href: string;
    className?: string;
    children: any;
    onClick: any;
}

const handlers = {
    onClick: (props:any) => (event:any) => {
        event.preventDefault()
        props.history.push(props.href);
    },
}

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