import pb from '../../libs/pocketbase'
import { useState } from 'react'
import { useSignIn } from '../../hooks/auth'
import { useForm } from 'react-hook-form'
import User from '../../AuthUser';
import SignUp from '../SignUp/SignUp'
import ResetPass from '../ResetPass/ResetPass'
import './SignIn.css'

interface SignInProps {
    setUser: any;
    setStarted: any
}

export default function SignIn({ setUser, setStarted}: SignInProps) {
  const { register, handleSubmit, reset } = useForm();
  const { login, isLoading, isError } = useSignIn()
  const [signUp, setSignUp] = useState(false);
  const [resetPass, setReset] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(data: any) {
    const userData = await login(data.email.toLowerCase(), data.password);
    if (userData == null) {
      setMessage("The email or password you entered is incorrect.");
    }

    reset();

    setUser(userData && new User(userData));
    setStarted(false)
  }

  async function onSignUp() {
    setMessage("");
    setSignUp(true);
  }

  async function onResetPass() {
    setMessage("");
    setReset(true);
  }

  return (
    <div>
      {isLoading ?
        <p>Loading...</p>
      :
      <>
       {!signUp && !resetPass &&(
                  <div>
                    <div className='mess'>Mob Programming Helper</div>
                    <div className='mess'>{message}</div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type='text'
                            placeholder='Email'
                            {...register('email', { required: true })}/>
                        <input type='password'
                            placeholder='Password'
                            {...register('password', { required: true })}/>
                        <button type='submit'>Login</button>
                    </form>
                    <button type='submit' onClick={() => onSignUp()}>Sign Up</button>
                    <button type='submit' onClick={() => onResetPass()}>Reset</button>
                  </div>
        )}
        {signUp && !resetPass &&(
            <SignUp setSignUp={setSignUp} />
        )}
        {!signUp && resetPass &&(
            <ResetPass setReset={setReset}/>
        )}
      </>
      }
    </div>
  );
}

