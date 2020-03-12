import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
const cookies = new Cookies();

export const getAccountInfo = () => {
  let account = null;
  const accessToken = cookies.get('access_token');
  if (accessToken) {
    account = jwtDecode(accessToken);
  }
  return account;
}

export const removeAccountInfo = () => {
  cookies.remove('access_token');
}
