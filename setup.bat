@echo off
echo [34m>> Installing root dependencies...[0m
call npm install

echo [34m>> Installing client dependencies...[0m
cd client
call npm install
cd ..

echo [34m>> Installing server dependencies...[0m
cd server
call npm install
cd ..

echo [34m>> Setting up environment files...[0m
if not exist "client\.env" (
  copy client\.env.example client\.env
  echo [34m>> Created client/.env from example[0m
)

if not exist "server\.env" (
  copy server\.env.example server\.env
  echo [34m>> Created server/.env from example[0m
  echo [33mDon't forget to add your Claude API key to server/.env[0m
)

echo [34m>> Setup complete! Run 'npm run dev' to start the application.[0m 