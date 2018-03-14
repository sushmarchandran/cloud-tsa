// Licensed Materials - Property of IBM
// (C) Copyright IBM Corp. 2018. All Rights Reserved.
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

console.log("Hello Javascript from canary-dive.js");

function navigate(element, url) {
    element.src = url;
}

function navigateBaseline(url) {
    var element = document.getElementById("baseline-skydive-frame");
    navigate(element, url);
}

function navigateCanary(url) {
    var element = document.getElementById("canary-skydive-frame");
    navigate(element, url);
}

function getSkydiveUrl() {
    return document.getElementById("canary-analytics-frame").getAttribute("skydive-url");
}

function skydiveStartCapture(angularHttp, skydiveGremlinQueryBaseline, skydiveGremlinQueryCanary) {
    console.log("Starting capture for baseline");
    angularHttp({
        method: 'POST',
        url: '/api/v1/skydive/action/capture/',
        data: { "GremlinQuery": skydiveGremlinQueryBaseline }
    }).then(function successCallback(response) {
    	captureId = response.data.capture_details.UUID;
        alert("Successfully started Skydive capture " + captureId + " for the baseline");
    }, function errorCallback(response) {
      alert("ERROR Start Capture Response from Skydive was " + JSON.stringify(response));
    });

    console.log("Starting capture for canary");
    angularHttp({
        method: 'POST',
        url: '/api/v1/skydive/action/capture/',
        data: { "GremlinQuery": skydiveGremlinQueryCanary }
    }).then(function successCallback(response) {
    	captureId = response.data.capture_details.UUID;
        alert("Successfully started Skydive capture " + captureId + " for the canary");
    }, function errorCallback(response) {
      alert("ERROR Start Capture Response from Skydive was " + JSON.stringify(response));
    });
}

function skydiveStopCapture(angularHttp, skydiveGremlinQueryBaseline, skydiveGremlinQueryCanary) {
    console.log('Getting list of all captures to identify the ones matching the corresponding baseline and canary')
    angularHttp({
        method: 'GET',
        url: '/api/v1/skydive/action/capture/',
    }).then(function successCallback(response) {
    	console.log("List of ongoing captures: " + JSON.stringify(response)); 
        console.log('Matching baseline and canary Gremlin queries against ongoing captures');
        captureList = response.data.capture_list;
        for (i = 0; i < captureList.length; i++) {
        	captureId = captureList[i]['UUID']
        	gremlinQuery = captureList[i]['GremlinQuery']
        	if (gremlinQuery == skydiveGremlinQueryBaseline || gremlinQuery == skydiveGremlinQueryCanary) {
        		console.log("Stopping capture " + captureId);
        		angularHttp({
        			method: 'DELETE',
        			url: '/api/v1/skydive/action/capture/' + captureId,
    			}).then(function successCallback(response) {
    				deletedCaptureId = response.config.url;
					alert("Successfully stopped capture " + deletedCaptureId.substring(
							deletedCaptureId.lastIndexOf("/") + 1));
    			}, function errorCallback(response) {
      				alert("ERROR Stop Capture Response from Skydive was " + JSON.stringify(response));
    			});
        	}
        }
    }, function errorCallback(response) {
      alert("ERROR Stop Capture Response from Skydive was " + JSON.stringify(response));
    });
}
