#!/bin/bash

set -e # Exit on error

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Verify token exists
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "Error: SUPABASE_ACCESS_TOKEN not found in .env"
    exit 1
fi

# Verify token format
if [[ ! "$SUPABASE_ACCESS_TOKEN" =~ ^sbp_ ]]; then
    echo "Error: SUPABASE_ACCESS_TOKEN must start with 'sbp_'"
    exit 1
fi

# Function to check Docker status
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "Docker is not running. Starting Docker..."
        open -a Docker
        echo "Waiting for Docker to start..."
        sleep 30
        
        # Verify Docker is running
        if ! docker info > /dev/null 2>&1; then
            echo "Error: Docker failed to start. Please start Docker Desktop manually."
            exit 1
        fi
    fi
}

# Fix Supabase CLI
fix_supabase_cli() {
    echo "Fixing Supabase CLI installation..."
    rm -f '/usr/local/bin/supabase'
    brew link --overwrite supabase
    brew upgrade supabase
}

# Main script
echo "Setting up Supabase project..."

# Fix Supabase CLI first
fix_supabase_cli

# Check Docker status
check_docker

# Initialize Supabase
echo "Initializing Supabase..."
supabase init --force

# Link project
echo "Linking project..."
supabase link --project-ref "$SUPABASE_PROJECT_ID" -p "$SUPABASE_DB_PASSWORD"

# Start Supabase
echo "Starting Supabase services..."
supabase start

# Final status check
echo "Checking status..."
supabase status
