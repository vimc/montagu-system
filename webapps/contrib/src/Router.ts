import { Component } from 'react'
import { Router, RouteMap } from 'simple-react-router'

// Pages
import HomePage from './components/HomePage'

export default class AppRouter extends Router {
  routes(map: RouteMap) {
    map('/', HomePage)
    //map('/:path*', OtherPage) // catchall route 
  }
}