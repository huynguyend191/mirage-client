import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { removeAccountInfo } from '../lib/utils/getAccountInfo';

export default function SignOut() {
  useEffect(() => {
    removeAccountInfo();
  }, []);
  return <Redirect to="/" />
}
