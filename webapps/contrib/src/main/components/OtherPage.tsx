import * as React from "react";
import { Link } from 'simple-react-router'

export default class OtherPage extends React.Component<undefined, undefined> {
    render() {
        return <div>
            <h1>Another page</h1>
            <Link href="/">Return</Link>
        </div>;
    }
}