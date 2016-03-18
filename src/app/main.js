import React from 'react'
import { Router } from 'react-router'
import { render } from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes'

const history = createBrowserHistory();
render(<Router history={history}>{routes}</Router>, document.getElementById('app'));
