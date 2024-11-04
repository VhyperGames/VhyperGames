/**
 * Actualiza el almacenamiento local con un nuevo ítem.
 * 
 * @param {object[]} item - El objeto o array que se va a almacenar en localStorage.
 * @param {string} clave - La clave bajo la cual se guardará el ítem en localStorage.
 */
export function updateLocalStorage(item, clave) {
  localStorage.setItem(clave, JSON.stringify(item));
}

/**
 * Actualiza el almacenamiento de sesión con un nuevo ítem.
 * 
 * @param {object[]} item - El objeto o array que se va a almacenar en sessionStorage.
 * @param {string} clave - La clave bajo la cual se guardará el ítem en sessionStorage.
 */
export function updateSessionStorage(item, clave) {
  sessionStorage.setItem(clave, JSON.stringify(item));
}

/**
 * Obtiene una variable del almacenamiento local.
 * 
 * @param {string} clave - La clave bajo la cual se guardó el ítem en localStorage.
 * @returns {object[]} - El objeto o array recuperado del almacenamiento local, o un array vacío.
 */
export function getVarLS(clave) {
  return JSON.parse(localStorage.getItem(clave)) || [];
}

/**
 * Obtiene una variable del almacenamiento de sesión.
 * 
 * @param {string} clave - La clave bajo la cual se guardó el ítem en sessionStorage.
 * @returns {object[]} - El objeto o array recuperado del almacenamiento de sesión, o un array vacío.
 */
export function getVarSS(clave) {
  return JSON.parse(sessionStorage.getItem(clave)) || [];
}

/**
 * Elimina un ítem del almacenamiento local.
 * 
 * @param {string} clave - La clave del ítem que se va a eliminar del localStorage.
 */
export function deleteLocalStorage(clave) {
  localStorage.removeItem(clave);
}

/**
 * Elimina un ítem del almacenamiento de sesión.
 * 
 * @param {string} clave - La clave del ítem que se va a eliminar del sessionStorage.
 */
export function deleteSessionStorage(clave) {
  sessionStorage.removeItem(clave);
}