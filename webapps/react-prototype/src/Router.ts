import { Component } from 'react'
import SimpleReactRouter from 'simple-react-router'

// Pages
import HomePage from './components/HomePage'
import OtherPage from './components/OtherPage'
import VaccinePage from './components/VaccinePage'

export default class Router extends SimpleReactRouter {
  routes(map: (path: string, component: new (...args: any[]) => Component<any, any>, params?: any) => void) {
    map('/',                   HomePage)
    map('/other',              OtherPage)
    map('/vaccines',           VaccinePage)
    //map('/:path*',             OtherPage) // catchall route 
  }
}