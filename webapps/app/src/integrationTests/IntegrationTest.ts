import { Client } from "pg";
import { checkPromise } from "../test/testHelpers";
import { expect } from "chai";
import { logIn } from "../main/shared/sources/LoginSource";
import { AuthStoreBaseInterface } from "../main/shared/stores/AuthStoreBase";
import fetcher, { Fetcher } from "../main/shared/sources/Fetcher";
import { alt } from "../main/shared/alt";

const dbName = process.env.PGDATABASE;
const dbTemplateName = process.env.PGTEMPLATE;

export abstract class IntegrationTestSuite {
    abstract description(): string;

    abstract authStore(): AuthStoreBaseInterface<any>;

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
                        console.log("Connected to application database");
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
                checkPromise(done, logIn("test.user@imperial.ac.uk", "password", this.authStore(), false));
            });
            afterEach(() => alt.recycle());

            this.addTestsToMocha();
        });
    }
}

function queryAgainstRootDb(query: string): Promise<void> {
    const db = new Client({ database: "postgres" });
    db.connect();
    console.log("Connected to root database");
    return db.query(query)
        .then(() => {
            console.log("Ran against root database: " + query);
            db.end();
        });
}

export function expectIsEqual<T>(actual: T, expected: T) {
    expect(actual).to.eql(expected);
}