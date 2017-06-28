import * as React from "react";

export function intersperse(elements: JSX.Element[], separator: JSX.Element | string) {
    if (typeof separator === "string") {
        separator = <span>{ separator }</span>;
    }
    const getSeparator = (index: number) => index == 0 ? null : separator;

    return elements.map((e, index) => <span key={ index }>
        { getSeparator(index) }
        { e }
    </span>);
}