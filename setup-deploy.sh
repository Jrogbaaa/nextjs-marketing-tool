#!/bin/bash

echo "Preparing project for GitHub Pages deployment..."

# Ensure directories exist
mkdir -p src
mkdir -p public
mkdir -p public/images

# Backup the logo image if it exists
if [ -f "public/images/logo.png" ]; then
  cp public/images/logo.png /tmp/logo-backup.png
  echo "Logo image backed up."
fi

# Remove previous files if they exist
rm -rf src/*
rm -rf public/*

# Restore the logo image
mkdir -p public/images
if [ -f "/tmp/logo-backup.png" ]; then
  cp /tmp/logo-backup.png public/images/logo.png
  echo "Logo image restored."
fi

# Copy necessary files from linkedin-lead-analysis to the main project if it exists
if [ -d "linkedin-lead-analysis/src" ]; then
  echo "Copying files from linkedin-lead-analysis directory..."
  cp -r linkedin-lead-analysis/src/* src/
  
  if [ -d "linkedin-lead-analysis/public" ]; then
    cp -r linkedin-lead-analysis/public/* public/ 2>/dev/null || :
  fi

  # Remove the reference to the duplicate directory
  rm -rf linkedin-lead-analysis/src
  rm -rf linkedin-lead-analysis/public
else
  echo "linkedin-lead-analysis directory not found, skipping copy."
fi

# Make sure we don't overwrite the logo
if [ -f "/tmp/logo-backup.png" ] && [ ! -f "public/images/logo.png" ]; then
  cp /tmp/logo-backup.png public/images/logo.png
fi

# Install all dependencies
npm install

# Build the project
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build successful! You can now run: npm run deploy"
else
  echo "Build failed. Please check the errors above."
fi 