export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  user_name: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  _id: string
  role: string
  user_name: string
  password: string
  avatar?: string | null
  name: string
  department_name: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  departments: []
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
