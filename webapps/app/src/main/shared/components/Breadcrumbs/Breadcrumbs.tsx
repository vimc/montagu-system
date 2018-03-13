import * as React from 'react';
import { connect } from 'react-redux';

import {InternalLink} from "../InternalLink";
import {Breadcrumb} from "../../models/Breadcrumb";
import {ReportAppState} from "../../../report/reducers/reportAppReducers";
import {ReportsListContainerProps} from "../../../report/components/ReportsList/ReportsList";
import {GlobalState} from "../../reducers/GlobalState";

interface Props {
    crumbs: Breadcrumb[];
}



export class BreadcrumbsComponent extends React.Component<Props, undefined> {

    render(): JSX.Element {
        return (
            <div className="montagu-navbar">
                <div className={"pl-md-1"}></div>
                {this.props.crumbs && this.props.crumbs.map(c =>
                    <div className="montagu-navbar__chunk" key={c.url}>
                        {this.makeLink(c)}
                    </div>
                )}
            </div>
        );
    }

    private makeLink(crumb: Breadcrumb): JSX.Element {
        if (crumb.url != null) {
            return <InternalLink href={crumb.url}>
                {crumb.name}
            </InternalLink>;
        } else {
            return <span>{crumb.name}</span>;
        }
    }
}

export const mapStateToProps = (state: GlobalState): Props => {
    return {
        crumbs: state.breadcrumbs.breadcrumbs
    }
};

export const BreadcrumbsBar = connect(mapStateToProps)(BreadcrumbsComponent);