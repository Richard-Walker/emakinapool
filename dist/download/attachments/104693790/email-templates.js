this["JST"] = this["JST"] || {};

this["JST"]["hookedupMail"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '\n<email>\n\t<subject>\n\t\t' +((__t = (stageName)) == null ? '' : __t) +' is available for pool\n\t</subject>\n\t<message>\n\t\t<table class="body" style="border-spacing: 0px; width: 100%; height: 100%; background-color: #eaeced; padding: 50px 0px; margin: 0px;"><tbody><tr><td valign="top" style="padding: 0px;">\n\t\t\t<table class="main" align="center" style="border-spacing: 0px; width: 580px; background-color: #fff;"><tbody>\n\t\t\t\t<tr>\n\t\t\t\t\t<td style="padding: 0px;">\n\t\t\t\t\t\t<img width="580" height="290" src="https://dl.dropboxusercontent.com/u/14573395/emakinapool/hooked-up-banner.jpg">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class="content" style="text-align: center; font-family: \'Open Sans\', arial, sans-serif; font-size: 16px; line-height: 30px; font-weight: 400; color: #7e8890; padding: 40px;">\n\t\t\t\t\t\t<h1 style="font-size: 28px; line-height: 38px; font-weight: 200; color: #252b33; margin-top: 25px; margin-bottom: 25px;">You\'ve got yourself a game&nbsp;!</h1>\n\t\t\t\t\t\t<p style="text-align: center; font-family: \'Open Sans\', arial, sans-serif; font-size: 16px; line-height: 30px; font-weight: 400; color: #7e8890;">\n\t\t\t\t\t\t\t' +((__t = (firstName)) == null ? '' : __t) +' "' +((__t = (stageName)) == null ? '' : __t) +'" ' +((__t = (lastName)) == null ? '' : __t) +' is up to a game with you,<br>meet him/her at the pool table.\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<p style="text-align: center; font-family: \'Open Sans\', arial, sans-serif; font-size: 16px; line-height: 30px; font-weight: 400; color: #7e8890;">\n\t\t\t\t\t\t\tShall you need to get in touch, ' +((__t = (firstName)) == null ? '' : __t) +'\'s email is\n\t\t\t\t\t\t\t<a href="mailto:' +((__t = (stageName)) == null ? '' : __t) +' <' +((__t = (email)) == null ? '' : __t) +'>" style="white-space: nowrap; text-decoration: none; color: #3572b0; font-weight: bold;">' +((__t = (email)) == null ? '' : __t) +'</a>\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</tbody></table>\n\t\t</td></tr></tbody></table>\n\t</message>\n</email>';}return __p};

this["JST"]["invitationMail"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {__p += '\n<email>\n\t<subject>\n\t\tEmakina Pool Invitation\n\t</subject>\n\t<message>\n\t\t<table class="body" style="border-spacing: 0px; width: 100%; height: 100%; background-color: #eaeced; padding: 50px 0px; margin: 0px;"><tbody><tr><td valign="top" style="padding: 0px;">\n\t\t\t<table class="main" align="center" style="border-spacing: 0px; width: 580px; background-color: #fff;"><tbody>\n\t\t\t\t<tr>\n\t\t\t\t\t<td style="padding: 0px;">\n\t\t\t\t\t\t<img width="580" height="290" src="https://dl.dropboxusercontent.com/u/14573395/emakinapool/invite-banner.jpeg">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class="content" style="text-align: center; font-family: \'Open Sans\', arial, sans-serif; font-size: 16px; line-height: 30px; font-weight: 400; color: #7e8890; padding: 40px;">\n\t\t\t\t\t\t<h1 style="font-size: 28px; line-height: 38px; font-weight: 200; color: #252b33; margin-top: 25px; margin-bottom: 25px;">Invitation</h1>\n\t\t\t\t\t\t<p style="text-align: center; font-family: \'Open Sans\', arial, sans-serif; font-size: 16px; line-height: 30px; font-weight: 400; color: #7e8890;">\n\t\t\t\t\t\t\tHi ' +((__t = (invitee)) == null ? '' : __t) +',\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<p style="text-align: center; font-family: \'Open Sans\', arial, sans-serif; font-size: 16px; line-height: 30px; font-weight: 400; color: #7e8890;">\n\t\t\t\t\t\t\t' +((__t = (referer.fullName())) == null ? '' : __t) +' -- also known as <strong>' +((__t = (referer.stageName)) == null ? '' : __t) +'</strong> -- thinks you might be intereseted in joining <a href="' +((__t = (url)) == null ? '' : __t) +'" style="white-space: nowrap; text-decoration: none; color: #3572b0; font-weight: bold;">the EMAKINA POOL LEAGUE</a>.\n\t\t\t\t\t\t</p>\n\t\t \t\t\t\t';if (message !== '') {;__p += '\n\t\t\t\t\t\t<p style="text-align: center; font-family: \'Open Sans\', arial, sans-serif; font-size: 16px; line-height: 30px; font-weight: 400; color: #7e8890;">\n\t\t\t\t\t\t\tHe/she says:\n\t\t\t\t\t\t\t<blockquote style="font-style: italic; font-size: 22px; font-weight: 200;">\n\t\t\t\t\t\t\t\t<span class="quotes" style="font-weight: bold; color: #3572b0;">&ldquo;&nbsp;</span>' +((__t = (message.replace(/[\r\n]/g, '<br>\n'))) == null ? '' : __t) +'<span class="quotes" style="font-weight: bold; color: #3572b0;">&nbsp;&rdquo;</span>\n\t\t\t\t\t\t\t</blockquote>\n\t\t\t\t\t\t</p>\n\t\t \t\t\t\t';};__p += '\n\t\t\t\t\t\t<p style="text-align: center; font-family: \'Open Sans\', arial, sans-serif; font-size: 16px; line-height: 30px; font-weight: 400; color: #7e8890;">\n\t\t\t\t\t\t\t<a class="button" href="' +((__t = (url)) == null ? '' : __t) +'" style="white-space: nowrap; margin-bottom: 25px; color: #ffffff; font-weight: 400; background-color: #3572b0; padding: 14px 28px 14px 28px; -webkit-border-radius: 3px; border-radius: 3px; letter-spacing: 0.125em; text-decoration: none; font-size: 13px; font-family: \'Open Sans\', Arial, sans-serif; display: inline-block; margin-top: 25px; -webkit-text-size-adjust: none; mso-hide: all; text-transform: uppercase; line-height: 18px;">Check it out!</a>\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</tbody></table>\n\t\t</td></tr></tbody></table>\n\t</message>\n</email>';}return __p};