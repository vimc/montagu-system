import {expect} from "chai";
import {PageWithHeader} from "../../main/shared/components/PageWithHeader/PageWithHeader";
import {Sandbox} from "../Sandbox";
import {Action, findActionWithName, getActions} from "../actionHelpers";
import {Breadcrumb} from "../../main/shared/models/Breadcrumb";
import {checkAsync} from "../testHelpers";
import {navActions} from "../../main/shared/actions/NavActions";
import {isNullOrUndefined} from "util";

function checkString(value: string, name: string, context: string) {
    expect(value).not.to.equal("", `Expected ${name} not to be empty in ${context}`);
    expect(value).not.to.equal(null, `Expected ${name} not to be null in ${context}`);
    expect(value === undefined).to.equal(false, `Expected ${name} not to be null in ${context}`);
    expect(value).not.to.contain("null", `Expected ${name} not to contain 'null' in ${context}`);
    expect(value).not.to.contain("undefined", `Expected ${name} not to contain 'undefined' in ${context}`);
}

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
                checkString(crumb.name, "name", asString);
                checkString(crumb.url, "URL", asString);
            });
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