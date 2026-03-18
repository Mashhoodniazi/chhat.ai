#!/bin/bash
# Run this on the production server to create/reset the admin user.
# Usage: bash scripts/reset-admin.sh
#
# Requires: docker running with containers chatbot-app and chatbot-postgres

set -e

DB_CONTAINER="chatbot-postgres"
DB_USER="${POSTGRES_USER:-postgres}"
DB_NAME="${POSTGRES_DB:-chatbot}"
ADMIN_EMAIL="admin@chaat.ai"
ADMIN_PASS="@dmin@bdul123"

echo "→ Pulling node image (if not cached)..."
docker pull node:20-alpine -q

echo "→ Generating bcrypt hash..."
HASH=$(docker run --rm node:20-alpine \
  sh -c "npm install bcryptjs --silent 2>/dev/null && \
         node -e \"require('bcryptjs').hash('$ADMIN_PASS', 12).then(h => process.stdout.write(h))\"")

if [ -z "$HASH" ]; then
  echo "✗ Failed to generate password hash. Aborting."
  exit 1
fi

echo "→ Upserting admin user in database..."

docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" <<SQL
INSERT INTO "User" (id, email, password, name, plan, role, "createdAt")
VALUES (
  'admin_' || substr(md5(random()::text), 1, 20),
  '$ADMIN_EMAIL',
  '$HASH',
  'Admin',
  'BUSINESS',
  'ADMIN',
  NOW()
)
ON CONFLICT (email) DO UPDATE
  SET password = EXCLUDED.password,
      role     = 'ADMIN',
      plan     = 'BUSINESS';
SQL

echo ""
echo "✓ Admin user ready!"
echo "  URL:      https://yourdomain.com/admin786/login"
echo "  Email:    $ADMIN_EMAIL"
echo "  Password: $ADMIN_PASS"
