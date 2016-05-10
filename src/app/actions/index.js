export const USER_LOGIN  = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

export function userLogin(loginEmail, userType) {
  return { type: USER_LOGIN, loginEmail, userType }
}

export function userLogout() {
  return { type: USER_LOGOUT }
}
