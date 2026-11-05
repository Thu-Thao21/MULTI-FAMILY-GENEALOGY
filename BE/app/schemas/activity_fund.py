"""Schemas for Module C05: Activity & Fund Controller & Model.
Theo chuẩn MFGMS-AI Module View (MVC).
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class NotificationResponse(BaseModel):
    id: uuid.UUID
    recipient_user_id: uuid.UUID
    family_id: Optional[uuid.UUID] = None
    title: str
    body: str
    type: str = "INFO"
    link: Optional[str] = None
    is_read: bool = False
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationMarkReadRequest(BaseModel):
    notification_ids: List[uuid.UUID]


class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    activity_type: str = "COMMUNITY"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    activity_type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None


class ActivityResponse(ActivityBase):
    id: uuid.UUID
    family_id: uuid.UUID
    created_by: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class FundBase(BaseModel):
    name: str
    description: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: float = 0.0
    is_active: bool = True


class FundCreate(FundBase):
    pass


class FundResponse(FundBase):
    id: uuid.UUID
    family_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DonationCreate(BaseModel):
    fund_id: uuid.UUID
    donor_name: str
    amount: float = Field(gt=0)
    note: Optional[str] = None
    donated_at: Optional[datetime] = None


class DonationResponse(BaseModel):
    id: uuid.UUID
    fund_id: uuid.UUID
    donor_name: str
    amount: float
    note: Optional[str] = None
    donated_at: datetime

    model_config = ConfigDict(from_attributes=True)
