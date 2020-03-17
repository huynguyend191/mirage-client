import React, { useContext, useState } from 'react';
import { AccountContext } from '../../context/AccountContext';
import VerifyAccount from '../../components/VerifyAccount';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import ChangePasswordModal from '../../components/ChangePasswordModal';

export default function Student() {
  const { account, onSignOut } = useContext(AccountContext);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [isChangePass, setIsChangePass] = useState(false);


  if (account.verification) {
    return (
      <div>
        <button onClick={onSignOut}>Sign out</button>
        <button onClick={() => setIsForgotPass(true)}>Forgot pass</button>
        <button onClick={() => setIsChangePass(true)}>Change pass</button>
        <ForgotPasswordModal isVisible={isForgotPass} onClose={() => setIsForgotPass(false)} />
        <ChangePasswordModal
          isVisible={isChangePass}
          onClose={() => setIsChangePass(false)}
          onForgot={() => setIsForgotPass(true)}
        />
      </div>
    );
  }
  return (
    <div>
      <VerifyAccount />
      <button onClick={onSignOut}>Sign out</button>
    </div>
  );
}
