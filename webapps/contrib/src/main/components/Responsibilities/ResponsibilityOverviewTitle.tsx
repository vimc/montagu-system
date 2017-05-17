import * as React from "react";
import { State, Store } from "../../stores/TouchstoneStore";
import { Touchstone } from "../../Models";
import { isUndefined } from "util";
import { Link } from "simple-react-router";
import { connectToStores } from "../../alt";

const headerStyles = require("../PageWithHeader/PageWithHeader.css");

interface Props {
    touchstoneId: string;
    touchstones?: State;
}

export class ResponsibilityOverviewTitleComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [ Store ]
    }
    static getPropsFromStores() {
        return {
            touchstones: Store.getState()
        };
    }

    touchstone(): Touchstone {
        const touchstone = this.props.touchstones.touchstones.find((x) => x.id == this.props.touchstoneId);
        if (isUndefined(touchstone)) {
            return {
                id: "",
                name: "",
                version: 0,
                description: "",
                status: null,
                years: null
            };
        } else {
            return touchstone;
        }
    }

    render() {
        return <span>
            Responsibilities in { this.touchstone().description }
            <span className={ headerStyles.titleAddition }>
                <Link href="/">Change touchstone</Link>
            </span>
        </span>;
    }
}
export const ResponsibilityOverviewTitle: ComponentConstructor<Props, undefined> = connectToStores(ResponsibilityOverviewTitleComponent);