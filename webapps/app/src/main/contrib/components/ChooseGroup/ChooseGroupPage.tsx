import * as React from "react";
import { ChooseGroupContent } from "./ChooseGroupContent";
import { ContribPageWithHeader } from "../PageWithHeader/ContribPageWithHeader";

export class ChooseGroupPage extends ContribPageWithHeader<undefined> {
    title() {
        return <span>Choose a modelling group</span>;
    }

    renderPageContent() {
        return <ChooseGroupContent />;
    }
}