import {expect} from "chai";
import {PageWithHeader} from "../../main/shared/components/PageWithHeader/PageWithHeader";
import {Sandbox} from "../Sandbox";
import {Action, getActions} from "../actionHelpers";
import {Breadcrumb} from "../../main/shared/models/Breadcrumb";
import {checkAsync} from "../testHelpers";
import {navActions} from "../../main/shared/actions/NavActions";

export function addNavigationTests(page: PageWithHeader<any>, sandbox: Sandbox) {
    const testCrumbIsAsExpected = function(done: DoneCallback, getCrumbsFromAction: (action: Action) => Breadcrumb[]) {
        const spy = sandbox.dispatchSpy();
        page.componentDidMount();
        checkAsync(done, () => {
            const actions = getActions(spy);
            expect(actions).to.have.length.greaterThan(0, "No actions were emitted");

            const action = actions[actions.length - 1];
            const crumbs = getCrumbsFromAction(action);
            const asString = JSON.stringify(crumbs, null, 4);
            crumbs.forEach(crumb => {
                expect(crumb.name !== null).to.equal(true, "Expected name not to be null in " + asString);
                expect(crumb.url !== null).to.equal(true, "Expected URL not to be null in " + asString);
                expect(crumb.name !== undefined).to.equal(true, "Expected name not to be undefined in " + asString);
                expect(crumb.url !== undefined).to.equal(true, "Expected URL not to be undefined in " + asString);
            });
        });
    };

    it("can be initialized at", (done: DoneCallback) => {
        testCrumbIsAsExpected(done, action => {
            expect(action.action).to.equal("NavActions.initialize");
            return action.payload as Breadcrumb[];
        });
    });

    it("can be navigated to", (done: DoneCallback) => {
        navActions.initialize(null);
        testCrumbIsAsExpected(done, action => {
            expect(action.action).to.equal("NavActions.navigate");
            const crumb = action.payload as Breadcrumb;
            return [crumb];
        });
    });
}