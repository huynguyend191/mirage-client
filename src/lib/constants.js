export const ROLES = Object.freeze({
  ADMIN: 1,
  TUTOR: 2,
  STUDENT: 3
});

export const serverUrl = process.env.NODE_ENV === 'development'
? 'https://localhost:3003/'
: 'https://mirage-video-call.herokuapp.com/';
