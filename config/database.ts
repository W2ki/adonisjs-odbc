import * as odbc from 'odbc'
const connString = `DSN=${process.env.DSN};UID=${process.env.DSNUSER};PWD=${process.env.DSNPASSWORD}`
const configConnection = {
  connectionString: connString,
  connectionTimeout: 10,
  loginTimeout: 10,
}

export default class Database {
  query: string

  constructor() {
    this.query = ''
  }

  /**
   * Executes a select all on the database.
   * @param {string} query - The query to execute.
   * @returns {Promise<Array>} - A promise that resolves to an array of query results.
   */
  async rawQuery(query: string) {
    let connection
    const response: any[] = []
    try {
      connection = await odbc.connect(configConnection)
      const result = await connection.query(query)

      result.forEach((elm) => {
        response.push(elm)
      })
      await connection?.close()

      if (response.length >= 1) {
        return response
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Executes a select all on the database.
   * @param {string} table - The table name to fetch.
   * @returns {Promise<Array>} - A promise that resolves to an array of query results.
   */
  async all(table: string) {
    let connection
    const response: any[] = []
    try {
      connection = await odbc.connect(configConnection)
      let query = `SELECT * FROM ${table}`
      const result = await connection.query(query)

      result.forEach((elm) => {
        response.push(elm)
      })
      await connection?.close()

      if (response.length >= 1) {
        return response
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Executes a SELECT query on the database.
   * @param {string} table - The table name to fetch.
   * @param {string} data - The SELECT query to execute.
   * @returns {Promise<Array>} - A promise that resolves to an array of query results.
   */
  async findBy(table: string, data: any) {
    let connection
    let query: string = ''
    const response: any[] = []
    try {
      connection = await odbc.connect(configConnection)

      let whereStmt = data?.where
      if (whereStmt) {
        if (data?.columns) {
          query += `SELECT ${data?.columns} FROM ${table} WHERE `
        } else {
          query += `SELECT * FROM ${table} WHERE `
        }
        console.log(query)
        for (const elm in whereStmt) {
          if (elm === Object.keys(whereStmt).pop()) {
            if (typeof whereStmt[elm] === 'string') {
              query += `${elm} = '${whereStmt[elm]}'`
            } else {
              query += `${elm} = ${whereStmt[elm]}`
            }
          } else {
            if (typeof whereStmt[elm] === 'string') {
              query += `${elm} = '${whereStmt[elm]}' AND `
            } else {
              query += `${elm} = ${whereStmt[elm]} AND `
            }
          }
        }

        console.log(query)
        const result = await connection.query(query)

        result.forEach((elm) => {
          response.push(elm)
        })
        await connection?.close()

        if (response.length >= 1) {
          return response
        } else {
          return false
        }
      } else {
        if (data?.columns) {
          query += `SELECT ${data?.columns} FROM ${table}`
        } else {
          query += `SELECT * FROM ${table}`
        }

        const result = await connection.query(query)

        result.forEach((elm) => {
          response.push(elm)
        })

        await connection?.close()

        if (response.length >= 1) {
          return response
        } else {
          return false
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Executes a SELECT query on the database.
   * @param {string} table - The table name to fetch.
   * @param {string} id - The id value for query to execute.
   * @returns {Promise<Array>} - A promise that resolves to an array of query results.
   */
  async findById(table: string, id: any) {
    let connection
    const response: any[] = []
    try {
      connection = await odbc.connect(configConnection)
      let query = `SELECT * FROM ${table} WHERE id = ${id}`
      const result = await connection.query(query)

      result.forEach((elm) => {
        response.push(elm)
      })
      await connection?.close()

      if (response.length >= 1) {
        return response
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Executes an INSERT query on the database.
   * @param {string} table - The table to insert data into.
   * @param {Object} columns - The columns to insert data into.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating the success of the operation.
   */
  async save(table: string, columns: any) {
    let connection
    let query = `INSERT INTO ${table}`
    if (columns.length) {
      throw new Error('Columns and values must have the same length')
    }
    if (typeof columns !== 'object') {
      throw new Error('Columns and values must be arrays')
    }

    const addColumns = Object.keys(columns)
      .map((column) => `${column}`)
      .join(', ')
    const addValues = Object.keys(columns)
      .map((column) =>
        typeof columns[column] === 'string' ? `'${columns[column]}'` : `${columns[column]}`
      )
      .join(', ')

    query += `(${addColumns}) VALUES(${addValues})`
    console.log(query)
    try {
      connection = await odbc.connect(configConnection)
      await connection.query(query)

      return true
    } catch (error) {
      console.error(error)
    }

    await connection?.close()
    return false
  }

  /**
   * Executes an UPDATE query on the database.
   * @param {string} table - The table to update.
   * @param {Object} columns - An object representing the columns and their new values.
   * @param {string} where - The WHERE clause for the update query.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating the success of the operation.
   */
  async update(table: string, columns: any, where: string) {
    let connection
    try {
      let query = `UPDATE ${table} SET `

      const addValues = Object.keys(columns)
        .map((column: any) => `${column} = '${columns[column]}'`)
        .join(', ')
      query += `${addValues} WHERE ${where}`

      connection = await odbc.connect(configConnection)
      await connection.query(query)

      return true
    } catch (error) {
      console.error(error)
    }

    await connection?.close()
    return false
  }

  /**
   * Executes a DELETE query on the database.
   * @param {string} table - The table to delete data from.
   * @param {string} where - The WHERE clause for the delete query.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating the success of the operation.
   */
  async deleteBy(table: string, where: any) {
    let connection

    try {
      const query = `DELETE FROM ${table} WHERE ${where}`

      connection = await odbc.connect(configConnection)
      await connection.query(query)

      return true
    } catch (error) {
      console.error(error)
    }
    return false
  }

  /**
   * Executes a DELETE query on the database.
   * @param {string} table - The table to delete data from.
   * @param {string} where - The WHERE clause for the delete query.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating the success of the operation.
   */
  async deleteById(table: string, id: any) {
    let connection

    try {
      const query = `DELETE FROM ${table} WHERE id = ${id}`

      connection = await odbc.connect(configConnection)
      await connection.query(query)

      return true
    } catch (error) {
      console.error(error)
    }
    return false
  }

  /**
   * Executes a BUILD query table on the database.
   * @param {string} name - The table name.
   * @param {string} attributes - The table attributes.
   * @param {string} pKey - The table primary key.
   * @param {string} fKey - The table foreign key.
   * @returns {Promise<string>} - A promise that resolves to a boolean indicating the success of the operation.
   */
  async build(name: string, attributes: any[], pKey: any[], fKey: any[]) {
    const primaryKey = Object.keys(pKey)
      .map((key) => `${key}`)
      .join(', ')
    const foreignKey = Object.keys(fKey)
      .map((key: any) => `${key} REFERENCES ${fKey[key]}`)
      .join(', ')
    const asignDataType = (type: string) => {
      let response = ''
      switch (type) {
        case 'string':
          response = 'VARCHAR(255)'
          break
        case 'number':
          response = 'INT'
          break
        case 'boolean':
          response = 'BOOLEAN'
          break
        case 'text':
          response = 'TEXT'
          break
        case 'date':
          response = 'DATE'
          break
        case 'time':
          response = 'TIME'
          break
        case 'datetime':
          response = 'DATETIME'
          break
        case 'timestamp':
          response = 'TIMESTAMP'
          break
        case 'float':
          response = 'FLOAT'
          break
        case 'double':
          response = 'DOUBLE'
          break
        case 'decimal':
          response = 'DECIMAL'
          break
      }
      return response
    }

    const attributesArray = Object.keys(attributes).map(
      (attribute: any) => `${attribute} ${asignDataType(attributes[attribute])}`
    )
    if (Object.keys(pKey).length > 0) {
      this.query += `CREATE TABLE IF NOT EXISTS ${name} (id INT, ${attributesArray}, PRIMARY KEY (${primaryKey})`
    } else {
      this.query += `CREATE TABLE IF NOT EXISTS ${name} (id INT , ${attributesArray})`
    }
    if (Object.keys(fKey).length > 0) {
      this.query += `, FOREIGN KEY (${foreignKey})`
    }

    return this.query
  }

  async drop(name: string) {
    this.query = `DROP TABLE IF EXISTS ${name}`
    return this.query
  }
}
