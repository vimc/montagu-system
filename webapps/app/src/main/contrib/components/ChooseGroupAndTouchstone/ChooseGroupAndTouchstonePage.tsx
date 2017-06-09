import * as React from "react";
import { GroupAndTouchstoneChoice } from "./GroupAndTouchstoneChoice";
import { ContribPageWithHeader } from "../PageWithHeader/ContribPageWithHeader";

export class ChooseGroupAndTouchstonePage extends ContribPageWithHeader<undefined> {
    title() {
        return <span>Choose which responsibilities you want to view</span>;
    }

    renderPageContent() {
        return <GroupAndTouchstoneChoice />;
    }
}