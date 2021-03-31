import Main from './Main';
import fetch from 'node-fetch';

Main.log('node-ts-starter is ok');

fetch('https://github.com/')
  .then((res) => res.text())
  .then((body) => console.log(body));
