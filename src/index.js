import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initContract } from './utils';
// import { Provider } from './state/app';

window.nearInitPromise = initContract()
    .then(() => {
        ReactDOM.render(
            // <Provider>
            <App />,
            // </Provider>
            document.querySelector('#root')
        );
    })
    .catch(console.error);
