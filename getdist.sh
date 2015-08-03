#!/bin/sh
# 
#
# Get distribution from share.emakina.net
#
# 	Downloads a local copy of the share page and all its dependencies
# 	If a local copy already exists, only downloads newer files 
# 	
# Argument: the page path
#
# Options: 
#   -c <cookieFile> : use specific cookie file
#   -r : rebuild from scratch (remove folder beforehand)
#
# Example: 
# 
#	$ ./getdist.sh -c myCookieFile.txt display/activities/Pool+Championship+-+V2
#



# Get command line parameters

cookieFile=""

while getopts rc: name
do
	case $name in
		c ) cookieFile=$OPTARG;;
		r ) rebuild=1;;
		* ) echo "Invalid arg";;
	esac
done

shift $(($OPTIND -1))

page=$1



# Authentication and cookies

if [[ -f $cookieFile ]]; then
	cp $cookieFile confluenceCookies.txt
fi

if [[ ! -f confluenceCookies.txt ]]; then
	echo "Share login: "
	read username
	echo "Password: "
	read -s password
	wget --save-cookies confluenceCookies.txt --keep-session-cookies -N -P dist --post-data "os_username=$username&os_password=$password&os_cookie=true" https://share.emakina.net/dologin.action
fi


# Remove folder if option -r is set

if [[ ! -z $rebuild ]]; then
	rm -rf ./dist/*
fi



# Download page and all dependencies

wget --load-cookies confluenceCookies.txt -P dist -nH -N -E -H -k -K -p https://share.emakina.net/$page

