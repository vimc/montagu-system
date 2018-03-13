import * as React from 'react';
import { connect } from 'react-redux';

import {InternalLink} from "../InternalLink";
import {Breadcrumb} from "../../models/Breadcrumb";
import {GlobalState} from "../../reducers/GlobalState";

interface Props {
    crumbs: Breadcrumb[];
}

export const makeLink = (crumb: Breadcrumb): JSX.Element => {
    if (crumb.url != null) {
        return <InternalLink href={crumb.url}>
            {crumb.name}
        </InternalLink>;
    } else {
        return <span>{crumb.name}</span>;
    }
}

export const BreadcrumbsComponent: React.SFC<Props> = (props: Props) => {
    return (
        <div className="montagu-navbar">
            <div className={"pl-md-1"}></div>
            {props.crumbs && props.crumbs.map(c =>
                <div className="montagu-navbar__chunk" key={c.url}>
                    {makeLink(c)}
                </div>
            )}
        </div>
    );
}

export const mapStateToProps = (state: GlobalState): Props => {
    return {
        crumbs: state.breadcrumbs.breadcrumbs
    }
};

export const BreadcrumbsBar = connect(mapStateToProps)(BreadcrumbsComponent);