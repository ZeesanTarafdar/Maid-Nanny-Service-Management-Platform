-- ============================================================
-- Maid & Nanny Service Management Platform — Database Schema
-- PostgreSQL
-- ============================================================

CREATE TYPE user_role AS ENUM ('household', 'helper', 'admin');
CREATE TYPE service_type AS ENUM ('maid', 'babysitter', 'nanny');
CREATE TYPE plan_cycle AS ENUM ('hourly', 'monthly', 'yearly');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE booking_status AS ENUM ('requested', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled');

-- ---------- Users (base identity for households, helpers, admins) ----------
CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  full_name      VARCHAR(120) NOT NULL,
  email          VARCHAR(160) UNIQUE NOT NULL,
  phone          VARCHAR(20),
  password_hash  VARCHAR(255) NOT NULL,
  role           user_role NOT NULL,
  address        VARCHAR(255),
  city           VARCHAR(100),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Helpers (maid / babysitter / nanny profile, 1:1 with users) ----------
CREATE TABLE helpers (
  id                    SERIAL PRIMARY KEY,
  user_id               INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  service_type          service_type NOT NULL,
  experience_years      NUMERIC(4,1) NOT NULL DEFAULT 0,
  bio                   TEXT,
  skills                TEXT[],
  hourly_rate           NUMERIC(10,2),
  monthly_rate          NUMERIC(10,2),
  yearly_rate           NUMERIC(10,2),
  availability          JSONB DEFAULT '{}',        -- e.g. {"mon":["09:00-13:00"], "tue":[...]}
  id_document_url       VARCHAR(255),
  background_check_url  VARCHAR(255),
  verification_status   verification_status NOT NULL DEFAULT 'pending',
  verification_notes    TEXT,
  rating_avg            NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count           INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Service Plans (pricing plans offered platform-wide) ----------
CREATE TABLE service_plans (
  id           SERIAL PRIMARY KEY,
  service_type service_type NOT NULL,
  cycle        plan_cycle NOT NULL,
  name         VARCHAR(80) NOT NULL,
  description  TEXT,
  base_price   NUMERIC(10,2) NOT NULL,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

-- ---------- Services (a helper opting into a specific plan) ----------
CREATE TABLE services (
  id              SERIAL PRIMARY KEY,
  helper_id       INTEGER NOT NULL REFERENCES helpers(id) ON DELETE CASCADE,
  service_plan_id INTEGER NOT NULL REFERENCES service_plans(id) ON DELETE CASCADE,
  custom_price    NUMERIC(10,2),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (helper_id, service_plan_id)
);

-- ---------- Bookings ----------
CREATE TABLE bookings (
  id               SERIAL PRIMARY KEY,
  household_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  helper_id        INTEGER NOT NULL REFERENCES helpers(id) ON DELETE CASCADE,
  service_plan_id  INTEGER NOT NULL REFERENCES service_plans(id),
  status           booking_status NOT NULL DEFAULT 'requested',
  scheduled_date   DATE NOT NULL,
  scheduled_time   TIME,
  duration_hours   NUMERIC(5,2),
  address          VARCHAR(255) NOT NULL,
  total_price      NUMERIC(10,2) NOT NULL,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Reviews ----------
CREATE TABLE reviews (
  id          SERIAL PRIMARY KEY,
  booking_id  INTEGER NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  household_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  helper_id   INTEGER NOT NULL REFERENCES helpers(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Indexes ----------
CREATE INDEX idx_helpers_service_type ON helpers(service_type);
CREATE INDEX idx_helpers_verification ON helpers(verification_status);
CREATE INDEX idx_bookings_household ON bookings(household_id);
CREATE INDEX idx_bookings_helper ON bookings(helper_id);
CREATE INDEX idx_bookings_status ON bookings(status);
