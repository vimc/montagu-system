import * as React from "react";
import { ModellingGroup, Touchstone } from "../../../shared/models/Generated";
import { RemoteContent } from "../../../shared/models/RemoteContent";
import { ButtonLink } from "../../../shared/components/ButtonLink";

import "../../../shared/styles/common.scss";
import "./ChooseTouchstone.scss";

export interface TouchstoneListProps extends RemoteContent {
    touchstones: Touchstone[];
    group: ModellingGroup;
}

export class TouchstoneList extends React.Component<TouchstoneListProps, undefined> {
    renderButtonList(touchstones: Touchstone[]): JSX.Element {
        const items = touchstones.map((touchstone: Touchstone) =>
            <li key={ touchstone.id}>
                { this.renderButton(touchstone) }
            </li>
        );
        return <ul className="list">{ items }</ul>;
    }

    renderFinished(content: TouchstoneListProps): JSX.Element {
        const finished = content.touchstones.filter(x => x.status != "open");
        if (finished.length > 0) {
            return this.renderButtonList(finished);
        } else {
            return <div>There are no past touchstones.</div>
        }
    }

    renderOpen(content: TouchstoneListProps): JSX.Element {
        const open = content.touchstones.filter(x => x.status == "open");
        if (open.length > 0) {
            return this.renderButtonList(open);
        } else {
            return <div>There is no open touchstone currently.</div>
        }
    }

    renderButton(touchstone: Touchstone): JSX.Element {
        const url = `/${this.props.group.id}/responsibilities/${touchstone.id}/`;
        return <ButtonLink className="choice" href={ url }>{ touchstone.description }</ButtonLink>
    }

    render(): JSX.Element {
        return <div>
            <div>
                <div className="subSectionTitle">Open touchstone</div>
                <div>{ this.renderOpen(this.props) }</div>
            </div>
            <div>
                <div className="subSectionTitle">Past finished touchstones</div>
                <div>{ this.renderFinished(this.props) }</div>
            </div>
        </div>;
    }
}