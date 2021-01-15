import './styles/globals.scss'
import {Fragment} from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing"
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from './components/layout/Alert';
// Redux
import { Provider } from 'react-redux';
import store from './store';


function App({ Component, pageProps }) {
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