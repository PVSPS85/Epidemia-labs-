import json
import asyncio
from database import supabase_admin

def seed_diseases():
    print("🚀 Starting Database Seeding...")
    with open("data/diseases_seed.json", "r") as f:
        data = json.load(f)
    
    # Using admin client to bypass RLS for initial setup
    response = supabase_admin.table("diseases").upsert(data).execute()
    print(f"✅ Successfully seeded {len(response.data)} diseases.")

if __name__ == "__main__":
    seed_diseases()