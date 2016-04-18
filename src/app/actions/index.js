export const USER_LOGIN = 'USER_LOGIN';

export function userLogin(loginEmail) {
  return { type: USER_LOGIN, loginEmail }
}
