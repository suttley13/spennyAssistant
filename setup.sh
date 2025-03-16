#!/bin/bash

# Print colorful messages
print_message() {
  echo -e "\033[1;34m>> $1\033[0m"
}

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "Error: npm is not installed. Please install Node.js and npm first."
  exit 1
fi

# Install root dependencies
print_message "Installing root dependencies..."
npm install

# Install client dependencies
print_message "Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies
print_message "Installing server dependencies..."
cd server
npm install
cd ..

# Create environment files
print_message "Setting up environment files..."
if [ ! -f "./client/.env" ]; then
  cp ./client/.env.example ./client/.env
  print_message "Created client/.env from example"
fi

if [ ! -f "./server/.env" ]; then
  cp ./server/.env.example ./server/.env
  print_message "Created server/.env from example"
  echo -e "\033[1;33mDon't forget to add your Claude API key to server/.env\033[0m"
fi

print_message "Setup complete! Run 'npm run dev' to start the application." 