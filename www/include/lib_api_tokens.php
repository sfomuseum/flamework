<?php

	# THIS IS NOT READY FOR PRODUCTION. NO.

	#################################################################

	function api_tokens_refreshSiteToken(){

		$crumb_key = $GLOBALS["cfg"]["api_oauth2_token_refresh_crumb_key"];
		$crumb_target = $GLOBALS["cfg"]["api_oauth2_token_refresh_crumb_target"];
		$crumb_ttl = $GLOBALS['cfg']['api_oauth2_token_refresh_crumb_ttl'];

		$check_ok = crumb_check($crumb_key, $crumb_ttl, $crumb_target);

		if (! $check_ok){
			api_output_error(495);
		}

		# so basically we want to assume all the checks in lib_api_auth_oauth2
		# but _not_ trigger and error if the token has expired or has only expired
		# within a given window but the open question is how/where to define
		# all of that stuff... like config flags on the method spec and updates to
		# lib_api_auth_oauth2.php or... ? (20190319/thisisaaronland)
		# 
		# $token_row['expires']) && ($token_row['expires'] < time()
		#
		# given everything above it is assumed that we are requiring a crumb in the
		# method config and this has already been checked by the main auth/dispatch
		# layer
 
		$user = $GLOBALS["cfg"]["user"];

		$token_row = api_oauth2_access_tokens_fetch_site_token($GLOBALS['cfg']['user']);
		$access_token = $token_row['access_token'];
		$expires = $token_row["expires"];

		# this will need to be done in init.php too...

		$crumb = crumb_generate($crumb_key, $crumb_target);

		$out = array(
			"access_token" => $access_token,
			"expires" => $expires,
			"crumb" => $crumb,
		);

		api_output_ok($out);
	}

	#################################################################

	# the end