import * as React from "react";
import { connectToStores } from "../../../shared/alt";
import { contribAuthStore } from "../../stores/ContribAuthStore";
import { LogoutComponent } from "../../../shared/components/Login/Logout";

export const ContribLogout = connectToStores(class extends LogoutComponent {
    static getStores() {
        return [ contribAuthStore ];
    }

    static getPropsFromStores() {
        return contribAuthStore.getState();
    }
});