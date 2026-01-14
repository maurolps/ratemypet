-- migrate:up
CREATE TABLE IF NOT EXISTS pets (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
name TEXT NOT NULL,
type TEXT NOT NULL,
image_url TEXT,
caption TEXT,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)

-- migrate:down
DROP TABLE IF EXISTS pets;