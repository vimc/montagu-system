import * as React from "react";
import { errorStore } from "../../shared/stores/ErrorStore";
import { connectToStores } from "../../shared/alt";
import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { AdminRouter } from "./AdminRouter";
import { adminAuthStore } from "../stores/AdminAuthStore";

export interface AdminAppProps {
    errors: string[];
    loggedIn: boolean;
}

export class AdminAppComponent extends React.Component<AdminAppProps, undefined> {
    static getStores() {
        return [ errorStore, adminAuthStore ];
    }
    static getPropsFromStores(): AdminAppProps {
        return {
            errors: errorStore.getState().errors,
            loggedIn: adminAuthStore.getState().loggedIn
        }
    }

    render() {
        return <div>
            <AdminRouter loggedIn={ this.props.loggedIn } />
            <ErrorLog errors={ this.props.errors } />
        </div>;
    }
}

export const AdminApp = connectToStores(AdminAppComponent);