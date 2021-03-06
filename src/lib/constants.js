export const ROLES = Object.freeze({
  ADMIN: 1,
  TUTOR: 2,
  STUDENT: 3
});

export const STATES = Object.freeze({
  ACTIVE: 1,
  INACTIVE: 0
});

export const VERIFICATION = Object.freeze({
  VERIFIED: 1,
  UNVERIFIED: 0
});

export const PROFILE_STATUS = Object.freeze({
  ACCEPTED: 1,
  PENDING: 2,
  REJECTED: 3
});

export const serverUrl = process.env.NODE_ENV === 'development' ? 'https://localhost:3003/' : 'https://mirage.social/';

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
  SAVE_VIDEOS: 'save_videos',
  CREATE_CALL_HISTORY: 'create_call_history',
  GET_ONLINE_STUDENTS: 'get_online_students'
});

export const STATUS = Object.freeze({
  AVAILABLE: 1,
  BUSY: 0,
  OFFLINE: 2
});

export const SUB_STATE = Object.freeze({
  COMPLETED: 1,
  PENDING: 2,
  CANCELED: 3
});

export const SUB_TIER = Object.freeze({
  NORMAL: 1,
  SILVER: 2,
  GOLD: 3,
  PLATIUM: 4
});

export const REPORT_REASONS = ['Nudity', 'Harassment', 'Spam', 'Hate speech', 'Something else'];

export const REPORT_STATE = Object.freeze({
  RESOLVED: 1,
  PENDING: 2,
  CANCELLED: 3
});

export const HISTORY_COUNT = Object.freeze({
  COUNTED: 1,
  UNCOUNTED: 0
});

export const PAYMENT_STATE = Object.freeze({
  COMPLETED: 1,
  PENDING: 2,
  CANCELED: 3
});

export const PREFERENCE_TYPES = Object.freeze({
  FAVORITE: 1,
  RECOMMEND: 2
});

export const STUDENT_PRICE = 'student price';
export const TUTOR_PRICE = 'tutor price';
export const DISCOUNT_RATE = 'discount rate';
