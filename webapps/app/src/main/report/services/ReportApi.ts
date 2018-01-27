import LocalApiRequest from "../../shared/services/LocalApiRequest";
import store from "../stores/Store";

let token = ''

store.subscribe(listener)

function listener() {
    const state = store.getState();
    token

}

export function ReportApi () {
    return LocalApiRequest({Authorization: 'Bearer ' + token});
}