"""sync_firebase_dev_uids

Revision ID: 20260804_sync_uids
Revises: 
Create Date: 2026-08-04 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20260804_sync_uids'
down_revision = None
branch_labels = None
depends_on = None

ADMIN_UID = "Kt23xmxKJ6Stne3GEOerJ5ParHE3"
FAMILY_HEAD_UID = "X3Mx5ugiraf0rwqNWxaJVaHdZ632"


def upgrade():
    # Update admin seed account if exists with fake UID
    op.execute(
        f"UPDATE accounts SET firebase_uid = '{ADMIN_UID}' WHERE id = 'admin_default_001' AND (firebase_uid = 'admin_default_001' OR firebase_uid IS NULL);"
    )
    # Update family head seed account if exists with fake UID
    op.execute(
        f"UPDATE accounts SET firebase_uid = '{FAMILY_HEAD_UID}' WHERE id = 'family_head_default_001' AND (firebase_uid = 'family_head_default_001' OR firebase_uid IS NULL);"
    )


def downgrade():
    # Downgrade is not recommended as it reverts to fake UIDs
    pass
