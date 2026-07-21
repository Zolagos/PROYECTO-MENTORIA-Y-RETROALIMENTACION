# Guia de contribución 

### Convención de nomenclatura de ramas
| Tipo | Descripción | Ejemplo |
| `feature/` o `feat/` | Nueva funcionalidad | `feature/report-voting` |
| `fix/` | Corrección de errores | `fix/login-redirect-loop` |
| `refactor/` | Reestructuración sin cambio de comportamiento | `refactor/extract-report-service` |
| `chore/` | Herramientas, dependencias, configuración | `chore/upgrade-vite` |
| `docs/` | Solo documentación | `docs/api-endpoints` |

### Reglas 
- **Nunca hacer push directo a `main`.** Todos los cambios a `main` deben venir de un pull request.
- **Nunca hacer push directo a `dev`.** Todos los cambios a `dev` deben venir de un pull request.
- Cualquier commit pusheado directamente a `main` será eliminado.

---

## Conventional Commits

Cada mensaje de commit debe seguir la especificación **Conventional Commits**.

### Formato

```
<tipo>(<alcance>): <descripción>
```

### Tipos

| Tipo | Cuándo usarlo |
|------|---------------|
| `feat` | Una nueva funcionalidad |
| `fix` | Corrección de un error |
| `refactor` | Cambio que no corrige error ni agrega funcionalidad |
| `style` | Formato, punto y coma faltante, etc. (sin cambio en código de producción) |
| `docs` | Solo cambios en documentación |
| `chore` | Proceso de build, dependencias o herramientas |
| `test` | Agregar o modificar tests |
| `perf` | Mejora de rendimiento |

### Alcance (Scope)

El alcance indica **qué área** afecta el cambio.

Alcances frontend: `router`, `store`, `pages`, `components`, `services`, `styles`, `utils`, `layout`
Alcances backend: `routes`, `models`, `services`, `schemas`, `middleware`, `mongo`, `config`
Transversales: `deps`, `config`, `ci`, `docs`

### Ejemplos

```
feat(reports): add community voting on reports
feat(router): implement route guards for authenticated pages
fix(services): handle 401 response and redirect to login
refactor(store): replace manual event emit with Proxy-based reactivity
chore(deps): upgrade tailwindcss to v4
docs(api): document report status transition endpoints
style(components): format Button.js with consistent spacing
test(models): add unit tests for Report status transitions
```

### Reglas

- **La descripción debe estar en inglés.**
- **La descripción debe ser imperativa, en presente:** "add" no "added" ni "adds".
- **La descripción debe ser concisa** — menos de 72 caracteres si es posible.
- **No capitalizar la primera letra** de la descripción.
- **Sin punto al final.**

> Cualquier commit que no siga esta convención será **eliminado**.
> Usa `git rebase` para corregir mensajes antes de pushear.

---

## Tamaño de los Commits

### Pautas

- **Un commit por cambio lógico.** Si corriges dos errores no relacionados, haz dos commits.
- **Un archivo por commit** es aceptable cuando los archivos no están relacionados.
- **Agrupa archivos relacionados** en un solo commit solo cuando los cambios compartan el mismo propósito y no puedan funcionar independientemente.
- **Commits grandes están fuertemente desaconsejados.** Si cambiaste 20+ archivos, reconsidera si se pueden dividir.

### Ejemplos correctos

```
feat(auth): add login form component
    - src/components/domain/LoginForm.js (nuevo)

feat(auth): wire login form to auth service
    - src/pages/auth/login.js (modificado)
    - src/services/auth.service.js (modificado)
    - src/store/auth.store.js (modificado)
```

Son dos commits separados porque el componente puede existir independientemente de la conexión con el servicio.

### Ejemplos incorrectos

```
feat: add lots of stuff
    - 35 archivos cambiados, 1200 adiciones

fix(styles): fix style
    - Todos los archivos CSS del proyecto modificados "porque lo necesitaban"
```

---

## Flujo de Pull Request

1. Crea una rama feature/fix desde `dev`:

   ```bash
   git checkout dev
   git pull
   git checkout -b feature/report-voting
   ```

2. Haz commits siguiendo el formato Conventional Commits.

3. Pushea y abre un PR apuntando a la rama que creaste (nunca a `dev` o `main`).

4. Asegúrate de que la descripción del PR explique **qué** y **por qué**.

5. Después de revisión y aprobación, la rama se fusiona en la rama destino.

6. Periódicamente, la ramque creaste se fusionan en `dev` para pruebas de integración.

7. Cuando `dev` esté estable, se abre un PR de `dev` a `main` para release.

### Formato del Título del PR

Mismo formato que los commits:

```
feat(reports): add community voting on reports
```

### Template de Descripción del PR

```markdown
## Qué
Breve descripción del cambio.

## Por qué
Razón del cambio.

## Cómo probar
Pasos para verificar que el cambio funciona.

## Capturas de pantalla (si aplica)
```