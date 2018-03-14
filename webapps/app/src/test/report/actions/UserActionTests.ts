import {expect} from "chai";

import {Sandbox} from "../../Sandbox";
import {createMockStore} from "../../mocks/mockStore";
import {UserActionKeys} from "../../../main/report/actionTypes/UsersActions";
import {userActionCreators} from "../../../main/report/actions/userActionCreators";
import {UserService} from "../../../main/report/services/UserService";
import {mockUser} from "../../mocks/mockModels";
import {checkAsync} from "../../testHelpers";

describe("User action creators", () => {
    const sandbox = new Sandbox();
    let store: any = null;

    beforeEach(() => {
        store = createMockStore();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("removeReportReader dispatches report readers fetched action", (done) => {
        const fakeUser = mockUser();
        sandbox.setStubFunc(UserService.prototype, "getReportReaders", () => {
            return Promise.resolve([fakeUser]);
        });
        store.dispatch(userActionCreators.getReportReaders("test"));
        checkAsync(done, () => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(UserActionKeys.REPORT_READERS_FETCHED);
            expect(actions[0].data).to.eql([fakeUser]);
        });
    });

    it("removeReportReader dispatches report reader removed action if successful", (done) => {
        const fakeUser = mockUser();
        sandbox.setStubFunc(UserService.prototype, "removeReportReader", () => {
            return Promise.resolve("OK");
        });
        store.dispatch(userActionCreators.removeReportReader("test", "user"));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(UserActionKeys.REPORT_READER_REMOVED);
            expect(actions[0].data).to.eql("user");
            done();
        });
    });

    it("removeReportReader does not dispatch report reader removed action if not successful", (done) => {
        sandbox.setStubFunc(UserService.prototype, "removeReportReader", () => {
            return Promise.reject("reason");
        });
        store.dispatch(userActionCreators.removeReportReader("test", "user"));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions).to.have.lengthOf(0);
            done();
        });
    });

    it("addReportReader adds report reader", (done) => {
        const stub = sandbox.setStubFunc(UserService.prototype, "addReportReader", () => {
            return Promise.resolve("OK");
        });
        setTimeout(() => {
            store.dispatch(userActionCreators.addReportReader("test", "user"));
            expect(stub.calledWith("test", "user")).to.be.true;
            done();
        });
    });

    it("addReportReader calls getReportReaders if successful", (done) => {
        sandbox.setStubFunc(UserService.prototype, "addReportReader", () => {
            return Promise.resolve("OK");
        });
        const stub = sandbox.setStub(userActionCreators, "getReportReaders");
        store.dispatch(userActionCreators.addReportReader("test", "user"));
        setTimeout(() => {
            expect(stub.called).to.be.true;
            done();
        });
    });

    it("addReportReader does not call getReportReaders if not successful", (done) => {
        sandbox.setStubFunc(UserService.prototype, "addReportReader", () => {
            return Promise.reject("error");
        });
        const stub = sandbox.setStub(userActionCreators, "getReportReaders");
        store.dispatch(userActionCreators.addReportReader("test", "user"));
        setTimeout(() => {
            expect(stub.called).to.be.false;
            done();
        });
    });

});
