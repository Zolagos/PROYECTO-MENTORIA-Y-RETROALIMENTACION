CREATE TYPE user_role AS ENUM ('Team Leader', 'Tutor', 'Coder');
CREATE TYPE clan_name AS ENUM ('(1) Magdalena', '(2) Garabato', '(3) Mulata', '(4) Micaela', '(5) Cayena', '(6) Malecón', '(7) Cumbia', '(8) Cortissoz', '(9) Puerta de Oro', '(10) Esthercita', '(11) Centurión');
CREATE TYPE session_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE session_mode AS ENUM ('virtual', 'in person');
CREATE TYPE mentorship_type AS ENUM ('group', 'individual');
CREATE TYPE session_type AS ENUM ('open', 'closed');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'denied');

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name user_role NOT NULL UNIQUE
);

CREATE TABLE clans (
    id SERIAL PRIMARY KEY,
    name clan_name NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role_id INT NOT NULL,
    clan_id INT,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    FOREIGN KEY (clan_id) REFERENCES clans(id) ON DELETE SET NULL
);

CREATE TABLE mentoring_requests (
    id SERIAL PRIMARY KEY,
    coder_id INT NOT NULL,
    topic VARCHAR(200) NOT NULL,
    description TEXT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    state request_status NOT NULL DEFAULT 'pending',
    FOREIGN KEY (coder_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE mentoring_sessions (
    id SERIAL PRIMARY KEY,
    topic VARCHAR(200) NOT NULL,
    description TEXT,
    mentorship_type mentorship_type NOT NULL,
    modality session_mode NOT NULL,
    session_type session_type NOT NULL DEFAULT 'closed',
    room VARCHAR(100),
    meeting_link VARCHAR(500),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    status session_status DEFAULT 'scheduled',
    tutor_id INT,
    created_by INT NOT NULL,
    request_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (request_id) REFERENCES mentoring_requests(id) ON DELETE SET NULL
);

CREATE TABLE session_coders (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL,
    coder_id INT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES mentoring_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (coder_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE session_feedback (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL,
    coder_id INT NOT NULL,
    tutor_rating SMALLINT CHECK (tutor_rating BETWEEN 1 AND 5),
    session_rating SMALLINT CHECK (session_rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES mentoring_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (coder_id) REFERENCES users(id) ON DELETE RESTRICT,
    UNIQUE (session_id, coder_id)
);

CREATE TABLE coder_observations (
    id SERIAL PRIMARY KEY,
    coder_id INT NOT NULL,
    observed_by INT NOT NULL,
    session_id INT,
    observation TEXT NOT NULL,
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coder_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (observed_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (session_id) REFERENCES mentoring_sessions(id) ON DELETE SET NULL
);

CREATE TABLE tutor_observations (
    id SERIAL PRIMARY KEY,
    tutor_id INT NOT NULL,
    observed_by INT NOT NULL,
    session_id INT,
    observation TEXT NOT NULL,
    recommendation TEXT,
    technical_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (observed_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (session_id) REFERENCES mentoring_sessions(id) ON DELETE SET NULL
);
