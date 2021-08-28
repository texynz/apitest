#!/usr/bin/env bash

#------------ Setup ------------#
# create an .ada directory
mkdir -p .ada
# copy the update script into .ada
cp ./scripts/update.sh .ada/update.sh
# make update.sh executable, Mac and Linux
chmod 775 .ada/update.sh
# execute the update script
exec .ada/update.sh
