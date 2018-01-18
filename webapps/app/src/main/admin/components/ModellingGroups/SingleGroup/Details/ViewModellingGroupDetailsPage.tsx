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
import { Page } from "../../../../../shared/components/PageWithHeader/Page";

export interface ModellingGroupDetailsPageProps {
    groupId: string;
}

export class ViewModellingGroupDetailsPage extends AdminPageWithHeader<ModellingGroupDetailsPageProps> {
    componentDidMount() {
        setTimeout(()=> {
            userStore.fetchUsers().catch(doNothing);
            groupStore.fetchGroups().catch(doNothing).then(() => {
                modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
                groupStore.fetchGroupDetails().catch(doNothing).then(() => {
                    super.load();
                });
            });
        });
    }

    name(): string {
        const s = groupStore.getState();
        return s.currentGroupId;
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

    render(): JSX.Element {
        return <Page page={this}>
            <ModellingGroupDetailsContent />
        </Page>;
    }
}

const Title = connectToStores(class extends ModellingGroupTitle {
    renderContent(props: GroupTitleProps) {
        return <span>{ props.group.description }</span>;
    }
});