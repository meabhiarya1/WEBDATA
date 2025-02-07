
// THIS IS THE START FILE which format should be batch


// ::@echo off
// ::echo Starting backend...
// ::cd WEB_DATA_CONVERSION_BACKEND_4.0-main
// :: start cmd /k "npm start"
// :: start /b npm start
// ::start /b pm2 start server.js
// ::cd ..
// ::exit

// @echo off
// echo Starting local backend...
// cd WEB_DATA_CONVERSION_BACKEND_4.0-main
// pm2 start server.js --name "local-app" -- --port 5000
// exit

// --------------------------------------------------------------------------------------



// THIS IS THE START FILE which format should be batch

// ::@echo off
// ::echo Stopping backend...
// ::cd WEB_DATA_CONVERSION_BACKEND_4.0-main

// :: Stop the PM2 process (you might need to replace 'server' with the actual name of your PM2 process)
// ::pm2 stop server.js

// :: Optionally, delete the PM2 process (uncomment if needed)
// :: pm2 delete server

// :: You may also want to stop other processes or handle other cleanup tasks here

// ::cd ..
// ::exit

// @echo off
// echo Stopping local backend...
// cd WEB_DATA_CONVERSION_BACKEND_4.0-main
// pm2 stop "local-app"
// cd ..
// exit