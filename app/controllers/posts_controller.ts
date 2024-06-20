import Database from '#config/database'

export default class PostsController {
  table: string
  constructor() {
    this.table = 'posts'
  }

  async index() {
    const db = new Database()
    const record = await db.all(this.table)
    return record
  }

  async findById(id: number) {
    const db = new Database()
    const record = await db.findById(this.table, id)
    return record
  }

  async update(username: string, password: string, id: number) {
    const db = new Database()
    const record = await db.update(
      this.table,
      {
        username,
        password,
      },
      `id = ${id}`
    )
    return record
  }

  async save(username: string, password: string, id: number) {
    const db = new Database()
    const record = await db.save('threads', {
      username,
      password,
    })
    return record
  }
}
