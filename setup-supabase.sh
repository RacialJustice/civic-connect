#!/bin/bash

echo "Cleaning up existing supabase folder..."
rm -rf supabase

echo "Initializing Supabase..."
supabase init

echo "Linking to Supabase project..."
supabase link --project-ref toeqcwzbxvhoxewifusk

echo "Pushing database changes..."
npm run db:push
