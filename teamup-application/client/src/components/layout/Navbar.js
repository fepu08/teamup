import React from 'react';
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-light navbar-expand-md navigation-clean-button">
            <div className="container"><Link className="navbar-brand" to="/"><i className={"fas fa-code"}/> TeamUP!</Link><button data-toggle="collapse" data-target="#navcol-2" className="navbar-toggler"><span className="sr-only">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
                <div id={"navbarCollapse"} className={"collapse navbar-collapse justify-content-start"}>
                    <div className={"navbar-nav"}>
                        <Link className={"nav-item nav-link"} to={"/"}>Home</Link>
                        <Link className={"nav-item nav-link"} to={"/profile"}>Profile</Link>
                        <Link className={"nav-item nav-link"} to={"/teams"}>Teams</Link>
                    </div>

                    <div className={"navbar-nav ml-auto action-buttons"}>
                            <Link className={"nav-link mr-4"} to={"/login"}>Login</Link>
                            <Link className={"nav-link mr-4"} to={"/register"}>Register</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;