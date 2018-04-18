import {expect} from "chai";
import { createMemoryHistory } from 'history';

import {Sandbox} from "../../Sandbox";
import {PageBreadcrumb} from "../../../main/shared/components/PageWithHeader/PageWithHeader";
import {createReportStore} from "../../../main/report/stores/createReportStore";
import {breadcrumbsActionCreators} from "../../../main/shared/actions/breadcrumbsActionsCreators";
import {ReportAppState} from "../../../main/report/reducers/reportAppReducers";

class A {
    static breadcrumb() : PageBreadcrumb {
        return {
            name: "A",
            urlFragment: "/",
            parent: null
        }
    }
}

class B {
    static breadcrumb() : PageBreadcrumb {
        return {
            name: "B",
            urlFragment: "b/",
            parent: A.breadcrumb()
        }
    }
}

describe("Breadcrumbs actions integration tests with store", () => {

    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("initializes breadcrumbs for page A", () => {
        const history = createMemoryHistory();
        let store = createReportStore(history);
        store.dispatch(breadcrumbsActionCreators.createBreadcrumbs(A.breadcrumb()));
        const state = store.getState() as ReportAppState;
        const breadcrumbs = state.breadcrumbs.breadcrumbs;
        expect(breadcrumbs.length).to.equal(1);
        expect(breadcrumbs[0].name).to.equal("A");
        expect(breadcrumbs[0].url).to.equal("/");
    });

    it("initializes breadcrumbs for page B", () => {
        const history = createMemoryHistory();
        let store = createReportStore(history);
        store.dispatch(breadcrumbsActionCreators.createBreadcrumbs(B.breadcrumb()));
        const state = store.getState() as ReportAppState;
        const breadcrumbs = state.breadcrumbs.breadcrumbs;
        expect(breadcrumbs.length).to.equal(2);
        expect(breadcrumbs[0].name).to.equal("A");
        expect(breadcrumbs[0].url).to.equal("/");
        expect(breadcrumbs[1].name).to.equal("B");
        expect(breadcrumbs[1].url).to.equal("/b/");
    });
});

describe("Breadcrumbs actions tests with mock store", () => {

    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());



});
