import pb from '../../libs/pocketbase';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import './SignUp.css'

interface SignUpProps {
    setSignUp: any;
}

export default function SignUp({ setSignUp }: SignUpProps) {
  const { register, handleSubmit, reset } = useForm();
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, []);

  async function onSubmit(data: any) {
    const email = data.email.toLowerCase();
    const pass = data.password;
    const name = data.name;
    let record;

    try {
        record = await pb.collection('users').getFirstListItem(`
        email = "${email}"`);
        setMessage("That email address is invalid or already in use. Please try again.");
    } catch (error) {
      await pb.collection('users').create({
        username: email.substring(0, email.indexOf('@')),
        displayName: name,
        verified: false,
        email: email,
        emailVisibility: true,
        password: pass,
        passwordConfirm: pass
      });

      setMessage("Account created!");

      await pb.collection('users').requestVerification(email);

      setSignUp(false);
    }
    reset();
  }

  function onBack() {
    setSignUp(false);
  }

  return (
    <div>
      <div className='mess'>Sign Up</div>
      <div className='mess'>{message}</div>
      <form onSubmit={handleSubmit(onSubmit)}>
              <input type='text'
                  placeholder='Name'
                  {...register('name', { required: true })}/>
              <input type='text'
                  placeholder='Email'
                  {...register('email', { required: true })}/>
              <input type='password'
                  placeholder='Password'
                  {...register('password', { required: true })}/>
              <button type='submit'>Sign Up</button>
      </form>
      <button type='submit' onClick={() => onBack()}>Back</button>
    </div>
  );
}
