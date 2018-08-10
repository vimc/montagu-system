import {Client} from "pg";
import {expect} from "chai";
import {Sandbox} from "../test/Sandbox";

import {authActionCreators} from "../main/shared/actions/authActionCreators";

import {localStorageHandler} from "../main/shared/services/localStorageHandler";
import {singletonVariableCache} from "../main/shared/modules/cache/singletonVariableCache";
import {jwtTokenAuth} from "../main/shared/modules/jwtTokenAuth";

const jwt_decode = require('jwt-decode');

const dbName = process.env.PGDATABASE;
const dbTemplateName = process.env.PGTEMPLATE;

export abstract class IntegrationTestSuite {
    abstract description(): string;

    abstract createStore(): any;

    store: any;

    abstract addTestsToMocha(): void;

    db: Client;

    constructor() {
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
                function handleChange () {
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

function queryAgainstRootDb(query: string): Promise<void> {
    const db = new Client({ database: "postgres" });
    db.connect();
    return db.query(query)
        .then(() => {
            db.end();
        });
}

export function expectIsEqual<T>(actual: T, expected: T) {
    expect(actual).to.eql(expected);
}

export function expectSameElements<Any>(actual: Any[], expected: Any[]) {
    const failMessage = `Expected ${JSON.stringify(actual, null, 4)} to have same members as ${JSON.stringify(expected, null, 4)}`;
    expect(actual).to.have.members(expected, failMessage);
    expect(expected).to.have.members(actual, failMessage);
}

export function inflateAndDecode(token: string): any {
    return jwt_decode(jwtTokenAuth.inflateToken(token));
}