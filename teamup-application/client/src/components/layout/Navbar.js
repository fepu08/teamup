import React from 'react';

const Navbar = () => {
    return (
        <nav className="navbar navbar-light navbar-expand-md navigation-clean-button">
            <div className="container"><a className="navbar-brand" href="#"><i className={"fas fa-code"}/> TeamUP!</a><button data-toggle="collapse" data-target="#navcol-2" className="navbar-toggler"><span className="sr-only">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
                <div id={"navbarCollapse"} className={"collapse navbar-collapse justify-content-start"}>
                    <div className={"navbar-nav"}>
                        <a className={"nav-item nav-link"} href={"#"}>Home</a>
                        <a className={"nav-item nav-link"} href={"#"}>Profile</a>
                        <a className={"nav-item nav-link"} href={"#"}>Teams</a>
                    </div>

                    <div className={"navbar-nav ml-auto action-buttons"}>
                            <a className={"nav-link mr-4"} href={"#"}>Login</a>
                            <a className={"nav-link mr-4"} href={"#"}>Register</a>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;