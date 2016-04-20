export const USER_LOGIN  = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

export function userLogin(loginEmail) {
  return { type: USER_LOGIN, loginEmail }
}

export function userLogout() {
  return { type: USER_LOGOUT }
}
