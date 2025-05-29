var flamework = flamework || {};

/*

  flamework.api.set_handler('endpoint', function(){ ... });
  flamework.api.set_handler('accesstoken', function(){ ... });

*/

flamework.api = (function(){

    var null_handler = function(){
	return undefined;
    };

    var self = {

	'_handlers': {
	    'endpoint': function(){
		var u = new URL(location.origin);
		u.pathname = "/api/rest/";
		return u.toString();
	    },
	},

	'set_handler': function(target, handler){

	    if (! self._handlers[target]){
		console.error("Invalid target");
		return false;
	    }

	    if (typeof(handler) != "function"){
		console.error(target + " handler is not a function");
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

	// https://developer.mozilla.org/en-US/docs/Web/API/FormData
	// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
	
	'do': function(http_method, flamework_method, data){

	    return new Promise((resolve, reject) => {
		
		const get_endpoint = self.get_handler('endpoint');
		
		if (! get_endpoint){
		    reject(self.destruct("Missing endpoint handler"));
		    return false
		}
		
		var endpoint = get_endpoint();
		
		if (! endpoint){
		    reject(self.destruct("Endpoint handler returns no endpoint!"));
		    return false;
		}
		
		var params = data;

		if (! params.append){
		    
		    params = new URLSearchParams();
		    
		    for (key in data){
			params.append(key, data[key]);
		    }
		}
		
		params.append('method', flamework_method);

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
			reject(self.destruct("failed to parse JSON " + e));
			return false;
		    }
		    
		    if (data['stat'] != 'ok'){
			reject(data);
			return false;
		    }

		    resolve(data);
		    return true;
		};
	    
		var onprogress = function(rsp){
		    // console.log("progress");
		};
		
		var onfailed = function(rsp){
		    reject(self.destruct("connection failed " + rsp));
		};
		
		var onabort = function(rsp){
		    reject(self.destruct("connection aborted " + rsp));
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
		    
		    reject(self.destruct("failed to send request, because " + e));
		    return false;
		}
	    });

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
	    
	    self.do(http_method, flamework_method, data).then((rsp) => {
		dothis_oncomplete(rsp);
	    }).catch((err) => {
		on_error(err);
	    });
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

})();
