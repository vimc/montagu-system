import * as React from "react";
import { ModellingGroupDetailsContent } from "./ModellingGroupDetailsContent";
import { connectToStores } from "../../../../../shared/alt";
import { ModellingGroupTitle, TitleProps } from "../ModellingGroupTitle";
import { AdminPageWithHeader } from "../../../AdminPageWithHeader";
import { groupStore } from "../../../../stores/GroupStore";
import { modellingGroupActions } from "../../../../actions/ModellingGroupActions";

interface PageProps {
    groupId: string;
}

export class ViewModellingGroupDetailsPage extends AdminPageWithHeader<PageProps> {
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
        return <ModellingGroupDetailsContent />;
    }
}

const Title = connectToStores(class extends ModellingGroupTitle {
    renderContent(props: TitleProps) {
        return <span>{ props.group.description }</span>;
    }
});