import {Action} from "redux";

export class Sandbox {

    restore() {
        jest.restoreAllMocks();
    }

    setSpy(obj: any, method: string): jest.SpyInstance {
        return jest.spyOn(obj, method);
    }

    setStub(obj: any, method: string): jest.SpyInstance {
        return jest.spyOn(obj, method).mockImplementation(() => {});
    }

    setStubFunc(obj: any, method: string, fn: any): jest.SpyInstance {
        return jest.spyOn(obj, method).mockImplementation(fn);
    }

    createSpy(): jest.Mock {
        return jest.fn()
    }

    stubReduxActionCreator(obj: any, method: string, action: Action): jest.SpyInstance {
        return jest.spyOn(obj, method).mockImplementation((props: any) => ({type:action.type, props: props}));
    }

    setStubReduxAction(obj: any, method: string, action?: any): jest.SpyInstance {
        return jest.spyOn(obj, method).mockImplementation(action ? action : () => ({type: 'test'}));
    }

    stubService(obj: any, method: string, result: any = "default_result"): jest.SpyInstance {
        return this.setStubFunc(obj, method, () => Promise.resolve(result));
    }

    stubServiceWithFailure(obj: any, method: string): jest.SpyInstance {
        return this.setStubFunc(obj, method, () => Promise.reject("error"));
    }
}