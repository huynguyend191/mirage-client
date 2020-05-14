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
  LEAVE: 'leave',
  RECORD_STUDENT: 'record_student',
  RECORD_TUTOR: 'record_tutor',
  SAVE_VIDEOS: 'save_videos'
});

export const STATUS = Object.freeze({
  AVAILABLE: 1,
  BUSY: 0
});

export const SUB_STATE = Object.freeze({
  COMPLETED: 1,
  PENDING: 2, 
  CANCELED: 3
});

export const SUB_TYPE = Object.freeze({
  NORMAL: 1,
  SILVER: 2, 
  GOLD: 3,
  PLATIUM: 4
});

