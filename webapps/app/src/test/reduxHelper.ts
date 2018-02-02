import { createStore } from "redux";

export const reduxHelper = {

    createAdminUserStore: () => {
        return createStore(state => state, {auth: {permissions: [
            '*/modelling-groups.manage-members',
            "*/roles.write"
        ]}})
    },

    createStore: (state:any) => {
        return createStore(state => state, state)
    }
}