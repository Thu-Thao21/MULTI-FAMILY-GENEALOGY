import pytest
from app.services.auth_service import (
    calculate_primary_role,
    format_account_me,
    bootstrap_account,
    link_verified_firebase_identity_to_legacy_account,
)
from app.models.postgres import Account, AccountRole


def test_calculate_primary_role_admin():
    roles = [
        AccountRole(role="member", status="active"),
        AccountRole(role="admin", status="active"),
    ]
    assert calculate_primary_role(roles) == "admin"


def test_calculate_primary_role_family_head():
    roles = [
        AccountRole(role="member", status="active"),
        AccountRole(role="family_head", status="active"),
    ]
    assert calculate_primary_role(roles) == "family_head"


def test_calculate_primary_role_member():
    roles = [
        AccountRole(role="member", status="active"),
    ]
    assert calculate_primary_role(roles) == "member"


def test_format_account_me_returns_all_roles():
    account = Account(
        id="acc_test_99",
        firebase_uid="Kt23xmxKJ6Stne3GEOerJ5ParHE3",
        email="admin_dev@genealogy.local",
        display_name="Admin Dev",
        email_verified=True,
        status="active",
    )
    role_admin = AccountRole(id="r1", account_id="acc_test_99", role="admin", status="active")
    role_member = AccountRole(id="r2", account_id="acc_test_99", role="member", status="active")
    account.roles = [role_admin, role_member]

    formatted = format_account_me(account)
    assert formatted.primary_role == "admin"
    assert len(formatted.roles) == 2
    role_names = [r.role for r in formatted.roles]
    assert "admin" in role_names
    assert "member" in role_names


@pytest.mark.asyncio
async def test_bootstrap_account_default_member_role():
    """
    Ensures that any new Firebase account
    receives ONLY the 'member' role by default.
    """
    token_claim = {
        "uid": "new_random_user_uid_123",
        "email": "user@example.com",
        "email_verified": True,
        "name": "New User",
    }
    
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
    
    # Check created AccountRole was 'member'
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
    linked = await link_verified_firebase_identity_to_legacy_account(
        db=db,
        firebase_uid="new_uid_999",
        email="legacy@example.com",
        email_verified=False
    )
    assert linked is None
