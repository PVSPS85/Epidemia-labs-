
Copy

from supabase import create_client, Client
from config import get_settings
 
settings = get_settings()
 
# Public client — used for normal read/write operations
supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_anon_key,
)
 
# Service client — bypasses Row Level Security (use carefully)
supabase_admin: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_key,
)
 
 
def get_db() -> Client:
    """Return the public Supabase client."""
    return supabase
 
 
def get_admin_db() -> Client:
    """Return the admin Supabase client (bypasses RLS)."""
    return supabase_admin
