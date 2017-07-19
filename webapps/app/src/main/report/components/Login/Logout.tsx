import * as React from "react";
import { connectToStores } from "../../../shared/alt";
import { LogoutComponent } from "../../../shared/components/Login/Logout";
import { reportingAuthStore } from "../../stores/ReportingAuthStore";

export const ReportingLogout = connectToStores(class extends LogoutComponent {
    static getStores() {
        return [ reportingAuthStore  ];
    }

    static getPropsFromStores() {
        return reportingAuthStore .getState();
    }
});