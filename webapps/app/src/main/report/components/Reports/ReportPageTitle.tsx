import {reportStore} from "../../stores/ReportStore";
import {connectToStores} from "../../../shared/alt";
import * as React from "react";

const headerStyles = require("../../../shared/components/PageWithHeader/PageWithHeader.css");

interface Props {
    name: string;
    displayName: string;
    version: string;
}

export class ReportPageTitleComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [reportStore];
    }

    static getPropsFromStores(): Props {
        const s = reportStore.getState();
        const props: Props = {
            name: s.currentReport,
            version: s.currentVersion,
            displayName: null
        };
        const details = s.versionDetails[s.currentReport];
        if (details) {
            props.displayName = details.displayname;
        }
        return props;
    }

    render() {
        const title = this.props.displayName || this.props.name;
        return <span>
            {title}
            <div className={ `${headerStyles.titleAddition}` }>
                Version: {this.props.version}
            </div>
        </span>;
    }
}

export const ReportPageTitle = connectToStores(ReportPageTitleComponent);