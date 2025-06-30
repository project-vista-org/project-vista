"""add_is_public_to_tracks

Revision ID: 50ad4c89217b
Revises:
Create Date: 2025-06-29 22:48:17.245900

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '50ad4c89217b'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add is_public column to tracks table
    op.add_column(
        'tracks',
        sa.Column('is_public', sa.Boolean(), nullable=False, server_default='false'),
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Remove is_public column from tracks table
    op.drop_column('tracks', 'is_public')
