export interface LoginForm {
  email: string
  password: string
}

export interface SignupForm extends LoginForm {
  nickname: string
}
