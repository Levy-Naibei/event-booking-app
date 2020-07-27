import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';
import Auth from './pages/Auth';
import Event from './pages/Event';
import Booking from './pages/Booking';
import AuthContext from './Context';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      userId: null,
      token: null,
    }
  }

  login = (userId, token) => {
    this.setState({
      token: token, userId: userId
    });
  };

  logout = () => {
    this.setState({
      token: null, userId: null
    })
  }

  render () {
    const {userId, token} = this.state;

    return (
      <BrowserRouter>
        <AuthContext.Provider
        value = {{
          userId: userId,
          token: token,
          login: this.login,
          logout: this.logout
        }}
        >
          <React.Fragment>
            <Navbar />
            <div className='main'>
              <Switch>
                {token && <Redirect from='/' to='/events' exact /> }
                {token && <Redirect from='/auth' to='/events' exact /> }
                {!token && <Route path='/auth' component={Auth} /> }
                <Route path='/events' component={Event} />
                {token && ( <Route path='/booking' component={Booking} /> )}
                {!token && <Redirect to='/auth' exact /> }
              </Switch>
            </div>
          </React.Fragment>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}


export default App;
