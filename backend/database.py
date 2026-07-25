from supabase import create_client, Client
from config import get_settings

settings = get_settings()

# Standard client using the public Anon Key
supabase: Client = create_client(
    settings.SUPABASE_URL, 
    settings.SUPABASE_KEY
)

# Admin client using the Service Role Key
# WARNING: This bypasses Row Level Security (RLS). Use only for protected backend operations.
supabase_admin: Client = create_client(
    settings.SUPABASE_URL, 
    settings.SUPABASE_SERVICE_KEY
)