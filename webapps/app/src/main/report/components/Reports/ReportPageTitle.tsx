import {reportStore} from "../../stores/ReportStore";
import {connectToStores} from "../../../shared/alt";
import * as React from "react";

import * as headerStyles from '../../../shared/components/PageWithHeader/PageWithHeader.scss';

export interface ReportPageTitleProps {
    name: string;
    displayName: string;
    version: string;
}

export class ReportPageTitleComponent extends React.Component<ReportPageTitleProps, undefined> {
    static getStores() {
        return [reportStore];
    }

    static getPropsFromStores(): ReportPageTitleProps {
        const s = reportStore.getState();
        const props: ReportPageTitleProps = {
            name: s.currentReport,
            version: s.currentVersion,
            displayName: null
        };
        const details = s.versionDetails[s.currentVersion];
        if (details) {
            props.displayName = details.displayname;
        }
        return props;
    }

    render() {
        const title = this.props.displayName || this.props.name;
        return <span>
            <div>{title}</div>
            <div className={ `${headerStyles.titleAddition}` }>
                Version: {this.props.version}
            </div>
        </span>;
    }
}

export const ReportPageTitle = connectToStores(ReportPageTitleComponent);