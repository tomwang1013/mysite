import React from 'react'
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import jade from 'jade';
import routes from '../app/routes'

export default function(req, res, next) {   
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      return next(error);
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (renderProps) {
      renderProps = Object.assign(renderProps, {
        isLogin: !!req.session.email,
        email: req.session.email
      });

      return res.render('index', {
        content: renderToString(<RouterContext {...renderProps} />)
      });
    }

    next(new Error('no route match'));
  });
};
