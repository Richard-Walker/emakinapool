#!/bin/sh
# 
#
# Get distribution from share.emakina.net
#
# 	Downloads a local copy of the share page and all its dependencies
# 	If a local copy already exists, only downloads newer files 
# 	Takes the page path as argument
#
# Example: 
# 
#	$ ./getdist.sh display/activities/Pool+Championship+-+V2
#


PAGE="$1"

printf "Share login: "
read USERNAME

printf "Password: "
read -s PASSWORD

wget --save-cookies confluenceCookies.txt --keep-session-cookies -N -P dist --post-data "os_username=$USERNAME&os_password=$PASSWORD" https://share.emakina.net/dologin.action
wget --load-cookies confluenceCookies.txt -P dist -nH -N -E -H -k -K -p https://share.emakina.net/$PAGE

rm confluenceCookies.txt
