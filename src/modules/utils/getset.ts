export function get<K extends string>(prop: K) {
  // function getter<T extends { [P in K]?: T[K] }>(object: T): T[K]
  function getter<T extends { [P in K]: T[K] }>(object: T): T[K] {
    return object[prop]
  }

  return getter
}

export function set<K extends string>(prop: K) {
  // function setter<T extends { [P in K]?: T[K] }>(object: T): (value: T[K]) => T
  function setter<T extends { [P in K]: T[K] }>(object: T): (value: T[K]) => T {
    return function (value: T[K]): T {
      return Object.assign(object, {
        [prop]: value
      })
    }
  }

  return setter
}

export interface GetProperty<K extends string> {
  <T extends { [P in K]?: any }>(object: T): T[K]
  <T extends { [P in K]: any }>(object: T): T[K]
}

export interface SetProperty<K extends string> {
  <T extends { [P in K]?: any }>(object: T, value: T[K]): T
  <T extends { [P in K]: any }>(object: T, value: T[K]): T
}
    
// Examples
/*
interface User {
    id: number,
    username: string,
}

type NewUser = Partial<User>
    
export const getUserId = composeGetter('id')

type UsernameGetter = GetProperty<'username'>
const getUsername: UsernameGetter = composeGetter('username')

declare const user: User
declare const newUser: NewUser
    
const userId = getUserId(user) // :number
const userUsername = getUsername(user) // :number | undefined

const newUserId = getUserId(newUser) // :number | undefined
const newUserUsername = getUsername(newUser) // :string | undefined

const nextUser = composeSetter('username')(newUser, 'foobar')
const nextUserUsername = nextUser.username // :string | undefined
*/