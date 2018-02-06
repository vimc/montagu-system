import { Client } from "pg";
// import { checkPromise } from "../test/testHelpers";
import { expect } from "chai";

// import { createStore, applyMiddleware, combineReducers } from "redux";
// import thunk from 'redux-thunk';
// import { authReducer } from "../main/shared/reducers/authReducer";
import { authActions } from "../main/shared/actions/authActions";

// import { logIn } from "../main/shared/sources/LoginSource";
// import { AuthStoreBaseInterface } from "../main/shared/stores/AuthStoreBase";
import fetcher, { Fetcher } from "../main/shared/sources/Fetcher";
import { alt } from "../main/shared/alt";

const dbName = process.env.PGDATABASE;
const dbTemplateName = process.env.PGTEMPLATE;

export abstract class IntegrationTestSuite {
    abstract description(): string;

    // abstract authStore(): AuthStoreBaseInterface<any>;
    abstract createStore(): any;
    store: any;

    abstract makeFetcher(): Fetcher;

    abstract addTestsToMocha(): void;

    db: Client;

    constructor() {
        describe(this.description(), () => {
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
                this.db.end();
                queryAgainstRootDb(`DROP DATABASE ${dbName};`)
                    .then(() => done())
                    .catch(e => done(e));
            });

            beforeEach((done: DoneCallback) => {
                (global as any).fetch = require('node-fetch');
                fetcher.fetcher = this.makeFetcher();
                // Note that this will always trigger an authActions.logIn, which will result in all three login
                // stores recording the user to some extent

                this.store = this.createStore();
                this.store.dispatch(authActions.logIn("test@example.com", "password"));
                // let unsubscribe = this.store.subscribe(handleChange);
                console.log(111111);
                let that = this;
                function handleChange () {
                    console.log(222, that.store.getState());
                    done();
                }
                // checkPromise(done, logIn("test@example.com", "password", this.authStore(), false));
            });
            afterEach(() => alt.recycle());

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
    const failMessage = `Expected ${JSON.stringify(actual, null, 4)} to have same members as ${JSON.stringify(expected, null, 4)}`
    expect(actual).to.have.members(expected, failMessage);
    expect(expected).to.have.members(actual, failMessage);
}