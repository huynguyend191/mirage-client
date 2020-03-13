import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AccountContext } from '../context/AccountContext';
import Default from '../pages/default/Default';
import Student from '../pages/student/Student';
import Tutor from '../pages/tutor/Tutor';
import { ROLES } from '../lib/constants';

export default function Router() {
  const { account } = useContext(AccountContext);
  if (account && account.role === ROLES.STUDENT) {
    return (
      <Switch>
        <Route path="/student" component={Student} />
        <Redirect to="/student" />
      </Switch>
    );
  } else if (account && account.role === ROLES.TUTOR) {
    return (
      <Switch>
        <Route path="/tutor" component={Tutor} />
        <Redirect to="/tutor" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path="/" exact component={Default} />
        <Redirect to="/" />
      </Switch>
    )
  }
}
