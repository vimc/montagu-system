import {mainStore} from "../stores/MainStore";

export const contribAuthActions = {

    afterAuth: () => (dispatch: any) => {
        mainStore.load();
        dispatch( {
            type: 'AFTER_AUTH'
        })
    }

}