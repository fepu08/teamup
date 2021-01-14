import './styles/globals.scss'
import {Fragment} from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing"
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

function App({ Component, pageProps }) {
    return (
        <Router>
            <Fragment>
                <Navbar/>
                <div className={"container"}>
                    <Switch>
                        <Route exact path={"/"} component={Landing}/>
                        <Route exact path={"/login"} component={Login}/>
                        <Route exact path={"/register"} component={Register}/>
                    </Switch>
                </div>
                <Footer/>
            </Fragment>
        </Router>
    )
}
export default App