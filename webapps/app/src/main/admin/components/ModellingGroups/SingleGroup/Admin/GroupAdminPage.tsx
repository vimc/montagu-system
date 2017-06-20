import * as React from "react";
import { connectToStores } from "../../../../../shared/alt";
import { ModellingGroupTitle, TitleProps } from "../ModellingGroupTitle";
import { AdminPageWithHeader } from "../../../AdminPageWithHeader";
import { groupStore } from "../../../../stores/GroupStore";
import { modellingGroupActions } from "../../../../actions/ModellingGroupActions";
import { GroupAdminContent } from "./GroupAdminContent";

interface PageProps {
    groupId: string;
}

export class GroupAdminPage extends AdminPageWithHeader<PageProps> {
    componentDidMount() {
        groupStore.fetchGroups().then(_ => {
            modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
            groupStore.fetchGroupDetails()
        });
    }

    title(): JSX.Element {
        return <Title />;
    }

    renderPageContent(): JSX.Element {
        return <GroupAdminContent />;
    }
}

const Title = connectToStores(class extends ModellingGroupTitle {
    renderContent(props: TitleProps) {
        return <span>Manage admin users for { props.group.description }</span>
    }
});