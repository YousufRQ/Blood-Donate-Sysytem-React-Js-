import React, { Component } from 'react'

import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import NavBar from './NavBar';
import Signin from './Signin';
import Signup from './Signup';
import User from './User';
import Home from './Home';
import Detail from './Detail';
import firebase from 'firebase';
import { connect } from 'react-redux'
import store from '../store'
import { AuthActions } from '../store/actions'

class App extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            to: '/'
        }
    }
    history = {}
    componentDidMount() {
        firebase.auth().onAuthStateChanged(a => {

            this.history.listen(a => a.path === '/user' && !a ? this.setState({ to: '/signin' }) : (a.path === '/signin' || a.path === '/signup') && !a ? this.setState({ to: '/user' }) : null)
            console.log(a, this.refs.a)
            if (a) {
                this.setState({ to: '/user' })
                return
            }
            this.setState({ to: '/' })
        })
    }
    path = '/'
    route = ({ Component, path, componentProps, ...routProps }) => <Route path={path} {...routProps} component={(props) => {
        this.history = props.history
        return <Component { ...componentProps } { ...props } />
    }} />
    render() {
        this.path !== this.state.to && this.history.push(this.state.to)
        this.path = this.state.to
        return (
            <Router>
                <div>
                    <div style={{ display: 'none' }}>
                        {this.path !== this.state.to && <Redirect ref="a" to={this.state.to} />}
                        {this.path = this.state.to}
                    </div>
                    <NavBar />
                    <this.route exact path="/" componentProps={this.props.donor} Component={Home} />
                    <this.route path="/signin" componentProps={{...this.props.auth, login: this.props.login}} Component={Signin} />
                    <this.route path="/signup" componentProps={{...this.props.auth, signup: this.props.signup}} Component={Signup} />
                    <this.route path="/user" Component={User} componentProps={{...this.props.auth, ...this.props.donor}} />
                    <this.route path="/detail/:uid" componentProps={this.props.donor} Component={Detail} />
                </div>
            </Router>
        )
    }
}

const mapStateToProps = ({donor, auth}) => ({
    donor,
    auth
})
const mapDispatchToProps = (dispatch) => ({
    login: (payload) => dispatch(AuthActions.login(payload)),
    signup: (payload) => dispatch(AuthActions.signup(payload))
})


export default connect(mapStateToProps, mapDispatchToProps)(App)