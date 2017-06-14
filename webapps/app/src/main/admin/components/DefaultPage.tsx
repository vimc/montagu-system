import * as React from "react";
import { AdminPageWithHeader } from "./AdminPageWithHeader";

export class DefaultPage extends AdminPageWithHeader<undefined> {
    title() {
        return <span>Hello world</span>;
    }

    renderPageContent() {
        return <span>Page content</span>;
    }
}