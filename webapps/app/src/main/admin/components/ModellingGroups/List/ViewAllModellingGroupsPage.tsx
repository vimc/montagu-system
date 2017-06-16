import * as React from "react";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { ModellingGroupsList } from "./ModellingGroupsList";
import { groupStore } from "../../../stores/GroupStore";

export class ViewAllModellingGroupsPage extends AdminPageWithHeader<undefined> {
    componentDidMount() {
        groupStore.fetch();
    }

    title() {
        return <span>Modelling groups</span>
    }

    renderPageContent() {
        return <ModellingGroupsList />;
    }
}