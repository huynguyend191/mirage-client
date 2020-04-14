export const ROLES = Object.freeze({
  ADMIN: 1,
  TUTOR: 2,
  STUDENT: 3
});

export const STATES = Object.freeze({
  ACTIVE: 1,
  INACTIVE: 0
});

export const PROFILE_STATUS = Object.freeze({
  ACCEPTED: 1,
  PENDING: 2,
  REJECTED: 3
});

export const serverUrl = process.env.NODE_ENV === 'development'
? 'https://localhost:3003/'
: 'https://mirage-video-call.herokuapp.com/';

export const SOCKET_EVENTS = Object.freeze({
  INIT: 'init',
  REQUEST: 'request',
  CALL: 'call',
  END: 'end',
  DISCONNECT: 'disconnect',
  GET_ONLINE_TUTORS: 'get_online_tutors',
  LEAVE: 'leave'
});

export const STATUS = Object.freeze({
  AVAILABLE: 1,
  BUSY: 0
})