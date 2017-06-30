import * as React from "react";
import { ModellingGroupDetailsContent } from "./ModellingGroupDetailsContent";
import { connectToStores } from "../../../../../shared/alt";
import { ModellingGroupTitle, TitleProps } from "../ModellingGroupTitle";
import { AdminPageWithHeader } from "../../../AdminPageWithHeader";
import { groupStore } from "../../../../stores/GroupStore";
import { modellingGroupActions } from "../../../../../shared/actions/ModellingGroupActions";
import { doNothing } from "../../../../../shared/Helpers";
import { userStore } from "../../../../stores/UserStore";

export interface PageProps {
    groupId: string;
}

export class ViewModellingGroupDetailsPage extends AdminPageWithHeader<PageProps> {
    componentDidMount() {
        setTimeout(() => {
            groupStore.fetchGroups().catch(doNothing).then(() => {
                modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
                groupStore.fetchGroupDetails().catch(doNothing);
            });
            userStore.fetchUsers().catch(doNothing);
        });
    }

    title(): JSX.Element {
        return <Title />;
    }

    renderPageContent(): JSX.Element {
        return <ModellingGroupDetailsContent />;
    }
}

const Title = connectToStores(class extends ModellingGroupTitle {
    renderContent(props: TitleProps) {
        return <span>{ props.group.description }</span>;
    }
});