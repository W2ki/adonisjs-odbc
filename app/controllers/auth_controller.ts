import Database from '#config/database'

export default class AuthController {
  table: string
  constructor() {
    this.table = 'users'
  }

  async index(username: string, password: string) {
    const db = new Database()
    const record = await db.findBy('users', {
      where: {
        username,
        password,
      },
    })
    return record
  }
}
