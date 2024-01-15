import { useState } from 'react';
import { auth, projectFirestore } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useAuthContext } from '../hooks/useAuthContext';
import { useToastify } from '../hooks/useToastify';

export const useRegistration = () => {
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useAuthContext();
  const { notify } = useToastify();

  interface registrationData {
    displayName: string;
    email: string;
    password: string;
  }

  const registration = async ({
    displayName,
    email,
    password,
  }: registrationData) => {
    setError(null);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Update the user's display name and phone number
      await updateProfile(res.user, {
        displayName: displayName,
      });

      // Assign a role to the user and store it in Firestore
      const userRef = collection(projectFirestore, 'users');
      await addDoc(userRef, {
        uid: res.user.uid,
        email: res.user.email,
        displayName: displayName,
      });

      notify('success', 'Uživatel byl zaregistrován');
      dispatch({ type: 'LOGIN', payload: res.user });
    } catch (error) {
      notify('error', 'Registrace se nezdařila');
      setError('Něco se pokazilo, zkuste to znovu.');
    }
  };

  return {
    error,
    registration,
  };
};
