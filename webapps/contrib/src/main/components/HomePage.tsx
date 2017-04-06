import * as React from "react";
import { Link } from 'simple-react-router'
import { PageWithHeader } from './PageWithHeader'

export default class HomePage extends PageWithHeader<undefined, undefined> {	
	title: String = "Home page";

    renderPageContent() {
        return <div>
            <div>Hello world!</div>
            <Link href="/other">Other page</Link>
        </div>;
    }
}