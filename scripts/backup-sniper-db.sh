#!/bin/bash
BACKUP_DIR="/var/backups/sniper_db"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/sniper_db_$TIMESTAMP.sql.gz"

sudo -u postgres pg_dump sniper_db | gzip > "$BACKUP_FILE"
chmod 600 "$BACKUP_FILE"

# Keep last 14 days
find "$BACKUP_DIR" -type f -name "sniper_db_*.sql.gz" -mtime +14 -delete
echo "Backup created at $BACKUP_FILE (Size: $(du -sh "$BACKUP_FILE" | cut -f1))"
