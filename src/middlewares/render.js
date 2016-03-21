import React from 'react'
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import jade from 'jade';
import App from '../app/components/app'

export default function(req, res) {   
  var content = renderToString(<App />)
  var page = jade.renderFile(__dirname + '/../views/index.jade', { content: content });

  res.send(page);
};
