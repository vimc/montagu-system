import {Client} from "pg";
import {expect} from "chai";
import {Sandbox} from "../test/Sandbox";

import {authActionCreators} from "../main/shared/actions/authActionCreators";

import {localStorageHandler} from "../main/shared/services/localStorageHandler";
import {singletonVariableCache} from "../main/shared/modules/cache/singletonVariableCache";
import {jwtTokenAuth} from "../main/shared/modules/jwtTokenAuth";
import {ReactWrapper} from "enzyme";
import {AbstractLocalService} from "../main/shared/services/AbstractLocalService";

const jwt_decode = require('jwt-decode');

const dbName = process.env.PGDATABASE;
const dbTemplateName = process.env.PGTEMPLATE;

export class TestService extends AbstractLocalService {

    getAnyUrl(url: string) {
        return this.doFetch(this.makeUrl(url, "main"), this.makeRequestOptions("GET", null));
    }
}

export abstract class IntegrationTestSuite {
    abstract description(): string;

    abstract createStore(): any;

    store: any;

    abstract addTestsToMocha(): void;

    db: Client;

    protected constructor() {
        describe(this.description(), () => {

            const sandbox = new Sandbox();

            beforeEach((done: DoneCallback) => {
                queryAgainstRootDb(`CREATE DATABASE ${dbName} TEMPLATE ${dbTemplateName};`)
                    .then(() => {
                        this.db = new Client({});
                        this.db.connect();
                        done();
                    })
                    .catch(e => done(e));
            });
            afterEach((done: DoneCallback) => {
                sandbox.restore();
                this.db.end();
                queryAgainstRootDb(`DROP DATABASE ${dbName};`)
                    .then(() => done())
                    .catch(e => done(e));
            });

            beforeEach((done: DoneCallback) => {
                (global as any).fetch = require('node-fetch');
                singletonVariableCache.clearAll();
                // Note that this will always trigger an authActions.logIn, which will result in all three login
                // stores recording the user to some extent

                this.store = this.createStore();
                this.store.dispatch(authActionCreators.logIn("test@example.com", "password"));
                let unsubscribe = this.store.subscribe(handleChange);
                let that = this;

                function handleChange() {
                    const token = that.store.getState().auth.bearerToken;
                    sandbox.setStubFunc(localStorageHandler, 'get', () => token);
                    unsubscribe();
                    done();
                }
            });

            this.addTestsToMocha();
        });
    }
}

export async function firstDownloadPromise(rendered: ReactWrapper) {
    let url = null;

    // until onetime token has been fetched url will be null
    while (url == null) {
        await timeout(50);
        rendered.update(); // mounted component won't update with new props automatically
        const link = rendered.find("a").first();
        url = link.prop("href");
        console.log(url)
    }

    return fetch(url)
}

export async function lastDownloadPromise(rendered: ReactWrapper) {
    let url = null;
    // until onetime token has been fetched url will be null
    while (url == null) {
        await timeout(50);
        rendered.update(); // mounted component won't update with new props automatically
        const link = rendered.find("a").last();
        url = link.prop("href");
    }

    return fetch(url)
}

async function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function queryAgainstRootDb(query: string): Promise<void> {
    const db = new Client({database: "postgres"});
    db.connect();
    return db.query(query)
        .then(() => {
            db.end();
        });
}

export function expectSameElements<Any>(actual: Any[], expected: Any[]) {
    const failMessage = `Expected ${JSON.stringify(actual, null, 4)} to have same members as ${JSON.stringify(expected, null, 4)}`;
    expect(actual).to.have.members(expected, failMessage);
    expect(expected).to.have.members(actual, failMessage);
}

export function inflateAndDecode(token: string): any {
    return jwt_decode(jwtTokenAuth.inflateToken(token));
}