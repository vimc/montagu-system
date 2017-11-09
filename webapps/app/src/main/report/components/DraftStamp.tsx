import * as React from "react";

interface Props {
    published: boolean;
}

export class DraftStamp extends React.Component<Props, undefined> {
    render() {
        if (this.props.published) {
            return null;
        } else {
            const style = {
                textTransform: "uppercase",
                color: "red",
                border: "2px dashed red",
            };
            return <div className="float-right">
                    <div className="p-2" style={style}>
                        <h2>Draft</h2>
                    </div>
            </div>;
        }
    }
}