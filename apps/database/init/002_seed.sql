-- ============================================================
-- 002_seed.sql — Datos iniciales
-- Roles, clanes y usuarios de prueba para desarrollo local.
--
-- Credenciales de prueba (todas con la misma contraseña):
--   Contraseña: Password123!
--   El hash fue generado con bcryptjs (10 rounds).
--
-- Cobertura deliberada para pruebas manuales por clan y por rol:
--   - Dos clanes activos (Magdalena, Garabato), cada uno con
--     su propio Team Leader, dos Tutores y tres Coders.
--   - Sesiones en los cuatro estados, ambas modalidades, ambos
--     tipos (open/closed) y ambos clanes.
--   - Una sesión "open" con coders de AMBOS clanes asignados,
--     para validar que open realmente cruza clanes y closed no.
--   - Feedback real sobre varias sesiones completadas (antes
--     no existía ninguno, y el rating promedio siempre daba 0).
-- ============================================================

-- ---- ROLES ----
INSERT INTO roles (name) VALUES
    ('Team Leader'),
    ('Tutor'),
    ('Coder')
ON CONFLICT (name) DO NOTHING;

-- ---- CLANES ----
INSERT INTO clans (name) VALUES
    ('(1) Magdalena'),
    ('(2) Garabato'),
    ('(3) Mulata'),
    ('(4) Micaela'),
    ('(5) Cayena'),
    ('(6) Malecón'),
    ('(7) Cumbia'),
    ('(8) Cortissoz'),
    ('(9) Puerta de Oro'),
    ('(10) Esthercita'),
    ('(11) Centurión')
ON CONFLICT (name) DO NOTHING;

-- ---- USUARIOS DE PRUEBA ----
-- Password123! → $2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK
INSERT INTO users (
    password_hash,
    name,
    lastname,
    email,
    role_id,
    clan_id
) VALUES
    -- ---- Magdalena ----
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'María', 'Torres', 'maria.torres@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Team Leader'),
        (SELECT id FROM clans WHERE name = '(1) Magdalena')
    ),
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'Ana', 'García', 'ana.garcia@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Tutor'),
        (SELECT id FROM clans WHERE name = '(1) Magdalena')
    ),
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'Diego', 'Fernández', 'diego.fernandez@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Tutor'),
        (SELECT id FROM clans WHERE name = '(1) Magdalena')
    ),
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'Kevin', 'Mendoza', 'kevin.mendoza@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Coder'),
        (SELECT id FROM clans WHERE name = '(1) Magdalena')
    ),
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'Juan', 'Pérez', 'juan.perez@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Coder'),
        (SELECT id FROM clans WHERE name = '(1) Magdalena')
    ),
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'Valentina', 'Rojas', 'valentina.rojas@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Coder'),
        (SELECT id FROM clans WHERE name = '(1) Magdalena')
    ),
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'Andrés', 'Silva', 'andres.silva@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Coder'),
        (SELECT id FROM clans WHERE name = '(1) Magdalena')
    ),

    -- ---- Garabato ----
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'Sofía', 'Ramírez', 'sofia.ramirez@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Team Leader'),
        (SELECT id FROM clans WHERE name = '(2) Garabato')
    ),
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'Carlos', 'López', 'carlos.lopez@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Tutor'),
        (SELECT id FROM clans WHERE name = '(2) Garabato')
    ),
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'Camila', 'Torres', 'camila.torres@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Tutor'),
        (SELECT id FROM clans WHERE name = '(2) Garabato')
    ),
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'Laura', 'Castro', 'laura.castro@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Coder'),
        (SELECT id FROM clans WHERE name = '(2) Garabato')
    ),
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'Mateo', 'Gómez', 'mateo.gomez@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Coder'),
        (SELECT id FROM clans WHERE name = '(2) Garabato')
    ),
    (
        '$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
        'Isabella', 'Cruz', 'isabella.cruz@tutorlink.com',
        (SELECT id FROM roles WHERE name = 'Coder'),
        (SELECT id FROM clans WHERE name = '(2) Garabato')
    )
ON CONFLICT (email) DO NOTHING;

