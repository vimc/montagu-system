import * as React from "react";
import { connectToStores } from "../../../../../shared/alt";
import {GroupTitleProps, ModellingGroupTitle} from "../ModellingGroupTitle";
import { AdminPageWithHeader } from "../../../AdminPageWithHeader";
import { groupStore } from "../../../../stores/GroupStore";
import { modellingGroupActions } from "../../../../../shared/actions/ModellingGroupActions";
import { GroupAdminContent } from "./GroupAdminContent";
import { doNothing } from "../../../../../shared/Helpers";
import { userStore } from "../../../../stores/UserStore";
import {IPageWithParent} from "../../../../../shared/models/Breadcrumb";
import {ViewModellingGroupDetailsPage} from "../Details/ViewModellingGroupDetailsPage";

interface PageProps {
    groupId: string;
}

export class GroupAdminPage extends AdminPageWithHeader<PageProps> {
    load() {
        userStore.fetchUsers().catch(doNothing);
        groupStore.fetchGroups().catch(doNothing).then(() => {
            modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
            groupStore.fetchGroupDetails().catch(doNothing).then(() => {
                super.load();
            });
        });
    }

    name(): string {
        return "Manage group members";
    }

    title(): JSX.Element {
        return <Title />;
    }

    urlFragment(): string {
        return `admin/`;
    }

    parent(): IPageWithParent {
        return new ViewModellingGroupDetailsPage();
    }

    renderPageContent(): JSX.Element {
        return <GroupAdminContent />;
    }
}

const Title = connectToStores(class extends ModellingGroupTitle {
    renderContent(props: GroupTitleProps) {
        return <span>Manage admin users for { props.group.description }</span>
    }
});