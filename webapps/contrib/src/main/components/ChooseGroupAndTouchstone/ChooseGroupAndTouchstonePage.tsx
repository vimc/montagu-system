import * as React from "react";
import { PageWithHeader } from "../PageWithHeader/PageWithHeader";
import { GroupAndTouchstoneChoice } from "./GroupAndTouchstoneChoice";

export class ChooseGroupAndTouchstonePage extends PageWithHeader<undefined> {
    title() {
        return <span>Choose which responsibilities you want to view</span>;
    }

    showNavBar() {
        return false;
    }

    renderPageContent() {
        return <GroupAndTouchstoneChoice />;
    }
}