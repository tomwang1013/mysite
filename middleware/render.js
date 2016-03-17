import React from 'react'
import { renderToString } from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import jade from 'jade';
import routes from '../app/routes-babeled';
      
export default function(req, res) {   
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {         
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      var content = renderToString(<RoutingContext {...renderProps} />)
      var page = jade.renderFile('views/index.jade', { content: content });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found');
    }
  });
};
