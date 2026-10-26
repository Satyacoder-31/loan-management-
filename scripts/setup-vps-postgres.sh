#!/bin/bash
set -e

# 1. Create User and Database
sudo -u postgres psql -c "DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'sniper_user') THEN
    CREATE ROLE sniper_user WITH LOGIN PASSWORD 'Sniper_DB_Sec99@2026!';
  ELSE
    ALTER ROLE sniper_user WITH PASSWORD 'Sniper_DB_Sec99@2026!';
  END IF;
END
\$\$;"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'sniper_db'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE sniper_db OWNER sniper_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE sniper_db TO sniper_user;"
sudo -u postgres psql -d sniper_db -c "GRANT ALL ON SCHEMA public TO sniper_user;"
sudo -u postgres psql -d sniper_db -c "ALTER SCHEMA public OWNER TO sniper_user;"

# 2. Add ssl-cert group permission for postgres
adduser postgres ssl-cert 2>/dev/null || true

# 3. Configure postgresql.conf
CONF="/etc/postgresql/16/main/postgresql.conf"
sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = '*'/g" $CONF
sed -i "s/^listen_addresses = 'localhost'/listen_addresses = '*'/g" $CONF

# 4. Configure pg_hba.conf
HBA="/etc/postgresql/16/main/pg_hba.conf"
if ! grep -q "sniper_user" $HBA; then
    echo "hostssl sniper_db sniper_user 0.0.0.0/0 scram-sha-256" >> $HBA
    echo "hostssl sniper_db sniper_user ::/0 scram-sha-256" >> $HBA
    echo "host    sniper_db sniper_user 127.0.0.1/32 scram-sha-256" >> $HBA
fi

# 5. Restart postgresql
systemctl restart postgresql
systemctl status postgresql --no-pager
