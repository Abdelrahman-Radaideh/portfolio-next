-- =============================================================
-- FULL SCHEMA EXPORT — portfolio (Supabase project: tmdeznfqdcyarrnixday)
-- Generated: 2026-05-13
-- Target: PostgreSQL 15+ / any Postgres-compatible provider
-- =============================================================
-- ─────────────────────────────────────────────────────────────
-- 0. EXTENSIONS
-- ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA extensions;
-- ─────────────────────────────────────────────────────────────
-- 1. SEQUENCES
-- ─────────────────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS public.users_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.experiences_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.skills_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.projects_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- NOTE: auth_codes uses the sequence named secret_key_id_seq
CREATE SEQUENCE IF NOT EXISTS public.secret_key_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- ─────────────────────────────────────────────────────────────
-- 2. TABLES
-- ─────────────────────────────────────────────────────────────
-- 2.1 users
CREATE TABLE IF NOT EXISTS public.users (
    id integer NOT NULL DEFAULT nextval('public.users_id_seq'::regclass),
    name varchar NOT NULL,
    email varchar NOT NULL,
    job_title varchar,
    hero_description text,
    about_title varchar,
    about_description text,
    capabilities_description text,
    linkedin_url varchar,
    github_url varchar,
    resume_url varchar,
    picture_url varchar,
    portfolio_name varchar UNIQUE,
    is_active boolean DEFAULT false,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
-- 2.2 experiences
CREATE TABLE IF NOT EXISTS public.experiences (
    id integer NOT NULL DEFAULT nextval('public.experiences_id_seq'::regclass),
    user_id integer,
    company varchar,
    role varchar,
    period varchar,
    description text,
    CONSTRAINT experiences_pkey PRIMARY KEY (id),
    CONSTRAINT experiences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id)
);
-- 2.3 skills
CREATE TABLE IF NOT EXISTS public.skills (
    id integer NOT NULL DEFAULT nextval('public.skills_id_seq'::regclass),
    user_id integer,
    name varchar,
    type varchar CHECK (
        type::text = ANY (
            ARRAY ['primary'::varchar, 'secondary'::varchar]::text []
        )
    ),
    CONSTRAINT skills_pkey PRIMARY KEY (id),
    CONSTRAINT skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id),
    CONSTRAINT unique_name UNIQUE (name, user_id)
);
-- 2.4 projects
CREATE TABLE IF NOT EXISTS public.projects (
    id integer NOT NULL DEFAULT nextval('public.projects_id_seq'::regclass),
    user_id integer,
    title varchar,
    client varchar,
    role varchar,
    year integer,
    sort_order integer,
    description text,
    github_url varchar,
    technologies varchar,
    status varchar,
    images text [],
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id)
);
-- 2.5 auth_codes
CREATE TABLE IF NOT EXISTS public.auth_codes (
    id integer NOT NULL DEFAULT nextval('public.secret_key_id_seq'::regclass),
    code_hash varchar NOT NULL,
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz DEFAULT (now() + INTERVAL '10 minutes'),
    CONSTRAINT secret_key_pkey PRIMARY KEY (id)
);
-- ─────────────────────────────────────────────────────────────
-- 3. INDEXES
-- ─────────────────────────────────────────────────────────────
-- users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users USING btree (email);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users USING btree (id)
WHERE (is_active = true);
CREATE INDEX IF NOT EXISTS idx_users_portfolio_name_active ON public.users USING btree (portfolio_name)
WHERE (is_active = true);
-- experiences
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON public.experiences USING btree (user_id);
-- skills
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON public.skills USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_type ON public.skills USING btree (user_id, type);
-- projects
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects USING btree (status);
CREATE INDEX IF NOT EXISTS idx_projects_user_status_sort ON public.projects USING btree (user_id, status, sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_active ON public.projects USING btree (user_id, sort_order)
WHERE ((status)::text = 'active'::text);
-- auth_codes
CREATE INDEX IF NOT EXISTS idx_auth_codes_hash ON public.auth_codes USING btree (code_hash);
CREATE INDEX IF NOT EXISTS idx_auth_codes_expires_at ON public.auth_codes USING btree (expires_at);
-- ─────────────────────────────────────────────────────────────
-- 4. FUNCTIONS
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.reorder_projects_for_user(target_user_id integer) RETURNS void LANGUAGE plpgsql AS $function$ BEGIN WITH reordered AS (
        SELECT id,
            ROW_NUMBER() OVER (
                ORDER BY sort_order ASC,
                    id ASC
            ) AS new_rank
        FROM projects
        WHERE user_id = target_user_id
    )
UPDATE projects
SET sort_order = reordered.new_rank
FROM reordered
WHERE projects.id = reordered.id;
END;
$function$;
-- ─────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_codes ENABLE ROW LEVEL SECURITY;
-- ── users policies ──────────────────────────────────────────
CREATE POLICY "Enable select for everyone" ON public.users FOR
SELECT TO public USING (true);
CREATE POLICY "Public View Users" ON public.users FOR
SELECT TO public USING (true);
CREATE POLICY "Enable insert for everyone" ON public.users FOR
INSERT TO public WITH CHECK (true);
CREATE POLICY "Enable update for everyone" ON public.users FOR
UPDATE TO public USING (true);
CREATE POLICY "Allow public delete" ON public.users FOR DELETE TO public USING (true);
-- ── experiences policies ─────────────────────────────────────
CREATE POLICY "Enable select for experiences" ON public.experiences FOR
SELECT TO public USING (true);
CREATE POLICY "Public View Experiences" ON public.experiences FOR
SELECT TO public USING (true);
CREATE POLICY "Enable insert for experiences" ON public.experiences FOR
INSERT TO public WITH CHECK (true);
CREATE POLICY "Enable update for experiences" ON public.experiences FOR
UPDATE TO public USING (true);
CREATE POLICY "Enable delete for experiences" ON public.experiences FOR DELETE TO public USING (true);
CREATE POLICY "Allow public delete" ON public.experiences FOR DELETE TO public USING (true);
-- ── skills policies ──────────────────────────────────────────
CREATE POLICY "Enable select for skills" ON public.skills FOR
SELECT TO public USING (true);
CREATE POLICY "Public View Skills" ON public.skills FOR
SELECT TO public USING (true);
CREATE POLICY "Enable insert for skills" ON public.skills FOR
INSERT TO public WITH CHECK (true);
CREATE POLICY "Enable update for skills" ON public.skills FOR
UPDATE TO public USING (true);
CREATE POLICY "Enable delete for skills" ON public.skills FOR DELETE TO public USING (true);
CREATE POLICY "Allow public delete" ON public.skills FOR DELETE TO public USING (true);
-- ── projects policies ────────────────────────────────────────
CREATE POLICY "Enable select for projects" ON public.projects FOR
SELECT TO public USING (true);
CREATE POLICY "Public View Projects" ON public.projects FOR
SELECT TO public USING (true);
CREATE POLICY "Enable insert for projects" ON public.projects FOR
INSERT TO public WITH CHECK (true);
CREATE POLICY "Enable update for projects" ON public.projects FOR
UPDATE TO public USING (true);
CREATE POLICY "Enable delete for projects" ON public.projects FOR DELETE TO public USING (true);
CREATE POLICY "Allow public delete" ON public.projects FOR DELETE TO public USING (true);
-- ── auth_codes policies ──────────────────────────────────────
CREATE POLICY "Enable select for secret_key" ON public.auth_codes FOR
SELECT TO public USING (true);
CREATE POLICY "Enable insert for secret_key" ON public.auth_codes FOR
INSERT TO public WITH CHECK (true);
CREATE POLICY "Enable update for secret_key" ON public.auth_codes FOR
UPDATE TO public USING (true);
CREATE POLICY "Enable delete for secret_key" ON public.auth_codes FOR DELETE TO public USING (true);
CREATE POLICY "Allow public delete" ON public.auth_codes FOR DELETE TO public USING (true);
-- ─────────────────────────────────────────────────────────────
-- 6. SCHEDULES / CRON JOBS
-- ─────────────────────────────────────────────────────────────
-- No pg_cron schedules were found in this project.
-- If you need scheduled jobs on the target provider, install
-- pg_cron and configure jobs manually.
-- ─────────────────────────────────────────────────────────────
-- END OF SCHEMA
-- =============================================================