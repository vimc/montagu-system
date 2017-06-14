import * as React from "react";
import { Touchstone } from "../../models/Generated";
import { RemoteContent } from "../../stores/RemoteContent";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { TouchstoneLink, TouchstoneLinkProps } from "./TouchstoneLink";

const commonStyles = require("../../../shared/styles/common.css");
const styles = require("./TouchstoneList.css");
const chooseStyles = require("./Choose.css");

export interface TouchstoneListProps extends RemoteContent {
    touchstones: Touchstone[];
    selected: Touchstone;
}

export class TouchstoneList extends React.Component<TouchstoneListProps, undefined> {
    static getStores() {
        return [ responsibilityStore ];
    }

    static getPropsFromStores(): TouchstoneListProps {
        const state = responsibilityStore.getState();
        return {
            touchstones: state.touchstones,
            selected: state.currentTouchstone,
            ready: state.ready
        };
    }

    private getLinkProps(touchstone: Touchstone): TouchstoneLinkProps {
        return {
            touchstone: touchstone,
            selected: this.props.selected == touchstone
        };
    }

    renderFinished(content: TouchstoneListProps): JSX.Element {
        const finished = content.touchstones.filter(x => x.status != "open");
        if (finished.length > 0) {
            const items = finished.map((touchstone: Touchstone) =>
                <li key={ touchstone.id}>
                    <TouchstoneLink { ...this.getLinkProps(touchstone) } />
                </li>
            );
            return <ul className={ chooseStyles.list }>{ items }</ul>
        } else {
            return <div>There are no past touchstones.</div>
        }
    }

    renderOpen(content: TouchstoneListProps): JSX.Element {
        const open = content.touchstones.find(x => x.status == "open");
        if (open) {
            return <TouchstoneLink { ...this.getLinkProps(open) } />
        } else {
            return <div>There is no open touchstone currently.</div>
        }
    }

    render(): JSX.Element {
        return <div>
            <div className={ styles.openTouchstone }>
                <div className={ commonStyles.subSectionTitle }>Open touchstone</div>
                <div>{ this.renderOpen(this.props) }</div>
            </div>
            <div className={ styles.finishedTouchstones }>
                <div className={ commonStyles.subSectionTitle }>Past finished touchstones</div>
                <div>{ this.renderFinished(this.props) }</div>
            </div>
        </div>;
    }
}