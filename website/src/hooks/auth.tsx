import pb from './../libs/pocketbase'
import { useState } from 'react'

export function useSignIn() {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState();

  async function login(email: string, password: string) {
    setError(undefined);
    setLoading(true);

    let authResponse;

    try {
      authResponse = await pb.collection('users').authWithPassword(email, password);
    } catch (e: any) {
      setError(e);
    }

    setLoading(false);
    return authResponse;
  }

  return { login, isLoading, isError };
}

export function useSignOut() {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState();

  function logout() {
    setError(undefined);
    setLoading(true);
  
    try {
      pb.authStore.clear();
    } catch (e: any) {
      setError(e);
    }

    setLoading(false);
  }

  return { logout, isLoading, isError };
}