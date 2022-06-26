import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import './login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: undefined, password: undefined });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: 'LOGIN_START' });

    try {
      const res = await axios({
        method: 'POST',
        url: 'http://localhost:8000/api/v1/auth/login',
        data: credentials,
      });
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      navigate('/');
    } catch (err) {
      dispatch({ type: 'LOGIN_FAIL', payload: err.response.data });
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="lContainer">
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} type="submit" className="lButton">
          Login
        </button>
        {error && <span>{error.message}</span>}
      </form>
    </div>
  );
};
export default Login;
