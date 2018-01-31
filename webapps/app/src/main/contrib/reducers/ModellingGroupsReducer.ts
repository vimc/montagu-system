// import { ActionsTypes, TypeKeys } from "../actionTypes/AuthTypes";

// export interface AuthState {
//     loggedIn: boolean;
//     username: string;
//     bearerToken: string;
//     permissions: string[];
//     modellingGroups?: any;
// }
//
// const initialState: AuthState = {
//     bearerToken: null,
//     loggedIn: false,
//     username: null,
//     permissions: []
// };

export const modellingGroupsReducer = (state = {}, action: any) => {
    switch (action.type) {
        case "GROUPS_FETCHED":
            console.log('gr f', action.data)
            return { items: action.data };
        default:
            return state;
    }
};

