import React from 'react';
import 後端 from './後端';

import './App.css';

import { Promise } from 'bluebird';
import { Link } from 'react-router';
var superagent = require('superagent-promise')(require('superagent'), Promise);
import Debug from 'debug';
var debug = Debug('itaigi:App');

export default class App extends React.Component {

  render() {
    return (
    <div className='app background'>
      <h1 className='ui  blue header'>臺語線頂錄音</h1>
        { React.cloneElement(
          this.props.children,
          {
            後端網址: 後端.網址(),
          }
        )}
    </div>
    );
  }
}

App.propTypes = {
  history: React.PropTypes.object,
  children: React.PropTypes.object,
};
