import * as React from "react";
import { NavBar } from "../NavBar/NavBar";
import { PageWithHeaderAndUserControls } from "./PageWithHeaderAndUserControls";

export abstract class PageWithHeaderAndNav<TLocationProps> extends PageWithHeaderAndUserControls<TLocationProps> {
    postHeader() {
        return <NavBar />;
    }
}