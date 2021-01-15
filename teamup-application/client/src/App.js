import './styles/globals.scss'
import {Fragment, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing"
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from './components/layout/Alert';
import {loadUser} from "./actions/auth";
// Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

function App() {
    // if you add [] at second parameter, it only runs once
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar/>
                    <div className={"container"}>
                        <Alert/>
                        <Switch>
                            <Route exact path={"/"} component={Landing}/>
                            <Route exact path={"/login"} component={Login}/>
                            <Route exact path={"/register"} component={Register}/>
                        </Switch>
                    </div>
                    <Footer/>
                </Fragment>
            </Router>
        </Provider>
    )
}
export default App