#!/usr/bin/env bash

#------------ Setup ------------#
function pause() {
  read -s -n 1 -p "Press any key to continue . . ."
  echo ""
}
# Action
echoAction() {
  echo "[96m$1[0m"
}
# Success
echoSuccess() {
  echo "[92m$1[0m"
}
# Error
echoError() {
  echo "[91m$1[0m"
}

checkDockerVersion() {
  # Find docker version
  echoAction "> Checking docker is installed"
  DOCKER_VERSION="$(docker --version || echo "")"
  # Check docker
  if [[ -z $DOCKER_VERSION ]]; then
    echoError "> Docker is missing!"
    echoError "> Please install Docker"
    echoError "> See: https://www.docker.com/get-started"
    return 1
  fi
  echoSuccess "> Found Docker"
  return 0
}

startServers() {
  echoAction "> Starting server (defaults to http://localhost:3000)"
  # Install dependencies
  npm run dev
}

#------------ Run ------------#

checkDockerVersion
if [[ $? -eq 1 ]]; then
  pause
  exit 1
fi
startServers
pause
