import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import jade from 'jade'
import routes from '../app/routes'
import reducer from '../app/reducers'
import { userLogin } from '../app/actions'

export default function(req, res, next) {   
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      return next(error);
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (renderProps) {
      const store = createStore(reducer);

      if (req.currentUser) {
        store.dispatch(userLogin(req.currentUser.email, req.currentUser.userType));
      }

      return res.render('index', {
        content: renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        ),
        initialState: store.getState()
      });
    }

    next(new Error('no route match'));
  });
};
