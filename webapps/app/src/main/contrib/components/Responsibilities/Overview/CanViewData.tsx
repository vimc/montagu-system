// import * as React from "react"
//
// function withConfidentialityAgreement(WrappedComponent, selectData) {
//
//     return class extends React.Component {
//         constructor(props) {
//             super(props);
//             this.handleChange = this.handleChange.bind(this);
//             this.state = {
//                 data: selectData(DataSource, props)
//             };
//         }
//
//         render() {
//             return <WrappedComponent {...this.props} />;
//         }
//     };
// }