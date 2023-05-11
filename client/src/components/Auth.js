import {useState} from 'react'
import {useCookies} from 'react-cookie'
import './Auth.css'

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogIn, setIsLogIn] = useState(true)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [error, setError] = useState(null)

  const viewLogIn = (status) => {
    setError(null)
    setIsLogIn(status)
  }

  const handleSubmit = async(e, endpoint) => {
    e.preventDefault()
    if(!isLogIn && password !== confirmPassword){
      setError('Make sure passwords match!')
      return
    }

    const respone = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email,password})
    })

    const data = await respone.json()

    if(data.detail){
      setError(data.detail)
    } else {
      setCookie('Email', data.email)
      setCookie('AuthToken', data.token)
      window.location.reload()
    }
  }


    return (
      
      <div class="box">
        <div class="container">
          <form>
            <div class="top">
              <header>{isLogIn ? 'Login' : 'Sign up'}</header>
            </div>
            <div class="input-field">
            <input type="email" class="input" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /> 
              <input type="password" class="input" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
              {!isLogIn && <input type="password" class="input" placeholder="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)} />}
              <input type="submit" className='create' placeholder={isLogIn ? 'Login' : 'Signup'} onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')} />
              {error && <p>{error}</p>}
            </div>
          </form>
          <div className="auth-options">
            <button 
              onClick={() => viewLogIn(false)}
              style={{backgroundColor : !isLogIn ? 'white' : 'rgb(188, 188, 188'}}
            >Sign Up</button>
            <button 
            onClick={() => viewLogIn(true)}
            style={{backgroundColor : isLogIn ? 'white' : 'rgb(188, 188, 188'}}
            >Login</button>
          </div>
        </div>
        
      </div>
    )
  }
  
  export default Auth