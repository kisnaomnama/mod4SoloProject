import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [buttonDisable, setButtonDisable] = useState(true)
  const { closeModal } = useModal();
  const buttonClass = buttonDisable ? "log-in-modal-button-disabled" : "log-in-modal-button"
  const errorText = errors === "Invalid credentials" ? "The provided credentials were invalid" : null
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors(data.message);
        }
        
      });
  };

  const demoUserLogIn = async (e) => {
    const response = await dispatch(sessionActions.login({"credential": 'Demo-lition', "password": 'password'}))
    if(response.ok){
      closeModal();
    }
      
  }



  useEffect(() => {
    if(credential.length < 4 || password.length < 6){
      setButtonDisable(true)
    } else {
      setButtonDisable(false)
    }
  }, [credential, password])

  return (
    <div className="log-in-modal">
      <h1>Log In</h1>
      {errors && <p className="log-in-modal-error">{errorText || errors}</p>}
      <form onSubmit={handleSubmit}>
        <div className="log-in-modal-inputs">
          <input
            className="sign-up-container-entry"
            placeholder='Username or Email'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        <div className="log-in-modal-inputs">
          <input
            className="sign-up-container-entry"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* {errors && <p className="log-in-modal-error">{errors}</p>} */}
        
        <button type="submit" disabled={buttonDisable} className={buttonClass}>Log In</button>
        <button type="demoUser" className="log-in-modal-button cursor" onClick={demoUserLogIn}>Log In as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
