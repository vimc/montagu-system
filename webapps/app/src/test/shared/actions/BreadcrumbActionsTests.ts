import {expect} from "chai";
import { createMemoryHistory } from 'history';

// import {DummyPage} from "./PageWithHeaderTests";
import {Sandbox} from "../../Sandbox";
import {PageBreadcrumb} from "../../../main/shared/components/PageWithHeader/PageWithHeader";
import {createReportStore} from "../../../main/report/stores/createReportStore";
import {breadcrumbsActions} from "../../../main/shared/actions/breadcrumbsActions";
import {ReportAppState} from "../../../main/report/reducers/reportAppReducers";
// import {mockLocation, mockMatch} from "../../mocks/mocks";

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



describe("Breadcrumbs Actions", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("initializes breadcrumbs for page A", () => {
        const history = createMemoryHistory();
        let store = createReportStore(history);
        store.dispatch(breadcrumbsActions.createBreadcrumbs(A.breadcrumb()));
        const state = store.getState() as ReportAppState;
        const breadcrumbs = state.breadcrumbs.breadcrumbs;
        expect(breadcrumbs.length).to.equal(1);
        expect(breadcrumbs[0].name).to.equal("A");
        expect(breadcrumbs[0].url).to.equal("/");
    });

    it("initializes breadcrumbs for page B", () => {
        const history = createMemoryHistory();
        let store = createReportStore(history);
        store.dispatch(breadcrumbsActions.createBreadcrumbs(B.breadcrumb()));
        const state = store.getState() as ReportAppState;
        const breadcrumbs = state.breadcrumbs.breadcrumbs;
        expect(breadcrumbs.length).to.equal(2);
        expect(breadcrumbs[0].name).to.equal("A");
        expect(breadcrumbs[0].url).to.equal("/");
        expect(breadcrumbs[1].name).to.equal("B");
        expect(breadcrumbs[1].url).to.equal("/b/");
    });
});

