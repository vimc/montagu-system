import * as React from "react";
import { connectToStores } from "../../../shared/alt";
import { LogoutComponent } from "../../../shared/components/Login/Logout";
import { adminAuthStore } from "../../stores/ReportingAuthStore";

export const ReportingLogout = connectToStores(class extends LogoutComponent {
    static getStores() {
        return [ adminAuthStore ];
    }

    static getPropsFromStores() {
        return adminAuthStore.getState();
    }
});