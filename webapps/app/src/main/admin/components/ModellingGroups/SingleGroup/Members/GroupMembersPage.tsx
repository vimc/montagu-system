import * as React from "react";
import { connectToStores } from "../../../../../shared/alt";
import {GroupTitleProps, ModellingGroupTitle} from "../ModellingGroupTitle";
import { AdminPageWithHeader } from "../../../AdminPageWithHeader";
import { groupStore } from "../../../../stores/GroupStore";
import { modellingGroupActions } from "../../../../../shared/actions/ModellingGroupActions";
import { GroupMembersContent } from "./GroupMembersContent";
import { doNothing } from "../../../../../shared/Helpers";
import { userStore } from "../../../../stores/UserStore";
import {IPageWithParent} from "../../../../../shared/models/Breadcrumb";
import {ViewModellingGroupDetailsPage} from "../Details/ViewModellingGroupDetailsPage";
import { Page } from "../../../../../shared/components/PageWithHeader/Page";

interface PageProps {
    groupId: string;
}

export class GroupMembersPage extends AdminPageWithHeader<PageProps> {
    load(props: PageProps) {
        return this.loadParent(props).then(() => {
            modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
            return groupStore.fetchGroupDetails();
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

    render(): JSX.Element {
        return <Page page={this}>
            <GroupMembersContent />
        </Page>;
    }
}

const Title = connectToStores(class extends ModellingGroupTitle {
    renderContent(props: GroupTitleProps) {
        return <span>Manage admin users for { props.group.description }</span>
    }
});