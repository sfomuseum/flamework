<?php

	include('include/init.php');
	header("Content-Type: text/plain");

	if ($GLOBALS["cfg"]["site_disabled"]){
		error_disabled();
		exit();
	}

	echo "PING";
	exit();