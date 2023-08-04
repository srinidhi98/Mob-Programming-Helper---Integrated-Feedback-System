import pb from '../../libs/pocketbase';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface ResetPassProps {
  setReset: any;
}

export default function ResetPass({ setReset }: ResetPassProps) {
  const { register, handleSubmit, reset } = useForm();
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, []);

  async function onSubmit(data: any) {
    const inputEmail = data.email;

    reset();

    setMessage("Password reset email sent!");

    await pb.collection('users').requestPasswordReset(inputEmail);

    setReset(false);
  }

  function onBack() {
    setReset(false);
  }

  return (
    <div>
      <div className='mess'>Password Reset</div>
      <div className='mess'>{message}</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='text'
              placeholder='Email'
              {...register('email', { required: true })}/>
        <button type='submit'>Reset Password</button>
      </form>
      <button type='submit' onClick={() => onBack()}>Back</button>
    </div>
  );
}
