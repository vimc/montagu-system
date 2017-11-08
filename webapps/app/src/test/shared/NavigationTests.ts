import {expect} from "chai";
import {PageWithHeader} from "../../main/shared/components/PageWithHeader/PageWithHeader";
import {Sandbox} from "../Sandbox";
import {Action, findActionWithName, getActions} from "../actionHelpers";
import {Breadcrumb} from "../../main/shared/models/Breadcrumb";
import {checkAsync} from "../testHelpers";
import {navActions} from "../../main/shared/actions/NavActions";
import {isNullOrUndefined} from "util";

export function addNavigationTests(page: PageWithHeader<any>, sandbox: Sandbox, setup?: () => void) {
    const testCrumbIsAsExpected = function(done: DoneCallback, getCrumbsFromActions: (actions: Action[]) => Breadcrumb[]) {
        if (setup) {
            setup();
        }

        const spy = sandbox.dispatchSpy();
        page.load();
        checkAsync(done, () => {
            const actions = getActions(spy);
            expect(actions).to.have.length.greaterThan(0, "No actions were emitted");

            const crumbs = getCrumbsFromActions(actions);
            const asString = JSON.stringify(crumbs, null, 4);
            crumbs.forEach(crumb => {
                expect(crumb.name !== null).to.equal(true, "Expected name not to be null in " + asString);
                expect(crumb.url !== null).to.equal(true, "Expected URL not to be null in " + asString);
                expect(crumb.name !== undefined).to.equal(true, "Expected name not to be undefined in " + asString);
                expect(crumb.url !== undefined).to.equal(true, "Expected URL not to be undefined in " + asString);
            });
            //console.log("Last crumb: " + JSON.stringify(crumbs[crumbs.length - 1]));
        });
    };

    it("can be initialized at", (done: DoneCallback) => {
        testCrumbIsAsExpected(done, actions => {
            const action = findActionWithName(actions, "NavActions.initialize");
            return action.payload as Breadcrumb[];
        });
    });

    it("can be navigated to", (done: DoneCallback) => {
        navActions.initialize(null);
        testCrumbIsAsExpected(done, actions => {
            const action = findActionWithName(actions, "NavActions.navigate");
            const crumb = action.payload as Breadcrumb;
            return [crumb];
        });
    });
}