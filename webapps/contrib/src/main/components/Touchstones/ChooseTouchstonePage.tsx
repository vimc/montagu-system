import * as React from "react";
import { PageWithHeader } from "../PageWithHeader/PageWithHeader";
import { TouchstoneList } from "./TouchstoneList";

export class ChooseTouchstonePage extends PageWithHeader<undefined, undefined, undefined> {
    title() {
        return <span>Choose a touchstone</span>;
    }

    renderPageContent() {
        return <TouchstoneList />;
    }
}