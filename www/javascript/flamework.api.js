var flamework = flamework || {};

/*

  api = new flamework.api();
  api.set_handler('endpoint', lampzen.api.endpoint);
  api.set_handler('accesstoken', lampzen.api.accesstoken);

*/

flamework.api = function(){

    var null_handler = function(){
	return undefined;
    };

    var self = {

	'_handlers': {
	    'endpoint': null_handler,
	    'authentication': null_handler,
	},

	'set_handler': function(target, handler){

	    if (! self._handlers[target]){
		console.log("MISSING... " + target);
		return false;
	    }

	    if (typeof(handler) != "function"){
		console.log(target + " IS NOT A FUNCTION");
		return false;
	    }

	    self._handlers[target] = handler;
	},

	'get_handler': function(target){

	    if (! self._handlers[target]){
		return false;
	    }

	    return self._handlers[target];
	},

	'call': function(flamework_method, data, on_success, on_error){
	    console.log("The 'call' method is DEPRECATED, please use 'do' instead.");
	    return self.do('POST', flamework_method, data, on_success, on_error);
	},

	// https://developer.mozilla.org/en-US/docs/Web/API/FormData
	// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
	
	'do': function(http_method, flamework_method, data, on_success, on_error){
    
	    var dothis_onsuccess = function(rsp){

		if (on_success){
		    on_success(rsp);
		}
	    };
	    
	    var dothis_onerror = function(rsp){
			
		if (on_error){
		    on_error(rsp);
		}
	    };

	    var get_endpoint = self.get_handler('endpoint');

	    if (! get_endpoint){
		dothis_onerror(self.destruct("Missing endpoint handler"));
		return false
	    }

	    endpoint = get_endpoint();

	    if (! endpoint){
		dothis_onerror(self.destruct("Endpoint handler returns no endpoint!"));
		return false
	    }

	    var params = data;

	    if (! params.append){

		params = new URLSearchParams();
		
		for (key in data){
		    params.append(key, data[key]);
		}
	    }

	    params.append('method', flamework_method);
		
	    var set_auth = self.get_handler('authentication');

	    if (set_auth){
		params = set_auth(params);
	    }

	    var onload = function(rsp){

		var target = rsp.target;

		if (target.readyState != 4){
		    return;
		}

		var status_code = target['status'];
		var status_text = target['statusText'];
		
		var raw = target['responseText'];
		var data = undefined;

		try {
		    data = JSON.parse(raw);
		}

		catch (e){
		    dothis_onerror(self.destruct("failed to parse JSON " + e));
		    return false;
		}

		if (data['stat'] != 'ok'){
		    dothis_onerror(data);
		    return false;
		}

		dothis_onsuccess(data);
		return true;
	    };
	    
	    var onprogress = function(rsp){
		// console.log("progress");
	    };

	    var onfailed = function(rsp){

		dothis_onerror(self.destruct("connection failed " + rsp));
	    };

	    var onabort = function(rsp){

		dothis_onerror(self.destruct("connection aborted " + rsp));
	    };

	    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data

	    try {

		var req = new XMLHttpRequest();

		req.addEventListener("load", onload);
		req.addEventListener("progress", onprogress);
		req.addEventListener("error", onfailed);
		req.addEventListener("abort", onabort);

		switch (http_method){
		case "POST":
		    req.open(http_method, endpoint, true);
		    req.send(params);
		    break;
		case "PUT":
		    // 
		default:
		    endpoint = endpoint + "?" + params.toString();
		    req.open(http_method, endpoint, true);
		    req.send(null);
		    break;
		}
		
	    } catch (e) {
		
		dothis_onerror(self.destruct("failed to send request, because " + e));
		return false;
	    }

	    return false;
	},

	'call_paginated': function(method, data, on_page, on_error, on_complete){
	    console.log("The 'call_paginated' method is DEPRECATED, please use 'do_paginated' instead.");
	    return self.do_paginatated('POST', flamework_method, data, on_page, on_error, on_complete);
	},
	
	'do_paginated': function(http_method, flamework_method, data, on_page, on_error, on_complete){

	    var results = [];
	    
	    var dothis_oncomplete = function(rsp) {
		
		results.push(rsp);
		
		if (on_page) {
		    on_page(rsp);
		}
		
		// TO DO: Update to use https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

		if (rsp.next_query) {
		    
		    var args = rsp.next_query.split('&');
		    
		    for (var i = 0; i < args.length; i++) {
			var arg = args[i].split('=');
			var key = decodeURIComponent(arg[0]);
			var value = decodeURIComponent(arg[1]);
			data[key] = value;
		    }
		    
		    self.do(http_method, flamework_method, data, dothis_oncomplete, on_error);
		    
		}  else if (on_complete) {
		    on_complete(results);
		}
	    };
	    
	    self.do(http_method, flamework_method, data, dothis_oncomplete, on_error);
	},

	'destruct': function(msg){

	    return {
		'stat': 'error',
		'error': {
		    'code': 999,
		    'message': msg
		}
	    };

	},

	'encode_query': function(query){
	    
	    enc = new Array();
	    
	    for (var k in query){
		var v = query[k];
		v = encodeURIComponent(v);
		enc.push(k + "=" + v);
	    }
	    
	    return enc.join("&");
	},

    }

    return self;

};
