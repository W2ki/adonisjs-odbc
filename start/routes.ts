/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'

router.get('/', async ({ response }) => {
  response.status(404)
  response.abort('<center><h1>💀 ¡¿Estas buscando algo?! 💀</h1><h3>👋 ¡Adios! 👋</h3></center>')
})

router.post('/login', async ({ request, response }) => {
  let username = request.body().username
  let password = request.body().password
  let auth = new AuthController()
  let authSearch = await auth.index(username, password)
  console.log('hola', authSearch)
  if (authSearch) {
    response.status(200).send({ code: 0, response: authSearch[0] })
  } else {
    response.status(500).send({ code: 1 })
  }
})
