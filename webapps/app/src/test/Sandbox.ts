import * as sinon from 'sinon';
import {mount, MountRendererProps, ReactWrapper} from "enzyme";

import {ReactElement} from "react";
import {Action} from "redux";

export class Sandbox {
    sinon: sinon.SinonSandbox;
    mounted: ReactWrapper<any, any>[];

    constructor() {
        this.sinon = sinon.sandbox.create();
        this.mounted = [];
    }

    private record<P, S>(element: ReactWrapper<P, any>) {
        this.mounted.push(element);
        return element;
    }

    mount<P, S>(node: ReactElement<P>, options?: MountRendererProps): ReactWrapper<P, S> {
        return this.record(mount(node, options));
    }

    restore() {
        this.sinon.restore();
        this.mounted.forEach(x => {
            x.unmount();
        });
        this.mounted = [];
    }

    setSpy(obj: any, method: string): sinon.SinonSpy {
        return this.sinon.spy(obj, method);
    }

    setStub(obj: any, method: string): sinon.SinonStub {
        return this.sinon.stub(obj, method);
    }

    setStubFunc(obj: any, method: string, fn: any): sinon.SinonStub {
        return this.sinon.stub(obj, method).callsFake(fn);
    }

    createSpy(): sinon.SinonSpy {
        return this.sinon.spy();
    }

    stubReduxActionCreator(obj: any, method: string, action: Action): sinon.SinonStub {
        return this.sinon.stub(obj, method).callsFake((props: any) => ({type:action.type, props: props}));
    }

    setStubReduxAction(obj: any, method: string, action?: any): sinon.SinonStub {
        return this.sinon.stub(obj, method).callsFake(action ? action : () => ({type: 'test'}));
    }

    stubService(obj: any, method: string, result: any = "default_result"): sinon.SinonStub {
        return this.setStubFunc(obj, method, () => Promise.resolve(result));
    }

    stubServiceWithFailure(obj: any, method: string): sinon.SinonStub {
        return this.setStubFunc(obj, method, () => Promise.reject("error"));
    }
}