import React, { Component } from 'react'
import AuthContext from './../Context';

export default class Auth extends Component {
    state = {
        isLoggedIn: true
    };

    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    handleSwitch = () => {
        this.setState(prevState => {
            return { isLoggedIn: !prevState.isLoggedIn }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if(email.trim().length === 0 || password.trim().length === 0){
            return;
        }

        let requestData = {
            query: `
                query {
                    login(email: "${email}", password: "${password}"){
                        userId
                        token
                        tokenExpiry
                    }
                }
            `
        };

        if(!this.state.isLoggedIn){
            requestData = {
                query:
                `mutation {
                    createUser(userInput: { 
                        email: "${email}",
                        password: "${password}" }){
                            email
                    }
                  }
                ` 
            };
        }
        
        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(res => {
            if(res.data.login.token){
                this.context.login(
                    res.data.login.userId,
                    res.data.login.token,
                    res.data.login.tokenExpiry
                );
            }
            localStorage.setItem('token', res.data.login.token)
        })
        .catch(err => {
            console.log(err);
        })
    };

    render() {
        return (
            <div>
                <form className='auth-container' onSubmit={this.handleSubmit}>
                    <div className='input'>
                        <input
                            type='email'
                            placeholder='Enter email'
                            id='email'
                            ref={this.emailEl}
                        />
                    </div>

                    <div className='input'>
                        <input 
                            type='password'
                            placeholder='Enter password'
                            id='password'
                            ref={this.passwordEl}
                        />
                    </div>

                    <div className='action'>
                        <button type='submit'>Submit</button>
                        <button type="button" onClick={this.handleSwitch}>
                            {this.state.isLoggedIn ? 'Sign Up' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}
