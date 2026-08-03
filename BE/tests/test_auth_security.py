import pytest
from app.services.auth_service import (
    calculate_primary_role,
    bootstrap_account,
    link_verified_firebase_identity_to_legacy_account,
)
from app.models.postgres import Account, AccountRole


def test_calculate_primary_role_logic():
    roles = [
        AccountRole(role="member", status="active"),
        AccountRole(role="admin", status="active"),
    ]
    assert calculate_primary_role(roles) == "admin"


@pytest.mark.asyncio
async def test_bootstrap_account_default_member_role(mocker=None):
    """
    Ensures that any new Firebase account (even with a special email)
    receives ONLY the 'member' role by default.
    """
    token_claim = {
        "uid": "test_uid_12345",
        "email": "thuthaor120608@gmail.com",
        "email_verified": True,
        "name": "Test Special Email",
    }
    
    # Mock AsyncSession
    class MockDb:
        def __init__(self):
            self.added = []
        def add(self, item):
            self.added.append(item)
        async def execute(self, stmt):
            class ScalarRes:
                def scalar_one_or_none(self):
                    return None
                def scalars(self):
                    class FirstRes:
                        def first(self):
                            return None
                    return FirstRes()
            return ScalarRes()
        async def flush(self):
            pass
        async def commit(self):
            pass
        async def refresh(self, obj):
            pass

    db = MockDb()
    account = await bootstrap_account(db, token_claim)
    
    # Check that created AccountRole was 'member', NOT 'admin'
    role_objs = [item for item in db.added if isinstance(item, AccountRole)]
    assert len(role_objs) == 1
    assert role_objs[0].role == "member"


@pytest.mark.asyncio
async def test_unverified_email_does_not_link_legacy():
    """
    Ensures that an unverified email (email_verified == False)
    CANNOT link to an existing legacy account.
    """
    class MockDb:
        async def execute(self, stmt):
            class ScalarRes:
                def scalars(self):
                    class FirstRes:
                        def first(self):
                            return Account(id="legacy_1", email="legacy@example.com", firebase_uid=None)
                    return FirstRes()
            return ScalarRes()

    db = MockDb()
    # Call with email_verified = False
    linked = await link_verified_firebase_identity_to_legacy_account(
        db=db,
        firebase_uid="new_uid_999",
        email="legacy@example.com",
        email_verified=False
    )
    assert linked is None
