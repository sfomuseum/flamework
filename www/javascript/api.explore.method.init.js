window.addEventListener('load', function(e){
    
    var query_el = document.querySelector("#query");
    var results_el = document.querySelector("#results");
    var request_el = document.querySelector("#api-req");
    var response_el = document.querySelector("#api-res");
    var caveat_els = document.querySelectorAll(".caveat");

	var show_query = function(){

	    if (query_el){
		query_el.style.display = "block";
	    }

	    if (results_el){
		results_el.style.display = "none";
	    }
	    
	    if (request_el){
		request_el.innerHTML = "";
	    }
	    
	    if (response_el){
		response_el.innerHTML = "";
	    }

	    var count_caveats = caveat_els.length;

	    for (var i=0; i < count_caveats; i++){
		caveat_els[i].style.display = "none";
	    }
	};

	var show_results = function(){

	    if (query_el){
		query_el.style.display = "none";
	    }

	    if (results_el){
		results_el.style.display = "block";
	    }

	    var count_caveats = caveat_els.length;

	    for (var i=0; i < count_caveats; i++){
		caveat_els[i].style.display = "block";
	    }

	};

	var show_caveat = function(){

	    // what...?

	    /*
		var sel = $(":selected");
		var perms = sel.attr("x-data-perms");

		if (perms == 2){
			$("#caveat-write").show();
		}

		else {
			$("#caveat-code").show();			
		}
	    */
	};

    var again_el = document.querySelector("#do-it-again");

    again_el.onclick = function(){
		show_query();
		return false;
    };

    var explore_el = document.querySelector("#explore");

    explore_el.onclick = function(){

	var form_el = document.querySelector("#explore-form");
	
	var api_method = form_el.getAttribute("x-data-method");
	var http_method = form_el.getAttribute("x-http-method");
	
	var req_args = {
	    'method': api_method,
	};
	
	var form_data = new FormData(form_el);

	for (var pair of form_data.entries()) {

	    var key = pair[0];
	    var value = pair[1];

	    if (! value){
		continue;
	    }

	    req_args[key] = value;
	}

	var endpoint = ""; //flamework.api.endpoint();
	
	var req = "curl -X " + http_method;
	req += " ";
	
	if (http_method == 'GET'){
	    
	    var q = new Array();
	    
	    for (k in req_args){
		q.push(k + "=" + req_args[k]);
	    }
	    
	    req += "'";
	    req += endpoint;
	    req += "?" + q.join("&");
	    req += "'";
	}
	
	else {
	    
	    var q = new Array();
	    
	    for (k in req_args){
		q.push("-F " + k + "=" + req_args[k]);
	    }
	    
	    req += q.join(" ");
	    req += " ";
	    req += endpoint;
	}
	
	request_el.innerHTML = htmlspecialchars(req);
	
	var on_success = function(rsp){
	    
	    var json = JSON.stringify(rsp, null, '\t');
	    var html = htmlspecialchars(json);

	    response_el.innerHTML = html;
	    
	    show_results();
	    show_caveat();
	};
	
	var on_error = function(rsp){

	    var json = JSON.stringify(rsp, null, '\t');
	    var html = htmlspecialchars(json);
	    
	    response_el.innerHTML = html;
	    
	    show_results();
	    show_caveat();
	};

	console.log("DO", http_method, api_method, req_args);
	
	flamework.api.do(http_method, api_method, req_args).then((rsp) => {
	    on_success(rsp);
	}).catch((err) => {
	    // alert("There was a problem calling the API");
	    console.error(err);
	    on_error(err);
	});

	return false;
    };
			
    // for pre-filling example params
			
    var examples = document.getElementsByClassName("example");
    var count = examples.length;
    
    for (var i=0; i < count; i++){
	
	var ex = examples[i];
	
	ex.onclick = function(e){
	    var el = e.target;
	    var param = el.getAttribute("data-q");
	    var txt = el.innerText;
	    var input = document.getElementById("q-" + param);
	    input.value = txt;
	};
    }

});
