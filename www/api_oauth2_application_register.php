<?php

	include("include/init.php");
	loadlib("api_keys");
	loadlib("api_keys_utils");

	features_ensure_enabled(array(
		"api",
		"api_www",
		"api_delegated_auth",
		"api_register_keys"
	));	

	login_ensure_loggedin();

	$crumb_key = 'api_key';
	$GLOBALS['smarty']->assign("crumb_key", $crumb_key);

	$step = 1;

	if (post_isset('done') && crumb_check($crumb_key)){

		$ok = 1;

		$title = filter_strict(post_str("title"));
		$description = filter_strict(post_str("description"));
		$callback = filter_strict(post_str("callback"));

		$conf = post_str("confirm");

		if (($ok) && (! $title)){
			$GLOBALS['smarty']->assign("error", "no_title");
			$ok = 0;
		}

		else {
			$GLOBALS['smarty']->assign("title", $title);
		}

		if (($ok) && (! $description)){
			$GLOBALS['smarty']->assign("error", "no_description");
			$ok = 0;
		}

		else {
			$GLOBALS['smarty']->assign("description", $description);
		}

		if (($ok) && ($callback)){

			if (! api_keys_utils_is_valid_callback($callback)){
				$GLOBALS['smarty']->assign("error", "invalid_callback");
				$ok = 0;
			}

			else {
				$GLOBALS['smarty']->assign("callback", $callback);
			}
		}

		if ($ok){
			$step = 2;
		}

		if (($ok) && ($conf)){

			$step = 3;

			$rsp = api_keys_create($GLOBALS['cfg']['user']['id'], $title, $description, $callback);
			$GLOBALS['smarty']->assign("key_rsp", $rsp);

			if ($rsp['ok']){
				$url = "{$GLOBALS['cfg']['api_abs_root_url']}api/oauth2/applications/{$rsp['key']['api_key']}/?success=1";

				header("location: {$url}");
				exit();
			}
		}
	}

	$GLOBALS['smarty']->assign("step", $step);

	$GLOBALS['smarty']->display("page_api_oauth2_application_register.txt");
	exit();

?>
