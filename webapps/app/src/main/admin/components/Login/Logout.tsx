import * as React from "react";
import { connectToStores } from "../../../shared/alt";
import { LogoutComponent } from "../../../shared/components/Login/LoggedInUserBox";
import { adminAuthStore } from "../../stores/AdminAuthStore";

export const AdminLogout = connectToStores(class extends LogoutComponent {
    static getStores() {
        return [ adminAuthStore ];
    }

    static getPropsFromStores() {
        return adminAuthStore.getState();
    }
});