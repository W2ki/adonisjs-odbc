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
import { base64 } from '@adonisjs/core/helpers'
import ThreadsController from '#controllers/threads_controller'
import PostsController from '#controllers/posts_controller'

const basic = base64.encode(`${process.env.UHEADER}:${process.env.UPASSWORD}`)

router.get('/', async ({ response }) => {
  response.status(404)
  response.abort('<center><h1>💀 ¡¿Estas buscando algo?! 💀</h1><h3>👋 ¡Adios! 👋</h3></center>')
})

/**
 * Auth section
 */
router.post('/login', async ({ request, response }) => {
  if (!(process.env.UHEADER || process.env.UPASSWORD)) {
    response.status(401).send({ code: 401 })
  }
  if (
    request.header('authorization', `Basic ${basic}`) &&
    request.header('api-id', process.env.APP_KEY)
  ) {
    let username = request.body().username
    let password = request.body().password
    let auth = new AuthController()
    let authSearch = await auth.index(username, password)

    if (authSearch) {
      response.status(200).send({ code: 0, response: authSearch[0], basic: basic })
    } else {
      response.status(500).send({ code: 1 })
    }
  } else {
    response.status(458).send({ code: 458 })
  }
})

/**
 * Threads section
 */
router.get('/threads/all', async ({ request, response }) => {
  if (!(process.env.UHEADER || process.env.UPASSWORD)) {
    response.status(401).send({ code: 401 })
  }

  if (
    request.header('authorization', `Basic ${basic}`) &&
    request.header('api-id', process.env.APP_KEY)
  ) {
    let threads = new ThreadsController()
    let fetch = await threads.index()

    if (fetch) {
      response.status(200).send({ code: 0, response: fetch[0] })
    } else {
      response.status(500).send({ code: 1 })
    }
  } else {
    response.status(458).send({ code: 458 })
  }
})

router.get('/threads/get/:id', async ({ params, request, response }) => {
  if (!(process.env.UHEADER || process.env.UPASSWORD)) {
    response.status(401).send({ code: 401 })
  }

  if (
    request.header('authorization', `Basic ${basic}`) &&
    request.header('api-id', process.env.APP_KEY)
  ) {
    let threads = new ThreadsController()
    let id = base64.decode(params.id)

    let fetch = await threads.findById(id)

    if (fetch) {
      response.status(200).send({ code: 0, response: fetch[0] })
    } else {
      response.status(500).send({ code: 1 })
    }
  } else {
    response.status(458).send({ code: 458 })
  }
})

router.put('/threads/create', async ({ request, response }) => {
  if (!(process.env.UHEADER || process.env.UPASSWORD)) {
    response.status(401).send({ code: 401 })
  }

  if (
    request.header('authorization', `Basic ${basic}`) &&
    request.header('api-id', process.env.APP_KEY)
  ) {
    let threads = new ThreadsController()
    let title = request.body().title
    let description = request.body().description
    let userId = request.body().userId

    //console.log(title, description, userId)
    let fetch = await threads.save({
      title,
      description,
      user_id: userId,
    })

    if (fetch) {
      response.status(200).send({ code: 0 })
    } else {
      response.status(500).send({ code: 1 })
    }
  } else {
    response.status(458).send({ code: 458 })
  }
})

router.put('/threads/edit', async ({ request, response }) => {
  if (!(process.env.UHEADER || process.env.UPASSWORD)) {
    response.status(401).send({ code: 401 })
  }

  if (
    request.header('authorization', `Basic ${basic}`) &&
    request.header('api-id', process.env.APP_KEY)
  ) {
    let threads = new ThreadsController()
    let title = request.body().title
    let description = request.body().description
    let id = base64.decode(request.body().id)

    let fetch = await threads.update(
      {
        title,
        description,
      },
      id
    )

    if (fetch) {
      response.status(200).send({ code: 0 })
    } else {
      response.status(500).send({ code: 1 })
    }
  } else {
    response.status(458).send({ code: 458 })
  }
})

/**
 * Posts section
 */

router.get('/posts/all', async ({ request, response }) => {
  if (!(process.env.UHEADER || process.env.UPASSWORD)) {
    response.status(401).send({ code: 401 })
  }

  if (
    request.header('authorization', `Basic ${basic}`) &&
    request.header('api-id', process.env.APP_KEY)
  ) {
    let posts = new PostsController()
    let id = request.body()
    let fetch = await posts.index({
      where: {
        user_id: id,
      },
    })

    if (fetch) {
      response.status(200).send({ code: 0, response: fetch[0] })
    } else {
      response.status(500).send({ code: 1 })
    }
  } else {
    response.status(458).send({ code: 458 })
  }
})

router.get('/posts/get/:id', async ({ params, request, response }) => {
  if (!(process.env.UHEADER || process.env.UPASSWORD)) {
    response.status(401).send({ code: 401 })
  }

  if (
    request.header('authorization', `Basic ${basic}`) &&
    request.header('api-id', process.env.APP_KEY)
  ) {
    let post = new PostsController()
    let id = await base64.decode(params.id)
    let fetch = await post.findById(id)

    if (fetch) {
      response.status(200).send({ code: 0, response: fetch[0] })
    } else {
      response.status(500).send({ code: 1 })
    }
  } else {
    response.status(458).send({ code: 458 })
  }
})

router.put('/posts/create', async ({ request, response }) => {
  if (!(process.env.UHEADER || process.env.UPASSWORD)) {
    response.status(401).send({ code: 401 })
  }

  if (
    request.header('authorization', `Basic ${basic}`) &&
    request.header('api-id', process.env.APP_KEY)
  ) {
    let post = new PostsController()
    let title = request.body()
    let description = request.body()
    let userId = request.body()

    let fetch = await post.save({
      title,
      description,
      user_id: userId,
    })

    if (fetch) {
      response.status(200).send({ code: 0 })
    } else {
      response.status(500).send({ code: 1 })
    }
  } else {
    response.status(458).send({ code: 458 })
  }
})

router.put('/posts/edit', async ({ request, response }) => {
  if (!(process.env.UHEADER || process.env.UPASSWORD)) {
    response.status(401).send({ code: 401 })
  }

  if (
    request.header('authorization', `Basic ${basic}`) &&
    request.header('api-id', process.env.APP_KEY)
  ) {
    let post = new PostsController()
    let title = request.body()
    let description = request.body()
    let id = request.body()

    let fetch = await post.update(
      {
        title,
        description,
      },
      id
    )

    if (fetch) {
      response.status(200).send({ code: 0 })
    } else {
      response.status(500).send({ code: 1 })
    }
  } else {
    response.status(458).send({ code: 458 })
  }
})
