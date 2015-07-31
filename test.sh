#!/bin/sh

# curl -D- -u rwa:Trustevery1 -X POST -H "X-Atlassian-Token: nocheck" -F "file=@badge_Apprentice.png" -F "comment=updated via rest test" -F "minorEdit=false" https://share.emakina.net/rest/api/content/102665363/child/attachment/att102665367/data

curl -D- -u rwa:Trustevery1 -X POST -H "X-Atlassian-Token: nocheck" -F "file=@badge_Test.png"       -F "comment=added via rest"        -F "minorEdit=false" https://share.emakina.net/rest/api/content/102665363/child/attachment

# https://share.emakina.net/rest/searchv3/1.0/search?queryString=badge_Apprentice.png&type=attachment
# https://share.emakina.net/rest/api/content/102665363/child/attachment