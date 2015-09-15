/* 
---------------------------------------------------------------------------------------------------

EP.VerifyDataResults

---------------------------------------------------------------------------------------------------
*/
 

var EP = EP || {};

EP.VerifyDataResults = function() {

	$('#verify-data-button').hide();

	// Only for admins
	if (_.chain(EP.Settings.admins).pluck('username').contains(EP.CurrentUser.username).value()) {
		
		$('#verify-data-button').show();

		$('#verify-data-button').click(function() {

			if (EP.Players.verify()) {
				window.alert('Verification succesful. Everything is correct.');
			} else {
				window.alert('Verification failed. Check console for details...');
			}

		});

	}

}