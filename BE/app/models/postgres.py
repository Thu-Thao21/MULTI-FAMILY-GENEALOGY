from __future__ import annotations

from datetime import date, datetime
from uuid import uuid4

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Index, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.postgres import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class IdMixin:
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    email: Mapped[str | None] = mapped_column(String(255), unique=True, index=True, nullable=True)
    username: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30), unique=True, index=True, nullable=True)
    member_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    role: Mapped[str] = mapped_column(String(32), default="member", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)
    reset_token: Mapped[str | None] = mapped_column(String(255), nullable=True)
    reset_token_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    otp_code: Mapped[str | None] = mapped_column(String(20), nullable=True)
    otp_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    password_resets: Mapped[list["PasswordReset"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class PasswordReset(Base):
    __tablename__ = "password_reset_tokens"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    email_or_phone: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    otp_code: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user: Mapped[User] = relationship(back_populates="password_resets")


Index("ix_password_resets_email_otp", PasswordReset.email_or_phone, PasswordReset.otp_code)


class UserSession(Base):
    __tablename__ = "user_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    session_token: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Permission(Base):
    __tablename__ = "permissions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    code: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class RolePermission(Base):
    __tablename__ = "role_permissions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    role_name: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    permission_id: Mapped[str] = mapped_column(String(36), ForeignKey("permissions.id", ondelete="CASCADE"), nullable=False, index=True)
    granted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class FamilyMembership(Base):
    __tablename__ = "family_memberships"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    family_id: Mapped[str] = mapped_column(String(36), ForeignKey("families.id", ondelete="CASCADE"), nullable=False, index=True)
    membership_role: Mapped[str] = mapped_column(String(80), default="member", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Family(Base):
    __tablename__ = "families"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    founder_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    founder_member_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    family_head_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    origin_place: Mapped[str | None] = mapped_column(Text, nullable=True)
    ancestral_house_address: Mapped[str | None] = mapped_column(Text, nullable=True)
    history: Mapped[str | None] = mapped_column(Text, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    branches: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)
    created_by: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    members: Mapped[list["Member"]] = relationship(back_populates="family", cascade="all, delete-orphan")


class FamilyTree(Base):
    __tablename__ = "family_trees"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    family_id: Mapped[str] = mapped_column(String(36), ForeignKey("families.id", ondelete="CASCADE"), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    root_member_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class FamilyBranch(Base):
    __tablename__ = "family_branches"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    family_id: Mapped[str] = mapped_column(String(36), ForeignKey("families.id", ondelete="CASCADE"), nullable=False, index=True)
    tree_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("family_trees.id", ondelete="SET NULL"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    parent_branch_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    branch_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class Member(Base):
    __tablename__ = "members"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    family_id: Mapped[str] = mapped_column(String(36), ForeignKey("families.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    other_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    gender: Mapped[str] = mapped_column(String(16), nullable=False)
    birth_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    death_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    lunar_death_date: Mapped[str | None] = mapped_column(String(80), nullable=True)
    is_alive: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    burial_place: Mapped[str | None] = mapped_column(Text, nullable=True)
    burial_coordinates: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    father_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    mother_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    branch: Mapped[str | None] = mapped_column(String(120), nullable=True)
    sub_branch: Mapped[str | None] = mapped_column(String(120), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="alive", nullable=False)
    occupation: Mapped[str | None] = mapped_column(String(255), nullable=True)
    education: Mapped[str | None] = mapped_column(String(255), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    gallery_photos: Mapped[list[dict]] = mapped_column(JSON, default=list, nullable=False)
    career_history: Mapped[list[dict]] = mapped_column(JSON, default=list, nullable=False)
    contact: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    privacy_settings: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    contribution: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    generation: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    family: Mapped[Family] = relationship(back_populates="members")


class MemberFamilyAffiliation(Base):
    __tablename__ = "member_family_affiliations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    member_id: Mapped[str] = mapped_column(String(36), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    family_id: Mapped[str] = mapped_column(String(36), ForeignKey("families.id", ondelete="CASCADE"), nullable=False, index=True)
    branch_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("family_branches.id", ondelete="SET NULL"), nullable=True)
    relationship_role: Mapped[str | None] = mapped_column(String(80), nullable=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)


class ParentChildRelationship(Base):
    __tablename__ = "parent_child_relationships"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    parent_member_id: Mapped[str] = mapped_column(String(36), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    child_member_id: Mapped[str] = mapped_column(String(36), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    relation_type: Mapped[str] = mapped_column(String(32), default="biological", nullable=False)
    verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class Union(Base):
    __tablename__ = "unions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    family_id: Mapped[str] = mapped_column(String(36), ForeignKey("families.id", ondelete="CASCADE"), nullable=False, index=True)
    union_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    union_type: Mapped[str] = mapped_column(String(32), default="marriage", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class UnionMember(Base):
    __tablename__ = "union_members"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    union_id: Mapped[str] = mapped_column(String(36), ForeignKey("unions.id", ondelete="CASCADE"), nullable=False, index=True)
    member_id: Mapped[str] = mapped_column(String(36), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(32), default="spouse", nullable=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class FamilyLinkRequest(Base):
    __tablename__ = "family_link_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    source_family_id: Mapped[str] = mapped_column(String(36), ForeignKey("families.id", ondelete="CASCADE"), nullable=False, index=True)
    target_family_id: Mapped[str] = mapped_column(String(36), ForeignKey("families.id", ondelete="CASCADE"), nullable=False, index=True)
    requested_by_user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    request_type: Mapped[str] = mapped_column(String(32), default="marriage", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="pending", nullable=False)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    reviewed_by_user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class Relationship(Base):
    __tablename__ = "relationships"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    member_a_id: Mapped[str] = mapped_column(String(36), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    member_b_id: Mapped[str] = mapped_column(String(36), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    relation_type: Mapped[str] = mapped_column(String(32), nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class FamilyLink(Base):
    __tablename__ = "family_links"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    source_family_id: Mapped[str] = mapped_column(String(36), ForeignKey("families.id", ondelete="CASCADE"), nullable=False, index=True)
    target_family_id: Mapped[str] = mapped_column(String(36), ForeignKey("families.id", ondelete="CASCADE"), nullable=False, index=True)
    linked_member_a: Mapped[str | None] = mapped_column(String(36), ForeignKey("members.id", ondelete="SET NULL"), nullable=True)
    linked_member_b: Mapped[str | None] = mapped_column(String(36), ForeignKey("members.id", ondelete="SET NULL"), nullable=True)
    link_type: Mapped[str] = mapped_column(String(32), nullable=False)
    request_status: Mapped[str] = mapped_column(String(32), default="pending", nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class MemberContact(Base):
    __tablename__ = "member_contacts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    member_id: Mapped[str] = mapped_column(String(36), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    contact_type: Mapped[str] = mapped_column(String(32), nullable=False)
    contact_value: Mapped[str] = mapped_column(String(255), nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class MemberPrivacyRule(Base):
    __tablename__ = "member_privacy_rules"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    member_id: Mapped[str] = mapped_column(String(36), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    field_name: Mapped[str] = mapped_column(String(80), nullable=False)
    visibility_level: Mapped[str] = mapped_column(String(32), default="family", nullable=False)
    can_view_user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class MemberMedia(Base):
    __tablename__ = "member_media"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    member_id: Mapped[str] = mapped_column(String(36), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    media_type: Mapped[str] = mapped_column(String(32), nullable=False)
    media_url: Mapped[str] = mapped_column(Text, nullable=False)
    caption: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class MemberLifeEvent(Base):
    __tablename__ = "member_life_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    member_id: Mapped[str] = mapped_column(String(36), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(32), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    event_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False, index=True)
    category: Mapped[str | None] = mapped_column(String(120), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class MemberSkill(Base):
    __tablename__ = "member_skills"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    member_id: Mapped[str] = mapped_column(String(36), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id: Mapped[str] = mapped_column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    proficiency_level: Mapped[str] = mapped_column(String(32), default="basic", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class ChangeRequest(Base):
    __tablename__ = "change_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    requester_user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    target_type: Mapped[str] = mapped_column(String(80), nullable=False)
    target_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    request_type: Mapped[str] = mapped_column(String(80), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="pending", nullable=False)
    payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    reviewer_user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action: Mapped[str] = mapped_column(String(120), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(80), nullable=False)
    entity_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    details: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class DeathAnniversaryReminder(Base):
    __tablename__ = "death_anniversary_reminders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    member_id: Mapped[str] = mapped_column(String(36), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    reminder_date: Mapped[date] = mapped_column(Date, nullable=False)
    notified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="scheduled", nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    notification_type: Mapped[str] = mapped_column(String(80), default="general", nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ImportJob(Base):
    __tablename__ = "import_jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    job_type: Mapped[str] = mapped_column(String(80), nullable=False)
    source_file: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="queued", nullable=False)
    result_summary: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class ExportJob(Base):
    __tablename__ = "export_jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    job_type: Mapped[str] = mapped_column(String(80), nullable=False)
    export_format: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="queued", nullable=False)
    result_file: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class BackupRecord(Base):
    __tablename__ = "backup_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    created_by_user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    backup_type: Mapped[str] = mapped_column(String(80), nullable=False)
    file_path: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="created", nullable=False)
    backup_metadata: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)