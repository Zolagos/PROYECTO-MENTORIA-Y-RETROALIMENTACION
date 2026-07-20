-- ============================================================
-- 002_seed.sql — Datos iniciales
-- Roles, clanes y usuarios de prueba para desarrollo local.
--
-- Credenciales de prueba (todas con la misma contraseña):
--   Contraseña: Password123!
--   El hash fue generado con bcryptjs (10 rounds).
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

INSERT INTO users (password_hash, name, lastname, email, role_id, clan_id) VALUES
    -- Team Leader
    ('$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
     'María', 'Torres', 'maria.torres@tutorlink.com',
     (SELECT id FROM roles WHERE name = 'Team Leader'), NULL),

    -- Tutores
    ('$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
     'Ana', 'García', 'ana.garcia@tutorlink.com',
     (SELECT id FROM roles WHERE name = 'Tutor'), NULL),
    ('$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
     'Carlos', 'López', 'carlos.lopez@tutorlink.com',
     (SELECT id FROM roles WHERE name = 'Tutor'), NULL),

    -- Coders
    ('$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
     'Kevin', 'Mendoza', 'kevin.mendoza@tutorlink.com',
     (SELECT id FROM roles WHERE name = 'Coder'),
     (SELECT id FROM clans WHERE name = '(1) Magdalena')),
    ('$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
     'Juan', 'Pérez', 'juan.perez@tutorlink.com',
     (SELECT id FROM roles WHERE name = 'Coder'),
     (SELECT id FROM clans WHERE name = '(1) Magdalena')),
    ('$2b$10$rmDt/8GII2/GMwRupPiJz.xnG.TFiGQrozHi6P.fXKsb3e9acryDK',
     'Laura', 'Castro', 'laura.castro@tutorlink.com',
     (SELECT id FROM roles WHERE name = 'Coder'),
     (SELECT id FROM clans WHERE name = '(2) Garabato'))
ON CONFLICT (email) DO NOTHING;

-- ---- MENTORING SESSIONS ----
WITH inserted_sessions AS (
    INSERT INTO mentoring_sessions (topic, description, mentorship_type, modality, session_type, room, meeting_link, start_time, end_time, status, tutor_id, created_by)
    VALUES
        ('Fundamentos de JavaScript', 'Sesión grupal sobre closures y prototipos', 'group', 'in person', 'closed', 'Sala 201', NULL,
         '2025-01-15 14:00:00-05', '2025-01-15 16:00:00-05', 'completed',
         (SELECT id FROM users WHERE email = 'ana.garcia@tutorlink.com'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com')),

        ('Resolución de dudas SQL', 'Sesión individual para resolver dudas sobre consultas avanzadas', 'individual', 'virtual', 'closed', NULL,
         'https://meet.google.com/abc-defg-hij',
         '2025-01-20 10:00:00-05', '2025-01-20 11:00:00-05', 'scheduled',
         (SELECT id FROM users WHERE email = 'carlos.lopez@tutorlink.com'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com')),

        ('Pair Programming', 'Práctica de pair programming con rotación de roles', 'group', 'in person', 'open', 'Lab 305', NULL,
         '2025-01-18 09:00:00-05', '2025-01-18 12:00:00-05', 'in_progress',
         (SELECT id FROM users WHERE email = 'ana.garcia@tutorlink.com'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com')),

        ('Introducción a Git y GitHub', 'Sesión grupal sobre control de versiones y flujo de ramas', 'group', 'virtual', 'closed', NULL,
         'https://meet.google.com/xyz-mnop-qrs',
         '2025-01-22 15:00:00-05', '2025-01-22 17:00:00-05', 'scheduled',
         (SELECT id FROM users WHERE email = 'carlos.lopez@tutorlink.com'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com')),

        ('Estructuras de datos', 'Sesión individual sobre pilas, colas y listas enlazadas', 'individual', 'virtual', 'closed', NULL,
         'https://meet.google.com/lmn-opqr-stu',
         '2025-01-10 08:00:00-05', '2025-01-10 09:00:00-05', 'cancelled',
         (SELECT id FROM users WHERE email = 'carlos.lopez@tutorlink.com'),
         (SELECT id FROM users WHERE email = 'maria.torres@tutorlink.com'))
    RETURNING id, topic
)
INSERT INTO session_coders (session_id, coder_id)
SELECT s.id, u.id
FROM (VALUES
    ('Fundamentos de JavaScript', 'kevin.mendoza@tutorlink.com'),
    ('Fundamentos de JavaScript', 'juan.perez@tutorlink.com'),
    ('Resolución de dudas SQL', 'laura.castro@tutorlink.com'),
    ('Pair Programming', 'kevin.mendoza@tutorlink.com'),
    ('Pair Programming', 'laura.castro@tutorlink.com'),
    ('Introducción a Git y GitHub', 'kevin.mendoza@tutorlink.com'),
    ('Introducción a Git y GitHub', 'juan.perez@tutorlink.com'),
    ('Introducción a Git y GitHub', 'laura.castro@tutorlink.com'),
    ('Estructuras de datos', 'laura.castro@tutorlink.com')
) AS v(topic, email)
JOIN inserted_sessions s ON s.topic = v.topic
JOIN users u ON u.email = v.email;

-- ---- MENTORING REQUESTS ----
INSERT INTO mentoring_requests (coder_id, topic, description, request_date, state)
VALUES
    ((SELECT id FROM users WHERE email = 'kevin.mendoza@tutorlink.com'),
     'Dudas sobre closures en JavaScript',
     'No entiendo bien cómo funcionan los closures en funciones anidadas.',
     '2025-01-14 09:30:00-05', 'accepted'),

    ((SELECT id FROM users WHERE email = 'juan.perez@tutorlink.com'),
     'Ayuda con consultas SQL avanzadas',
     'Necesito apoyo con JOINs múltiples y subconsultas.',
     '2025-01-17 15:00:00-05', 'pending'),

    ((SELECT id FROM users WHERE email = 'laura.castro@tutorlink.com'),
     'Repaso de estructuras de datos',
     'Quisiera reforzar pilas, colas y listas enlazadas antes del proyecto.',
     '2025-01-19 11:00:00-05', 'denied');
