import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth';

const Navbar = ({auth: {isAuthenticated , loading}, logout}) => {
    const authLinks = (
        <Fragment>
            <div className={"navbar-nav"}>
                <Link className={"nav-item nav-link"} to={"/dashboard"}>Dashboard</Link>
                <Link className={"nav-item nav-link"} to={"/profile"}>Profile</Link>
                <Link className={"nav-item nav-link"} to={"/teams"}>Teams</Link>
            </div>

            <div className={"navbar-nav ml-auto action-buttons"}>
                <Link className={"nav-link mr-4"}
                      onClick={logout}
                      to={"#!"}><i className={"fas fa-sign-out-alt"}/> Logout
                </Link>
            </div>
        </Fragment>
    );

    const guestLinks = (
        <Fragment>
            <div className={"navbar-nav"}>
                <Link className={"nav-item nav-link"} to={"/"}>Home</Link>
            </div>

            <div className={"navbar-nav ml-auto action-buttons"}>
                <Link className={"nav-link mr-4"} to={"/login"}>Login</Link>
                <Link className={"nav-link mr-4"} to={"/register"}>Register</Link>
            </div>
        </Fragment>
    );

    return (
        <nav className="navbar navbar-light navbar-expand-md navigation-clean-button">
            <div className="container"><Link className="navbar-brand" to="/"><i className={"fas fa-code"}/> TeamUP!</Link><button data-toggle="collapse" data-target="#navcol-2" className="navbar-toggler"><span className="sr-only">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
                <div id={"navbarCollapse"} className={"collapse navbar-collapse justify-content-start"}>
                    {!loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks}</Fragment>)}
                </div>
            </div>
        </nav>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   auth: state.auth
});

export default connect(mapStateToProps, {logout})(Navbar);