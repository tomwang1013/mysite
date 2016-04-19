import React from 'react'
import { Router, browserHistory } from 'react-router'
import { render } from 'react-dom'
import routes from './routes'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from './reducers'

const initialState = window.__INITIAL_STATE__
const store = createStore(reducer, initialState)

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('app')
);
