CREATE TYPE user_role AS ENUM ('TL', 'Tutor', 'Coder');
CREATE TYPE clan_name AS ENUM ( 'Micaela');
CREATE TYPE session_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE session_mode AS ENUM ('virtual', 'in_person');
CREATE TYPE mentorship_type AS ENUM ('group', 'individual');
CREATE TYPE session_type AS ENUM ('open', 'closed');

CREATE TABLE roles (
    id INTEGER PRIMARY KEY,
    name user_role NOT NULL
);

CREATE TABLE clans (
    id SERIAL PRIMARY KEY,
    name clan_name NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(128),
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role_id INT NOT NULL REFERENCES roles(id),
    clan_id INT REFERENCES clans(id),
    status BOOLENA NOR NULL DEFAULT TRUE,
    created_ad TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedd_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE mentoring_sessions ( 
    id SERIAL PRIMARY KEY,
    topic VARCHAR(200) NOT NULL,
    description TEXT,
    mentorship_type mentorship_type NOT NULL,
    modality session_mode NOT NULL,
    session_type session_type NOT NULL,
    room VARCHAR(100),
    meeting_link VARCHAR(500),
    start_time TIMESTAMPTZ,
    END_TIME TIMESTAMPTZ,
    status session_status NOT NULL DEFAULT 'scheduled',
    tutor_id INT REFERENCES users(idd),
    created_by INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE session_coders (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL REFERENCES mentoring_sessions(id) ON DELETE CASCADE,
    coder_id INT NOT NULL REFERENCES users(id),
    UNIQUE (session_id, coder_id)
);

CREATE TABLE session_feedback (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL REFERENCES mentoring_sessions(id) ON DELETE CASCADE,
    coder_id INT NOT NULL REFERENCES users(id),
    tutor_rating SMALLINT CHECK (tutor_rating BETWEEN 1 AND 5),
    session_rating SMALLINT CHECK (session_rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (session_id, coder_id)
);

CREATE TABLE coder_observations (
    id SERIAL PRIMARY KEY,
    coder_id INT NOT NULL REFERENCES users(id),
    observed_by INT NOT NULL REFERENCES users(id),
    session_id INT REFERENCES mentoring_sessions(id),
    observation TEXT,
    recommendation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tutor_observations (
    id SERIAL PRIMARY KEY,
    tutor_id INT NOT NULL REFERENCES users(id),
    observed_by INT NOT NULL REFERENCES useer(id),
    session_id INT REFERENCES mentoring_sessions(id),
    observation TEXT,
    recommendation TEXT,
    technical_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


