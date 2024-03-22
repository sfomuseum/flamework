<?php

	# HEY LOOK - THIS IS ACTUALLY RUNNING CODE

	$config_host = get_current_host();

	$global_config = FLAMEWORK_INCLUDE_DIR . "config_flamework.php";
	$global_secrets = FLAMEWORK_INCLUDE_DIR . "secrets.php";

	$local_config = FLAMEWORK_INCLUDE_DIR . "config_local.php";
	$local_secrets = FLAMEWORK_INCLUDE_DIR . "secrets_local.php";

	$host_config = FLAMEWORK_INCLUDE_DIR . "config_local_{$config_host}.php";
	$host_secrets = FLAMEWORK_INCLUDE_DIR . "secrets_local_{$config_host}.php";

	$config_files[] = $global_config;

	$to_check = array(
		# $global_config is explicitly added above
		$local_config, $host_config,
		$global_secrets,
		$local_secrets, $host_secrets
	);


	foreach ($to_check as $path){

		if (file_exists($path)){
			$config_files[] = $path;
		}
	}


	foreach ($config_files as $path){

		# echo "load {$path} <br />";

		$start = microtime_ms();
		include($path);

		$end = microtime_ms();
		$time = $end - $start;

		$GLOBALS['timings']['config_count'] += 1;
		$GLOBALS['timings']['config_time'] += $time;
	}

	# 