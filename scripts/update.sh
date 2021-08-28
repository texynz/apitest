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

checkProjectFile() {
  # Check project zip exists
  if [[ ! -e ./project.zip ]]; then
    echoError "> Project zip is missing!"
    echoError "> Please name your project zip file: \"project.zip\""
    echoError "> Then run this file again"
    pause
    exit 1
  fi
  echoSuccess "> Found project"
}

checkYarnVersion() {
  echoAction "> Checking yarn v1.x.x is installed"
  YARN_VERSION="$(yarn --version || echo "")"
  # Check yarn matches 1.x.x
  if [[ ! $YARN_VERSION =~ ^1\.[0-9]+\.[0-9]+$ ]]; then
    echoError "> Yarn v1.x.x is missing!"
    echoError "> Please install Yarn v1.x.x"
    echoError "> See: https://classic.yarnpkg.com/lang/en/"
    return 1
  fi
  echoSuccess "> Found yarn"
  return 0
}

useYarn() {
  checkYarnVersion
  if [[ $? -eq 1 ]]; then
    return 1
  fi

  echoAction "> Installing dependencies"
  # Install dependencies
  yarn install
  # Check the project
  checkProjectFile
  # Update the project
  echoAction "> Updating project"
  node ./packages/ada install project.zip
  echoAction "> Updating dependencies"
  yarn install
  return 0
}

checkNpmVersion() {
  echoAction "> Checking npm v7 is installed"
  NPM_VERSION="$(npm --version || echo "")"
  # Check npm matches 7.x.x
  if [[ ! $NPM_VERSION =~ ^[7-9]\.[0-9]+\.[0-9]+$ ]]; then
    echoError "> NPM v7.x.x is missing!"
    echoError "> Please install npm v7.x.x"
    echoError "> See: npm install -g npm@latest"
    return 1
  fi
  echoSuccess "> Found npm"
  return 0
}

useNpm() {
  checkNpmVersion
  if [[ $? -eq 1 ]]; then
    return 1
  fi
  echoAction "> Installing dependencies"
  # Install dependencies
  npm install
  # Check the project
  checkProjectFile
  # Update the project
  echoAction "> Updating project"
  node ./packages/ada install project.zip
  echoAction "> Updating dependencies"
  npm install
  return 0
}

#------------ Run ------------#

if [[ -e ./yarn.lock ]]; then
  # Check for yarn.lock file, if found assume yarn project
  echoAction "> Found yarn.lock, assuming yarn based project"
  useYarn
else
  # Try npm, then fall back to yarn
  useNpm
  if [[ $? -eq 1 ]]; then
    echoAction "> Falling back to yarn"
    useYarn
  fi
fi
if [[ $? -eq 0 ]]; then
  echoSuccess "> success!"
fi
pause
