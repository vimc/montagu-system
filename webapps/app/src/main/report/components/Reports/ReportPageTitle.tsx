import {reportStore} from "../../stores/ReportStore";
import {connectToStores} from "../../../shared/alt";
import * as React from "react";

interface Props {
    name: string;
    displayName: string;
}

export class ReportPageTitleComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [reportStore];
    }

    static getPropsFromStores(): Props {
        const s = reportStore.getState();
        const props: Props = {
            name: s.currentReport,
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
        return <span>{title}</span>;
    }
}

export const ReportPageTitle = connectToStores(ReportPageTitleComponent);