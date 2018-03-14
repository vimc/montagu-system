import {expect} from "chai";
import {UserCacheKeysEnum, UserService} from "../../../main/report/services/UserService";
import {Sandbox} from "../../Sandbox";
import {mockReportAppState} from "../../mocks/mockStates";

describe('User service tests', () => {

    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it('should clear report readers cache when user is removed from report readers', async () => {

        const dispatchStub = sandbox.sinon.stub();
        sandbox.setStub(UserService.prototype, "post");

        const cacheStub = sandbox.setStub(UserService.prototype, "clearCache");

        const sut = (new UserService(dispatchStub, () => mockReportAppState()));
        await sut.removeReportReader("reportname", "username");

        expect(cacheStub.calledWith(UserCacheKeysEnum.reportReaders, "/users/report-readers/reportname/"))
            .to.be.true

    });
});