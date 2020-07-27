import React from 'react'

const AuthContext = React.createContext({
    userId: null,
    token: null,
    login: (userId, token, tokenExpiry) => {},
    logout: () => {}
});

export default AuthContext;