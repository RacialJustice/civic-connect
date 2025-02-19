#!/bin/bash

echo "Stopping any existing Supabase containers..."
supabase stop || true

echo "Cleaning up Docker containers..."
docker rm -f $(docker ps -a -q --filter name=supabase_*) 2>/dev/null || true

echo "Removing Supabase volumes..."
docker volume rm $(docker volume ls -q --filter name=supabase_*) 2>/dev/null || true

echo "Initializing fresh Supabase project..."
supabase init

echo "Starting Supabase services..."
supabase start

echo "Linking to remote project..."
supabase link --project-ref toeqcwzbxvhoxewifusk -p "$SUPABASE_DB_PASSWORD"

echo "Checking status..."
supabase status
