import * as React from "react";
import { compose, branch, renderComponent } from "recompose";

import { ModellingGroup, Touchstone } from "../../../shared/models/Generated";
import { TouchstoneList } from "./TouchstoneList";
import { isNullOrUndefined } from "util";
import { InternalLink } from "../../../shared/components/InternalLink";
import {LoadingElement} from "../../../shared/partials/LoadingElement/LoadingElement";

export interface ChooseActionContentProps {
    touchstones: Touchstone[];
    group: ModellingGroup
}

export const ChooseActionContentComponent: React.SFC<ChooseActionContentProps> = (props: ChooseActionContentProps) => {
    return <div>
        <div className="sectionTitle">Your responsibilities</div>
        <p>
            Click on any of the past and open touchstones below to view your
            group's responsibilities in that touchstone and to download
            vaccination coverage and demographic input datasets for each
            responsibility. Additionally, for open touchstones, you will
            be able to upload the estimates associated with each responsibility.
        </p>
        <p>
            <InternalLink href="/help/touchstones/">What is a touchstone?</InternalLink>
        </p>
        <TouchstoneList
            touchstones={ props.touchstones }
            group={ props.group }
        />
    </div>;
}

export const ChooseActionContent = compose(
    branch((props: ChooseActionContentProps) => (!props.group), renderComponent(LoadingElement))
)(ChooseActionContentComponent) as React.ComponentClass<ChooseActionContentProps>;