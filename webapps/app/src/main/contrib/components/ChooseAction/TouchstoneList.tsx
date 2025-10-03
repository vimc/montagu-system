import * as React from "react";

import { ModellingGroup, TouchstoneVersion } from "../../../shared/models/APITypes";
import { ButtonLink } from "../../../shared/components/ButtonLink";

export interface TouchstoneListProps {
    touchstones: TouchstoneVersion[];
    group: ModellingGroup;
}

export class TouchstoneList extends React.Component<TouchstoneListProps, undefined> {
    renderButtonList(touchstones: TouchstoneVersion[]): JSX.Element {
        const items = touchstones.map((touchstone: TouchstoneVersion) =>
            <li key={ touchstone.id}>
                { this.renderButton(touchstone) }
            </li>
        );
        return <ul className="list-unstyled m-0 p-0">{ items }</ul>;
    }

    touchstoneCompare(a: TouchstoneVersion, b: TouchstoneVersion) {
        //We display each list of touchstones in reverse alphabetical order
        if (b.id > a.id) return 1;
        if (a.id > b.id) return -1;
        return 0;
    }

    renderFinished(content: TouchstoneListProps): JSX.Element {
        const finished = content.touchstones.filter(x => x.status != "open").sort(this.touchstoneCompare);
        if (finished.length > 0) {
            return this.renderButtonList(finished);
        } else {
            return <div>There are no past touchstones.</div>
        }
    }

    renderOpen(content: TouchstoneListProps): JSX.Element {
        const open = content.touchstones.filter(x => x.status == "open").sort(this.touchstoneCompare);
        if (open.length > 0) {
            return this.renderButtonList(open);
        } else {
            return <div>There is no open touchstone currently.</div>
        }
    }

    renderButton(touchstone: TouchstoneVersion): JSX.Element {
        const url = `/${this.props.group.id}/responsibilities/${touchstone.id}/`;
        return <ButtonLink className="d-inline-block mb-2" href={ url }>{ touchstone.description }</ButtonLink>
    }

    render(): JSX.Element {
        return <div>
            <div className="openTouchstones">
                <div className="subSectionTitle">Open touchstone</div>
                <div>{ this.renderOpen(this.props) }</div>
            </div>
            <div className="finishedTouchstones">
                <div className="subSectionTitle">Past finished touchstones</div>
                <div>{ this.renderFinished(this.props) }</div>
            </div>
        </div>;
    }
}