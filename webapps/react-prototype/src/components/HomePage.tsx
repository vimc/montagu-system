import * as React from "react";
import { Link } from 'simple-react-router'

export default class HomePage extends React.Component<undefined, undefined> {
    render() {
        return <div>
            <h1>Hello from TypeScript and React!</h1>
            <ul>
                <li><Link href="/other">Click here</Link></li>
                <li><Link href="/vaccines">Vaccines</Link></li>
            </ul>
        </div>;
    }
}