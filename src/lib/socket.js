import io from 'socket.io-client';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const accessToken = cookies.get('access_token');

const socketURL = process.env.NODE_ENV === 'development' ? 'https://localhost:3003' : 'https://mirage.social/';

const socket = io(`${socketURL}?token=${accessToken}`);

export default socket;
