import React, { useContext } from 'react';
import { AccountContext } from '../context/AccountContext';
import axios from '../lib/utils/axiosConfig';

export default function VerifyAccount() {
  const { account } = useContext(AccountContext);
  const resendVerification = async () => {
    try {
      await axios.post('/accounts/resend-verify', { email: account.email });
    } catch (error) {
      console.log(error.response);
    }
  }
  return (
    <div>
      <p>Please check your email!</p>
      <button onClick={resendVerification}>Resend verification</button>
    </div>
  )
}
