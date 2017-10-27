import * as React from "react";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { ModellingGroupsList } from "./ModellingGroupsList";
import { groupStore } from "../../../stores/GroupStore";
import { doNothing } from "../../../../shared/Helpers";

export class ViewAllModellingGroupsPage extends AdminPageWithHeader<undefined> {
    componentDidMount() {
        super.componentDidMount();
        setTimeout(() => {
            groupStore.fetchGroups().catch(doNothing);
        });
    }

    name() {
        return "Modelling groups";
    }

    renderPageContent() {
        return <ModellingGroupsList />;
    }
}