import * as React from "react";
import { GroupAndTouchstoneChoice } from "./GroupAndTouchstoneChoice";
import { PageWithHeaderAndUserControls } from "../PageWithHeader/PageWithHeaderAndUserControls";

export class ChooseGroupAndTouchstonePage extends PageWithHeaderAndUserControls<undefined> {
    title() {
        return <span>Choose which responsibilities you want to view</span>;
    }

    renderPageContent() {
        return <GroupAndTouchstoneChoice />;
    }
}