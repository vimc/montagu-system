import * as React from "react";
import { ModellingGroupDetailsContent } from "./ModellingGroupDetailsContent";
import { connectToStores } from "../../../../../shared/alt";
import { ModellingGroupTitle, GroupTitleProps } from "../ModellingGroupTitle";
import { AdminPageWithHeader } from "../../../AdminPageWithHeader";
import { groupStore } from "../../../../stores/GroupStore";
import { modellingGroupActions } from "../../../../../shared/actions/ModellingGroupActions";
import { doNothing } from "../../../../../shared/Helpers";
import { userStore } from "../../../../stores/UserStore";
import {IPageWithParent} from "../../../../../shared/models/Breadcrumb";
import {ViewAllModellingGroupsPage} from "../../List/ViewAllModellingGroupsPage";

export interface ModellingGroupDetailsPageProps {
    groupId: string;
}

export class ViewModellingGroupDetailsPage extends AdminPageWithHeader<ModellingGroupDetailsPageProps> {
    load() {
        super.load();
        groupStore.fetchGroups().catch(doNothing).then(() => {
            modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
            groupStore.fetchGroupDetails().catch(doNothing);
        });
        userStore.fetchUsers().catch(doNothing);
    }

    name(): string {
        return "Group details";
    }

    urlFragment(): string {
        const s = groupStore.getState();
        return `${s.currentGroupId}/`;
    }

    parent(): IPageWithParent {
        return new ViewAllModellingGroupsPage();
    }

    title(): JSX.Element {
        return <Title />;
    }

    renderPageContent(): JSX.Element {
        return <ModellingGroupDetailsContent />;
    }
}

const Title = connectToStores(class extends ModellingGroupTitle {
    renderContent(props: GroupTitleProps) {
        return <span>{ props.group.description }</span>;
    }
});