from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message text content")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User financial query")
    history: Optional[List[ChatMessage]] = Field(default=None, description="Previous conversation messages")
    stream: bool = Field(default=False, description="Whether to stream response tokens via SSE")
    locale: Optional[str] = Field(default="en", description="Preferred language code ('en' or 'hi')")

class BotComponent(BaseModel):
    type: str = Field(..., description="React component type identifier, e.g. 'BudgetDonut', 'EmiCalculatorCard', 'InlineForm', etc.")
    props: Dict[str, Any] = Field(default_factory=dict, description="Typed props passed directly into the React component")

class ExtractedEntities(BaseModel):
    amount: Optional[float] = Field(default=None, description="Extracted principal / goal / debt / investment amount in INR")
    rate: Optional[float] = Field(default=None, description="Extracted interest or return rate in % p.a.")
    tenure: Optional[float] = Field(default=None, description="Extracted tenure or time horizon in years")
    income: Optional[float] = Field(default=None, description="Extracted monthly or annual income in INR")

class GlossaryItem(BaseModel):
    term: str = Field(..., description="Term abbreviation (e.g. 'EMI', 'SIP', 'FD')")
    full_form: str = Field(..., description="Full expanded name of the term")
    hindi_term: Optional[str] = Field(default=None, description="Hindi translation or equivalent term")
    definition: str = Field(..., description="Educational explanation in user's language")
    locale: str = Field(default="en", description="Language of definition ('en' or 'hi')")

class IntentClassification(BaseModel):
    intent: str = Field(..., description="One of: 'budget', 'loan', 'savings', 'investment', 'planning', 'debt', 'out-of-scope'")
    confidence: float = Field(default=1.0, description="Confidence score between 0.0 and 1.0")
    language: str = Field(default="en", description="Detected language ('en' or 'hi')")
    entities: ExtractedEntities = Field(default_factory=ExtractedEntities)
    missing_entities: List[str] = Field(default_factory=list, description="Required entities for this intent that were missing")
    terms_to_define: List[str] = Field(default_factory=list, description="Financial terms to include in the glossary")

class BotResponse(BaseModel):
    text: str = Field(..., description="Assistant response text (supports Markdown)")
    components: List[BotComponent] = Field(default_factory=list, description="Array of rich UI components to render")
    chips: List[str] = Field(default_factory=list, description="Suggested follow-up query chips")
    assumptions: List[str] = Field(default_factory=list, description="Key modeling assumptions for transparency")
    formula: Optional[str] = Field(default=None, description="Exact mathematical formula string for 'Why this answer?' panel")
    intent: Optional[str] = Field(default=None, description="Classified user intent")
    language: Optional[str] = Field(default="en", description="Response language ('en' or 'hi')")
    glossary: Optional[List[GlossaryItem]] = Field(default_factory=list, description="Educational definitions of financial terms")
