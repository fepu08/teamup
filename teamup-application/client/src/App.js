import './styles/globals.scss'
import {Fragment} from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function App({ Component, pageProps }) {
    return (
        <Fragment>
            <Navbar/>
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-md-6 col-lg-2"}>Some content 1</div>
                    <div className={"col-md-6 col-lg-2"}>Some content 2</div>
                    <div className={"col-md-6 col-lg-2"}>Some content 3</div>
                </div>
            </div>
            <Footer/>
        </Fragment>
    )
}
export default App