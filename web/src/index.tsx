import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from 'react-moralis';

const appId = "BwBPUFkWOjM5sRV6xhkSehGfc0ii3miGAJcQ3PGL";
const serverUrl = "https://po8w3hemjohl.usemoralis.com:2053/server";

ReactDOM.render(
  <React.StrictMode>
    {/* <MoralisProvider appId={appId} serverUrl={serverUrl} initializeOnMount> */}
      <App />
    {/* </MoralisProvider>, */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
