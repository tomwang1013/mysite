import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './components/app'
import Home from './components/home'
import Signup from './components/signup'
import Login from './components/login'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />
    <Route path='login' component={Login} />
    <Route path='signup' component={Signup} />
  </Route>
)
