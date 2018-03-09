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
        alert("Start Capture Response from Skydive was " + JSON.stringify(response));
    }, function errorCallback(response) {
      alert("ERROR Start Capture Response from Skydive was " + JSON.stringify(response));
    });

    console.log("Starting capture for canary");
    angularHttp({
        method: 'POST',
        url: '/api/v1/skydive/action/capture/',
        data: { "GremlinQuery": skydiveGremlinQueryCanary }
    }).then(function successCallback(response) {
        alert("Start Capture Response from Skydive was " + JSON.stringify(response));
    }, function errorCallback(response) {
      alert("ERROR Start Capture Response from Skydive was " + JSON.stringify(response));
    });
    
}

function skydiveStopCapture(angularHttp, skydiveHost, service, interlocutor) {
    captureId = "a36d3dd5-cc80-4d5f-7973-eba06dee917c"; // TODO Am I supposed to save this from the start?  Recreate?
    angularHttp({
        method: 'DELETE',
        url: '/api/v1/skydive/action/capture/',
    }).then(function successCallback(response) {
        alert("Stop Capture Response from Skydive was " + JSON.stringify(response));
    }, function errorCallback(response) {
      alert("ERROR Stop Capture Response from Skydive was " + JSON.stringify(response));
    });
}
