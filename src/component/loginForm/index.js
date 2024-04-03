import React, { useEffect, useRef, useState } from 'react'
import { useHistory, Redirect } from 'react-router-dom';
import { message } from 'antd';
import APIUtils from 'api/APIUtils';
import AuthService from '../../api/AuthService';

function LoginForm(props) {
    const history = useHistory();

    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated'));
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const fetchData = async () => {
        try {
            APIUtils.setBaseUrl(process.env.REACT_APP_API_AUTHENTICATION_URL);
          
            const response = await AuthService.login(username,password);
            if (response.status && response.data) {
                props.onLogin();
                history.push('/')
            }
        } catch (error) {
            message.error(error.response.data.message, 1);
            localStorage.clear();
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (username === "") {
            message.error("Please insert username", 1);
            return false;
        }

        if (password === "") {
            message.error("Please insert password", 1);
            return false;
        }

        await fetchData()
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" value={username} onChange={handleUsernameChange} />
            </label>
            <br />
            <label>
                Password:
                <input type="password" value={password} onChange={handlePasswordChange} />
            </label>
            <br />
            <button type="submit">Đăng nhập</button>

        </form>
    )
}

export default LoginForm;
