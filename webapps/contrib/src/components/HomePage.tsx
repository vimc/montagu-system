import * as React from "react";
import { Link } from 'simple-react-router'

export default class HomePage extends React.Component<undefined, undefined> {
    render() {
        return <div>
            <h1>Modelling groups contribution portal</h1>
            <div>Hello world!</div>
            <Link href="/other" />
        </div>;
    }
}