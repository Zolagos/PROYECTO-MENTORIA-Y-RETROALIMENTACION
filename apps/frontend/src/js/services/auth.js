/**
 * auth.js — Servicio de autenticación con Firebase
 *
 * ¿Qué hace?
 * Maneja el flujo completo de autenticación:
 * 1. Login con Firebase Authentication
 * 2. Envío del ID Token al backend Express
 * 3. Recepción del perfil del usuario (rol, clan, etc.)
 * 4. Guardado seguro en sessionStorage
 *
 * ESTADO ACTUAL: listo para conectar en Sprint 4.
 * Las funciones están documentadas con los pasos exactos.
 *
 * Kevin Mendoza | Frontend Developer
 */

/**
 * Flujo completo de autenticación.
 * Llamar desde login.js cuando el usuario envía el formulario.
 *
 * Pasos:
 * 1. Firebase valida email + password → devuelve ID Token
 * 2. Frontend envía ID Token al backend Express
 * 3. Backend verifica con Firebase Admin SDK
 * 4. Backend busca usuario en PostgreSQL por firebase_uid
 * 5. Backend devuelve perfil: { id, nombre, email, rol, clan }
 * 6. Frontend guarda perfil y redirige al dashboard
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} - Perfil del usuario
 */
async function loginWithFirebase(email, password) {
  // ---- PASO 1: Firebase Authentication ----
  // TODO Sprint 4: descomentar cuando Firebase SDK esté configurado
  //
  // const firebaseResult = await firebase.auth()
  //   .signInWithEmailAndPassword(email, password);
  //
  // const idToken = await firebaseResult.user.getIdToken();

  // ---- PASO 2: Verificar token contra el backend ----
  // TODO Sprint 4: descomentar
  //
  // const response = await fetch('http://localhost:3000/api/auth/verify', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ idToken }),
  // });
  //
  // if (!response.ok) {
  //   throw new Error('Usuario no encontrado o inactivo en el sistema.');
  // }
  //
  // const { user, token } = await response.json();

  // ---- PASO 3: Guardar en sessionStorage ----
  // TODO Sprint 4: descomentar
  //
  // sessionStorage.setItem('tutorlink_user', JSON.stringify(user));
  // sessionStorage.setItem('tutorlink_token', token);
  //
  // return user;

  // Placeholder para desarrollo — Sprint 4 lo reemplaza
  throw new Error('Sprint 4: Firebase Auth no configurado aún.');
}

/**
 * Verifica si hay una sesión activa.
 * Sprint 4: esto usará firebase.auth().onAuthStateChanged()
 *
 * @returns {Object|null} - Usuario o null
 */
function getCurrentUser() {
  try {
    const stored = sessionStorage.getItem('tutorlink_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Cierra sesión del usuario.
 * Sprint 4: llamará a firebase.auth().signOut() primero.
 */
async function logout() {
  // TODO Sprint 4: await firebase.auth().signOut();
  sessionStorage.removeItem('tutorlink_user');
  sessionStorage.removeItem('tutorlink_token');
  window.location.href = '../pages/login.html';
}
