// Modules;
import React, {Suspense} from 'react';
import LazyLoad from 'react-lazyload';//technique of rendering only-needed or critical user interface items first, then quietly unrolling the non-critical items later
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"; //used to create routes for different pages to be shown in the webapp

// Components
import Loading from './Components/Loading'; // loading animation
import Store from './Components/Store'


//React.lazy() lets you define a component that is loaded dynamically.
//This helps reduce the bundle size to delay loading components that aren’t used during the initial render.
const Splash = React.lazy(() => import ('./pages/Splash.js'))
const Chat = React.lazy(() => import ('./pages/Chat.js'))
const Legal = React.lazy(() => import ('./pages/Legal.js'))
const Terms = React.lazy(() => import ('./pages/legal/Terms.js'))
const Privacy = React.lazy(() => import ('./pages/legal/Privacy.js'))

const App = ({hideLoader}) => {
    React.useEffect(hideLoader, []);//Accepts a function that contains imperative, possibly effectful code.
//Basically useEffect is used to render components which will cause bugs if declared in main function hence code runned in useEffect runs after rendering of main code.
//The function passed to useEffect will run after the render is committed to the screen

//basically when all or some pages are being rendered then these command works and shows a loader and connects to loading.js
    return (
        <LazyLoad>
            <Suspense fallback={Loading}>
                <Router>
                    <Store>
                        <div className="App">
                            <Switch>
                                <Route exact path="/"     //Exact path eliminates partial matching and directly routes to the defined link or component
                                    component={Splash}/>
                                <Route path="/chat"
                                    component={Chat}/>
                                <Route exact path="/legal"
                                    component={Legal}/>
                                <Route path="/terms"
                                    component={Terms}/>
                                <Route path="/privacy"
                                    component={Privacy}/>
                            </Switch>
                        </div>
                    </Store>
                </Router>
            </Suspense>
        </LazyLoad>
    )
}

export default App;
