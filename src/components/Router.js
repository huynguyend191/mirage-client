import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AccountContext } from '../context/AccountContext';
import Default from '../pages/default/Default';
import Student from '../pages/student/Student';
import Tutor from '../pages/tutor/Tutor';
import Admin from '../pages/admin/Admin';
import { ROLES } from '../lib/constants';
import Logout from './Logout';

export default function Router() {
  const { account } = useContext(AccountContext);
  if (account && account.role === ROLES.STUDENT) {
    return (
      <Switch>
        <Route path="/student" component={Student} />
        <Route path="/logout" component={Logout} />
        <Redirect to="/student" />
      </Switch>
    );
  } else if (account && account.role === ROLES.TUTOR) {
    return (
      <Switch>
        <Route path="/tutor" component={Tutor} />
        <Route path="/logout" component={Logout} />
        <Redirect to="/tutor" />
      </Switch>
    );
  } else if (account && account.role === ROLES.ADMIN) {
    return (
      <Switch>
        <Route path="/admin" component={Admin} />
        <Redirect to="/admin" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path="/" exact component={Default} />
        <Route path="/logout" component={Logout} />
        <Redirect to="/" />
      </Switch>
    )
  }
}
