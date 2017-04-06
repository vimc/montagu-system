import * as React from "react";
import { Link } from 'simple-react-router'
import { PageWithHeader } from './PageWithHeader'

export default class OtherPage extends PageWithHeader<undefined, undefined> {
	title: String = "Other page";

    renderPageContent(): JSX.Element {
        return <div>
            <Link href="/">Return</Link>
        </div>;
    }
}