-- ---- MENTORING SESSIONS ----
WITH inserted_sessions AS (
    INSERT INTO mentoring_sessions (topic, description, mentorship_type, modality, session_type, room, meeting_link, start_time, end_time, status, tutor_id, clan_id, created_by)
    VALUES
        -- Magdalena — históricas (enero 2025)
        ('Fundamentos de JavaScript', 'Sesión grupal sobre closures y prototipos', 'group', 'in person', 'closed', 'Sala 201', NULL,
         '2025-01-15 14:00:00-05', '2025-01-15 16:00:00-05', 'completed',
         (SELECT id FROM users WHERE email = 'ana.garcia@tutorlink.com'),
         (SELECT id FROM clans WHERE name = '(1) Magdalena'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com')),

        ('Pair Programming', 'Práctica de pair programming con rotación de roles', 'group', 'in person', 'open', 'Lab 305', NULL,
         '2025-01-18 09:00:00-05', '2025-01-18 12:00:00-05', 'in_progress',
         (SELECT id FROM users WHERE email = 'ana.garcia@tutorlink.com'),
         (SELECT id FROM clans WHERE name = '(1) Magdalena'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com')),

        -- Garabato — históricas (enero 2025)
        ('Resolución de dudas SQL', 'Sesión individual para resolver dudas sobre consultas avanzadas', 'individual', 'virtual', 'closed', NULL,
         'https://meet.google.com/abc-defg-hij',
         '2025-01-20 10:00:00-05', '2025-01-20 11:00:00-05', 'scheduled',
         (SELECT id FROM users WHERE email = 'carlos.lopez@tutorlink.com'),
         (SELECT id FROM clans WHERE name = '(2) Garabato'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com')),

        ('Introducción a Git y GitHub', 'Sesión grupal sobre control de versiones y flujo de ramas', 'group', 'virtual', 'closed', NULL,
         'https://meet.google.com/xyz-mnop-qrs',
         '2025-01-22 15:00:00-05', '2025-01-22 17:00:00-05', 'scheduled',
         (SELECT id FROM users WHERE email = 'carlos.lopez@tutorlink.com'),
         (SELECT id FROM clans WHERE name = '(2) Garabato'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com')),

        ('Estructuras de datos', 'Sesión individual sobre pilas, colas y listas enlazadas', 'individual', 'virtual', 'closed', NULL,
         'https://meet.google.com/lmn-opqr-stu',
         '2025-01-10 08:00:00-05', '2025-01-10 09:00:00-05', 'cancelled',
         (SELECT id FROM users WHERE email = 'carlos.lopez@tutorlink.com'),
         (SELECT id FROM clans WHERE name = '(2) Garabato'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com')),

        -- Magdalena — mes actual (julio 2026), para dashboards con datos "de este mes"
        ('Testing con Jest', 'Sesión grupal sobre pruebas unitarias y mocks', 'group', 'virtual', 'closed', NULL,
         'https://meet.google.com/jst-test-001',
         '2026-07-10 14:00:00-05', '2026-07-10 16:00:00-05', 'completed',
         (SELECT id FROM users WHERE email = 'diego.fernandez@tutorlink.com'),
         (SELECT id FROM clans WHERE name = '(1) Magdalena'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com')),

        ('Diseño de APIs REST', 'Buenas prácticas para diseñar endpoints', 'individual', 'virtual', 'open', NULL,
         'https://meet.google.com/api-rest-002',
         '2026-08-05 10:00:00-05', '2026-08-05 11:00:00-05', 'scheduled',
         (SELECT id FROM users WHERE email = 'ana.garcia@tutorlink.com'),
         (SELECT id FROM clans WHERE name = '(1) Magdalena'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com')),

        -- Garabato — mes actual (julio 2026)
        ('Algoritmos de ordenamiento', 'Comparativa práctica de quicksort, mergesort y bubblesort', 'group', 'in person', 'closed', 'Sala 3B', NULL,
         '2026-07-12 09:00:00-05', '2026-07-12 11:00:00-05', 'completed',
         (SELECT id FROM users WHERE email = 'camila.torres@tutorlink.com'),
         (SELECT id FROM clans WHERE name = '(2) Garabato'),
         (SELECT id FROM users WHERE email = 'sofia.ramirez@tutorlink.com')),

        ('Manejo de Git avanzado', 'Rebase interactivo, cherry-pick y resolución de conflictos', 'individual', 'virtual', 'open', NULL,
         'https://meet.google.com/git-avz-003',
         '2026-07-18 15:00:00-05', '2026-07-18 16:30:00-05', 'in_progress',
         (SELECT id FROM users WHERE email = 'carlos.lopez@tutorlink.com'),
         (SELECT id FROM clans WHERE name = '(2) Garabato'),
         (SELECT id FROM users WHERE email = 'sofia.ramirez@tutorlink.com')),

        -- Magdalena, tipo OPEN con coders de AMBOS clanes asignados —
        -- caso de prueba específico para la regla "open permite cualquier clan".
        ('Buenas prácticas de código limpio', 'Sesión abierta a coders de cualquier clan sobre clean code', 'group', 'virtual', 'open', NULL,
         'https://meet.google.com/clean-code-004',
         '2026-08-12 09:00:00-05', '2026-08-12 11:00:00-05', 'scheduled',
         (SELECT id FROM users WHERE email = 'ana.garcia@tutorlink.com'),
         (SELECT id FROM clans WHERE name = '(1) Magdalena'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com'))
    RETURNING id, topic
)
INSERT INTO session_coders (session_id, coder_id)
SELECT s.id, u.id
FROM (VALUES
    ('Fundamentos de JavaScript', 'kevin.mendoza@tutorlink.com'),
    ('Fundamentos de JavaScript', 'juan.perez@tutorlink.com'),
    ('Pair Programming', 'kevin.mendoza@tutorlink.com'),
    ('Pair Programming', 'valentina.rojas@tutorlink.com'),
    ('Resolución de dudas SQL', 'laura.castro@tutorlink.com'),
    ('Introducción a Git y GitHub', 'laura.castro@tutorlink.com'),
    ('Introducción a Git y GitHub', 'mateo.gomez@tutorlink.com'),
    ('Estructuras de datos', 'laura.castro@tutorlink.com'),
    ('Testing con Jest', 'valentina.rojas@tutorlink.com'),
    ('Testing con Jest', 'andres.silva@tutorlink.com'),
    ('Algoritmos de ordenamiento', 'mateo.gomez@tutorlink.com'),
    ('Algoritmos de ordenamiento', 'isabella.cruz@tutorlink.com'),
    ('Manejo de Git avanzado', 'mateo.gomez@tutorlink.com'),
    -- cruce de clanes: Kevin es de Magdalena (el clan de la sesión),
    -- Mateo es de Garabato — solo es posible porque la sesión es 'open'.
    ('Buenas prácticas de código limpio', 'kevin.mendoza@tutorlink.com'),
    ('Buenas prácticas de código limpio', 'mateo.gomez@tutorlink.com')
) AS v(topic, email)
JOIN inserted_sessions s ON s.topic = v.topic
JOIN users u ON u.email = v.email;

-- ---- MENTORING REQUESTS ----
INSERT INTO mentoring_requests (coder_id, topic, description, request_date, state)
VALUES
    -- Magdalena
    ((SELECT id FROM users WHERE email = 'kevin.mendoza@tutorlink.com'),
     'Dudas sobre closures en JavaScript',
     'No entiendo bien cómo funcionan los closures en funciones anidadas.',
     '2025-01-14 09:30:00-05', 'accepted'),

    ((SELECT id FROM users WHERE email = 'juan.perez@tutorlink.com'),
     'Ayuda con consultas SQL avanzadas',
     'Necesito apoyo con JOINs múltiples y subconsultas.',
     '2025-01-17 15:00:00-05', 'pending'),

    ((SELECT id FROM users WHERE email = 'valentina.rojas@tutorlink.com'),
     'Introducción a TypeScript',
     'Quiero entender los tipos genéricos antes de usarlos en el proyecto final.',
     '2026-07-05 10:00:00-05', 'pending'),

    ((SELECT id FROM users WHERE email = 'andres.silva@tutorlink.com'),
     'Repaso de programación orientada a objetos',
     'Me gustaría reforzar herencia y polimorfismo con ejemplos prácticos.',
     '2026-07-08 16:00:00-05', 'accepted'),

    -- Garabato
    ((SELECT id FROM users WHERE email = 'laura.castro@tutorlink.com'),
     'Repaso de estructuras de datos',
     'Quisiera reforzar pilas, colas y listas enlazadas antes del proyecto.',
     '2025-01-19 11:00:00-05', 'denied'),

    ((SELECT id FROM users WHERE email = 'mateo.gomez@tutorlink.com'),
     'Ayuda con Docker y contenedores',
     'No logro entender cómo enlazar volúmenes entre contenedores.',
     '2026-07-09 09:00:00-05', 'pending'),

    ((SELECT id FROM users WHERE email = 'isabella.cruz@tutorlink.com'),
     'Buenas prácticas de testing',
     'Quiero aprender a escribir mejores pruebas de integración.',
     '2026-07-11 13:30:00-05', 'accepted');

-- ---- CODER OBSERVATIONS ----
INSERT INTO coder_observations (coder_id, observed_by, session_id, observation, recommendation)
SELECT u_coder.id, u_obs.id, s.id, v.observation, v.recommendation
FROM (VALUES
    -- Magdalena
    ('kevin.mendoza@tutorlink.com', 'ana.garcia@tutorlink.com', 'Fundamentos de JavaScript',
     'Kevin necesita reforzar el concepto de prototipos, pero entiende bien closures.',
     'Practicar ejercicios de la cadena de prototipos.'),

    ('kevin.mendoza@tutorlink.com', 'ana.garcia@tutorlink.com', 'Pair Programming',
     'Buena comunicación como navegante, debe mejorar cuando le toca conducir.',
     'Alternar más seguido los roles durante la práctica.'),

    ('juan.perez@tutorlink.com', 'ana.garcia@tutorlink.com', 'Fundamentos de JavaScript',
     'Juan tiene claros los fundamentos, participó activamente y ayudó a sus compañeros.',
     'Puede comenzar a explorar temas avanzados por su cuenta.'),

    ('valentina.rojas@tutorlink.com', 'ana.garcia@tutorlink.com', 'Pair Programming',
     'Muy ordenada al escribir código, le cuesta pedir ayuda cuando se atasca.',
     'Fomentar que verbalice cuando está bloqueada.'),

    ('valentina.rojas@tutorlink.com', 'diego.fernandez@tutorlink.com', 'Testing con Jest',
     'Escribió buenos casos de prueba, faltó cubrir los casos límite.',
     'Repasar el concepto de edge cases con ejemplos reales.'),

    ('andres.silva@tutorlink.com', 'diego.fernandez@tutorlink.com', 'Testing con Jest',
     'Entendió rápido los mocks, buena participación en el grupo.',
     'Puede avanzar a pruebas de integración.'),

    -- Garabato
    ('laura.castro@tutorlink.com', 'carlos.lopez@tutorlink.com', 'Resolución de dudas SQL',
     'Laura comprende bien JOINs pero tiene dudas con subconsultas correlacionadas.',
     'Revisar el capítulo de subconsultas y resolver 5 ejercicios.'),

    ('laura.castro@tutorlink.com', 'carlos.lopez@tutorlink.com', 'Introducción a Git y GitHub',
     'Buen manejo de ramas, aún duda al resolver conflictos de merge.',
     'Practicar conflictos de merge en un repositorio de prueba.'),

    ('mateo.gomez@tutorlink.com', 'carlos.lopez@tutorlink.com', 'Introducción a Git y GitHub',
     'Mateo mostró buen criterio para nombrar ramas y mensajes de commit.',
     'Puede empezar a revisar pull requests de sus compañeros.'),

    ('mateo.gomez@tutorlink.com', 'camila.torres@tutorlink.com', 'Algoritmos de ordenamiento',
     'Entendió bien la complejidad de quicksort, le falta soltura implementando mergesort.',
     'Practicar la implementación de mergesort desde cero.'),

    ('isabella.cruz@tutorlink.com', 'camila.torres@tutorlink.com', 'Algoritmos de ordenamiento',
     'Excelente participación, explicó bubblesort a sus compañeros con claridad.',
     'Puede avanzar a algoritmos de búsqueda binaria.')
) AS v(coder_email, observer_email, session_topic, observation, recommendation)
JOIN users u_coder ON u_coder.email = v.coder_email
JOIN users u_obs   ON u_obs.email   = v.observer_email
JOIN mentoring_sessions s ON s.topic = v.session_topic;

-- ---- TUTOR OBSERVATIONS ----
INSERT INTO tutor_observations (tutor_id, observed_by, session_id, observation, recommendation, technical_notes)
SELECT u_tutor.id, u_obs.id, s.id, v.observation, v.recommendation, v.technical_notes
FROM (VALUES
    -- Magdalena (observadas por María, TL de Magdalena)
    ('ana.garcia@tutorlink.com', 'maria.torres@tutorlink.com', 'Fundamentos de JavaScript',
     'Manejó bien el grupo, supo responder dudas técnicas con claridad.',
     'Incluir más ejemplos prácticos antes de la teoría.',
     'Se recomienda repasar el temario antes de cada sesión.'),

    ('ana.garcia@tutorlink.com', 'maria.torres@tutorlink.com', 'Pair Programming',
     'Excelente dinamismo, logró mantener a los coders enfocados todo el tiempo.',
     'Podría intentar sesiones más largas o con más participantes.',
     'Considerar para mentorías grupales avanzadas.'),

    ('diego.fernandez@tutorlink.com', 'maria.torres@tutorlink.com', 'Testing con Jest',
     'Primera sesión como tutor, buen dominio técnico de Jest y mocks.',
     'Trabajar el manejo de tiempos y ritmo de la sesión.',
     'Tiene potencial para liderar el módulo de testing.'),

    -- Garabato (observadas por Sofía, TL de Garabato)
    ('carlos.lopez@tutorlink.com', 'sofia.ramirez@tutorlink.com', 'Resolución de dudas SQL',
     'Buena disposición y paciencia, pero la explicación fue muy teórica.',
     'Preparar un ejercicio práctico para la siguiente sesión individual.',
     'Tiene potencial para liderar sesiones grupales.'),

    ('carlos.lopez@tutorlink.com', 'sofia.ramirez@tutorlink.com', 'Manejo de Git avanzado',
     'Debe mejorar la comunicación escrita en la descripción de la sesión.',
     'Usar listas de verificación en las descripciones de las sesiones.',
     'Monitorear progreso en las próximas 2 semanas.'),

    ('camila.torres@tutorlink.com', 'sofia.ramirez@tutorlink.com', 'Algoritmos de ordenamiento',
     'Muy sólida técnicamente, la sesión tuvo buen ritmo y participación.',
     'Podría documentar su material para reutilizarlo en otros clanes.',
     'Candidata a mentora referente en algoritmos.')
) AS v(tutor_email, observer_email, session_topic, observation, recommendation, technical_notes)
JOIN users u_tutor ON u_tutor.email = v.tutor_email
JOIN users u_obs   ON u_obs.email   = v.observer_email
JOIN mentoring_sessions s ON s.topic = v.session_topic;

-- ---- SESSION FEEDBACK ----
-- Antes no había ningún feedback sembrado, así que "Average rating" en
-- Metrics siempre mostraba 0.0 sin importar los datos. Se agrega feedback
-- real sobre las sesiones completadas que ya tienen participantes.
INSERT INTO session_feedback (session_id, coder_id, tutor_rating, session_rating, comments)
SELECT s.id, u.id, v.tutor_rating, v.session_rating, v.comments
FROM (VALUES
    -- Magdalena
    ('Fundamentos de JavaScript', 'kevin.mendoza@tutorlink.com', 5, 4, 'Muy clara la explicación de prototipos.'),
    ('Fundamentos de JavaScript', 'juan.perez@tutorlink.com', 4, 5, 'Excelente ritmo, aprendí bastante.'),
    ('Testing con Jest', 'valentina.rojas@tutorlink.com', 4, 4, 'Buenos ejemplos, me hubiera gustado más tiempo para practicar.'),
    ('Testing con Jest', 'andres.silva@tutorlink.com', 5, 5, 'La mejor sesión que he tenido hasta ahora.'),

    -- Garabato
    ('Algoritmos de ordenamiento', 'mateo.gomez@tutorlink.com', 5, 4, 'Camila explica muy bien los algoritmos con ejemplos visuales.'),
    ('Algoritmos de ordenamiento', 'isabella.cruz@tutorlink.com', 4, 4, 'Buena sesión, algo rápida al final.')
) AS v(session_topic, coder_email, tutor_rating, session_rating, comments)
JOIN mentoring_sessions s ON s.topic = v.session_topic
JOIN users u ON u.email = v.coder_email;
