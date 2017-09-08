// Licensed Materials - Property of IBM
// (C) Copyright IBM Corp. 2017. All Rights Reserved.
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

// This file contains code to make up fake traces, for UI testing


function randomize() {
	traces = [{
		trace_id: Math.random().toString(36).substring(7),
		request: "GET /" + Math.random().toString(36).substring(7),
		timelines: randomTimelines(2, 10)
	}];
	var maxtime = Math.random() * 50000;
	var parent_span_id = Math.random().toString(36).substring(7)
	
	var baseline = 0;
	var nSpans = 3;			// max # of spans to synthesize
	for (var i = Math.ceil(Math.random() * nSpans); i > 0; i--) {
		var dur = addRandomRequestResponse(
				traces[0], 
				traces[0].timelines[0].service, 
				randomService(traces[0], traces[0].timelines[0].service), 
				baseline, maxtime,
				parent_span_id);
		baseline = baseline + dur;
	}
	
	ntrace = 0;
	showTrace(ntrace);
}

function randomService(trace, serviceToExclude) {
	for (;;) {
		var candidate = trace.timelines[Math.floor(Math.random() * trace.timelines.length)].service;
		if (candidate != serviceToExclude) {
			// console.log("randomService returning " + candidate + " which is not " + serviceToExclude);
			return candidate;
		}
	}
}

function randomTimelines(minProcesses, maxProcesses) {
	var services = [];
	for (var count = Math.floor(Math.random() * (maxProcesses - minProcesses + 1) + minProcesses); count > 0; count--) {
		services.push(Math.random().toString(36).substring(7));
	}
	
	var retval = services.map(function (name) { return { service: name, events: [] }; });
	
	// Typical work is send_request/process_request/send_response/process_response
	// Sometimes one times out
	
	return retval;
}

function addRandomRequestResponse(trace, source, dest, start, complete, parent_span_id) {
	if (source == dest) {
		throw new Error("addRandomRequestReponse() cannot handle source==dest: " + source + "==" + dest);
	}
	
	var processDur = Math.floor(Math.random() * complete);
	var processResponseDur = Math.floor(Math.random() * (complete - processDur));
	var requestDur = Math.floor(Math.random() * (complete - processDur - processResponseDur));
	var responseDur = complete - processDur - processResponseDur - requestDur;
	
	var sourceTimeline = getServiceTimeline(trace, source).events;
	var destTimeline = getServiceTimeline(trace, dest).events;
	
	var span_id = Math.random().toString(36).substring(7)
	var request = randomHttpMethod() + " /" + Math.random().toString(36).substring(7);
	var requestSize = Math.floor(Math.random() * 10000);
	var responseSize = Math.floor(Math.random() * 1000);
	var responseCode = randomHttpCode();
	
	var makesOutgoingCall = Math.random() > 0.5;
	
	sourceTimeline.push({
        span_id: span_id,
        parent_span_id: parent_span_id,
        type: "send_request",
        interlocutor: dest,
        timestamp: start,
        duration: requestDur,
        request: request,
        request_size: requestSize,
        protocol: "HTTP/1.1",
        response_size: responseSize,
        response_code: responseCode,
        user_agent: "grpc-go/1.3.0",
        timeout: null
	});
	
	if (!makesOutgoingCall) {
		destTimeline.push({
	        span_id: span_id,
	        parent_span_id: parent_span_id,
	        type: "process_request",
	        interlocutor: source,
	        timestamp: start + requestDur,
	        duration: processDur,
	        request: request,
	        request_size: requestSize,
	        protocol: "HTTP/1.1",
	        response_size: responseSize,
	        response_code: responseCode,
	        user_agent: "grpc-go/1.3.0",
	        timeout: null
		});
	} else {
		var preWorkDur = Math.floor(Math.random() * processDur / 4);
		
		destTimeline.push({
	        span_id: span_id,
	        parent_span_id: parent_span_id,
	        type: "process_request",
	        interlocutor: source,
	        timestamp: start + requestDur,
	        duration: preWorkDur,
	        request: request,
	        request_size: requestSize,
	        protocol: "HTTP/1.1",
	        response_size: responseSize,
	        response_code: responseCode,
	        user_agent: "grpc-go/1.3.0",
	        timeout: null
		});
		
		// RECURSIVE
		var newDest = randomService(trace, dest);
		addRandomRequestResponse(
				trace, 
				dest, newDest, 
				start + requestDur + preWorkDur, 
				start + requestDur + processDur - (start + requestDur + preWorkDur), 
				span_id);
	}
	
	destTimeline.push({
        span_id: span_id,
        parent_span_id: parent_span_id,
        type: "send_response",
        interlocutor: source,
        timestamp: start + requestDur + processDur,
        duration: responseDur,
        request: request,
        request_size: requestSize,
        protocol: "HTTP/1.1",
        response_size: responseSize,
        response_code: responseCode,
        user_agent: "grpc-go/1.3.0",
        timeout: null
	});
	sourceTimeline.push({
        span_id: span_id,
        parent_span_id: parent_span_id,
        type: "process_response",
        interlocutor: dest,
        timestamp: start + requestDur + processDur + responseDur,
        duration: processResponseDur,
        request: request,
        request_size: requestSize,
        protocol: "HTTP/1.1",
        response_size: responseSize,
        response_code: responseCode,
        user_agent: "grpc-go/1.3.0",
        timeout: null
	});
	
	return start + requestDur + processDur + responseDur + processResponseDur;
}

function randomHttpMethod() {
	var types = ["GET", "POST", "PUT", "DELETE"];
	return types[Math.floor(Math.random() * types.length)];
}

function randomHttpCode() {
	if (Math.random() < 0.9) {
		return 200;
	}
	
	var codes = [201, 202, 400, 401, 500, 503];
	return codes[Math.floor(Math.random() * codes.length)];
}

