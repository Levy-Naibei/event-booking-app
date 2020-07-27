import React from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../../Context';


const Navbar = (props) => {
    return (
        <div>
            <AuthContext.Consumer>
                {context => {
                    return (
                        <header className='navb'>
                            <div className="logo">
                                <h3>BEv</h3>
                            </div>
                            <div className='spacer'/>
                            <nav className="nav_item">
                                <ul>
                                    <li><NavLink to='/events'>Events</NavLink></li>
                                    {context.token && 
                                        <React.Fragment>
                                            <li><NavLink to='/booking'>Book Event</NavLink></li>
                                            <li className="logout-btn" onClick={context.logout}> Logout</li>
                                        </React.Fragment>
                                    }
                                    { !context.token && 
                                        <li><NavLink to='/auth' className='auth'>Free Trial</NavLink></li>
                                    }
                                </ul>
                            </nav>
                        </header> 
                    )
                }}
            </AuthContext.Consumer>           
        </div>
    )
}

export default Navbar;
