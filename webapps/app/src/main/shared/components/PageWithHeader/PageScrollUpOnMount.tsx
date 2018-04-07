import * as React from "react";

export function PageScrollOnMount (
    PageScrollOnMountWrapped: ComponentConstructor<any, any>) {
    return class PageScrollOnMountWrapper extends React.Component {
        componentDidMount(){
            window.scrollTo(0, 0);
        }
        render() {
            return <PageScrollOnMountWrapped {...this.props}/>;
        }
    }
};