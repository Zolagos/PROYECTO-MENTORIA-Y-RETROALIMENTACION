import '../css/main.css'
import '../css/layout.css'
import '../css/components.css'
import '../css/animations.css'
import '../css/responsive.css'
import '../css/pages/login.css'
import '../css/pages/dashboard.css'
import '../css/pages/mentoring.css'
import '../css/pages/observations.css'

import './globals.js'

import { getSessionUser } from './components/header.js'
import { initApp } from './app.js'
import { registerRoute, handleRoute } from './router.js'
import { renderLogin } from './pages/login.js'

function boot() {
  registerRoute('/login', 'Iniciar Sesión', renderLogin)

  const user = getSessionUser()
  const token = sessionStorage.getItem('tutorlink_token')
  const isAuth = !!(user && token)

  if (isAuth) {
    document.body.classList.remove('route-login')
    document.body.classList.add('route-app')

    const path = window.location.pathname
    if (path === '/' || path === '/login') {
      window.history.replaceState(null, '', '/dashboard')
    }

    initApp(user)
  } else {
    document.body.classList.remove('route-app')
    document.body.classList.add('route-login')
  }

  handleRoute()
}

document.addEventListener('DOMContentLoaded', boot)
