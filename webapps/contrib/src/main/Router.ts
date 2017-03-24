import { Component } from 'react'
import { Router, RouteMap } from 'simple-react-router'

// Pages
import HomePage from './components/HomePage'
import OtherPage from './components/OtherPage'

export default class AppRouter extends Router {
  routes(map: RouteMap) {
    map('/', HomePage);
    map('/other', OtherPage);
    //map('/:path*', OtherPage) // catchall route 
  }
}