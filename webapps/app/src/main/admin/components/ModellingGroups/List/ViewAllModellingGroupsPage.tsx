import * as React from "react";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { ModellingGroupsList } from "./ModellingGroupsList";
import { groupStore } from "../../../stores/GroupStore";
import { doNothing } from "../../../../shared/Helpers";

export class ViewAllModellingGroupsPage extends AdminPageWithHeader<undefined> {
    componentDidMount() {
        setTimeout(() => {
            groupStore.fetchGroups().catch(doNothing);
        });
    }

    title() {
        return <span>Modelling groups</span>
    }

    renderPageContent() {
        return <ModellingGroupsList />;
    }
}