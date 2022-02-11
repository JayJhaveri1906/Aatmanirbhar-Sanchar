import React from 'react';
import ReactDOM from 'react-dom'; //The react-dom package provides DOM-specific methods that can be used at the top level of your app
import './index.css';
import App from './App';
import {useHistory} from 'react-router-dom';

const loader = document.querySelector('.loader'); //Copying CSS and storing in variable from global.css
const overlay = document.querySelector('.overlay');
var showLoader;
var hideLoader;

try {
    showLoader = () => {loader.classList.remove('loader--hide'); overlay.classList.remove('overlay--hide')};//The Element.classList is a read-only property that returns a live DOMTokenList collection of the class attributes of the element.
    hideLoader = () => {loader.remove('loader'); overlay.remove('overlay')};
} catch (err) {
    useHistory.push('/');//The useHistory hook gives you access to the history instance that you may use to navigate.
}


//StrictMode is a tool for highlighting potential problems in an application. Like Fragment.
//StrictMode does not render any visible UI. It activates additional checks and warnings for its descendants.

ReactDOM.render (<React.StrictMode>
    <App hideLoader={hideLoader}
        showLoader={showLoader}/>
</React.StrictMode>, document.getElementById('root'));


//A service worker is a script that your browser runs in the background, separate from a web page, opening the door to features that don't need a web page or user interaction. Today, they already include features like push notifications and background sync and have ability to intercept and handle network requests, including programmatically managing a cache of responses.
// here used cache
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) { // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) { // Registration Failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
