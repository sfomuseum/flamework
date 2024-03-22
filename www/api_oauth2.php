<?php

	include("include/init.php");

	features_ensure_enabled(array(
		"api",
		"api_www",
	));

	if ($GLOBALS['cfg']['api_require_loggedin']){
		login_ensure_loggedin();
	}

	$GLOBALS['smarty']->display("page_api_oauth2.txt");
	exit();

?>
