import * as React from "react";
import { connectToStores } from "../../alt";
import { Responsibility, Touchstone } from "../../Models";
import * as ResponsibilityStore from "../../stores/ResponsibilityStore";
import { RemoteContent } from "../../stores/RemoteContent";
import { RemoteContentComponent } from "../RemoteContentComponent/RemoteContentComponent";

interface Props extends RemoteContent {
    touchstone: Touchstone;
    responsibility: Responsibility;
}

export class ResponsibilityDetailsTitleComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [ ResponsibilityStore.Store ];
    }
    static getPropsFromStores() {
        const state = ResponsibilityStore.Store.getState();
        return {
            touchstone: state.currentTouchstone,
            responsibility: state.currentResponsibility,
            ready: state.currentTouchstone && state.currentResponsibility
        };
    }

    renderContent(props: Props) {
        return <span>
            { props.touchstone.description }: { props.responsibility.scenario.description }
        </span>;
    }
}
export const ResponsibilityDetailsTitle = connectToStores(ResponsibilityDetailsTitleComponent);