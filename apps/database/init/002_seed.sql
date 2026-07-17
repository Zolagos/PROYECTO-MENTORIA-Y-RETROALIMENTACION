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
