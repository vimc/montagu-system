import * as React from "react";
import { NavBar } from "../NavBar/NavBar";
import { ContribPageWithHeader } from "./ContribPageWithHeader";

export abstract class PageWithHeaderAndNav<TLocationProps> extends ContribPageWithHeader<TLocationProps> {
    postHeader() {
        return <NavBar />;
    }
}