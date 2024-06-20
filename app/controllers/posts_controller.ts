import Database from '#config/database'

export default class PostsController {
  table: string
  constructor() {
    this.table = 'posts'
  }

  async index(data: any) {
    const db = new Database()
    const record = await db.findBy(this.table, data)
    return record
  }

  async findById(id: any) {
    const db = new Database()
    const record = await db.findById(this.table, id)
    return record
  }

  async update(data: any, id: any) {
    const db = new Database()
    const record = await db.update(this.table, data, `id = ${id}`)
    return record
  }

  async save(data: any) {
    const db = new Database()
    const record = await db.create('threads', data)
    return record
  }
}
