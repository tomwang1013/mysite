import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './components/app'
import Home from './components/home'
import Signup from './components/signup'
import Login from './components/login'
import Jobs from './components/jobs'
import CreateJob from './components/create_job'
import Students from './components/students'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />
    <Route path='login' component={Login} />
    <Route path='signup' component={Signup} />
    <Route path='jobs' component={Jobs} />
    <Route path='create_job' component={CreateJob} />
    <Route path='students' component={Students} />
  </Route>
)
