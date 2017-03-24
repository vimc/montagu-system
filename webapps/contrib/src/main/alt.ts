import * as React from 'react'
import * as Alt from 'alt'

const alt = new Alt();
export default alt;

export const connectToStores: <TProperties>(spec: new () => React.Component<TProperties, any>) => new () => React.Component<undefined, undefined> 
    = require('alt-utils/lib/connectToStores');