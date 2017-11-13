import * as React from "react";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { ModellingGroupsList } from "./ModellingGroupsList";
import { groupStore } from "../../../stores/GroupStore";
import { doNothing } from "../../../../shared/Helpers";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {MainMenu} from "../../MainMenu/MainMenu";

export class ViewAllModellingGroupsPage extends AdminPageWithHeader<undefined> {
    load() {
        groupStore.fetchGroups().catch(doNothing).then(() => {
            super.load();
        });
    }

    name(): string {
        return "Modelling groups";
    }

    urlFragment(): string {
        return "modelling-groups/";
    }

    parent(): IPageWithParent {
        return new MainMenu();
    }

    renderPageContent() {
        return <ModellingGroupsList />;
    }
}