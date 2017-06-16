import * as React from "react";
import { PageWithHeader } from "../../shared/components/PageWithHeader/PageWithHeader";
import { AdminLogout } from "./Login/Logout";

export abstract class AdminPageWithHeader<TLocationProps> extends PageWithHeader<TLocationProps> {
    header() {
        return <AdminLogout />;
    }

    siteTitle() {
        return "Admin portal";
    }
}