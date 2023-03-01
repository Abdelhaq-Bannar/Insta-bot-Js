let match = window.location.href.match(/\/p\/(.+)\//);

document.dispatchEvent(new CustomEvent('initialData', {
    'detail': {
      'initialData': window.__initialData,
      'postData':match ? window.__additionalData['/p/'+match[1]+'/'] : []
    }
  }));

  window.addEventListener("message", (function(e) {
    var t = e.data;
    try {
        "InjectSendDmReq" === t.type && (__mqtt && __mqtt.sendTextMessage(t.thread_id, t.text, t.uuid).then((function(e) {})), t.ret = __mqtt ? 0 : -1, t.type = "InjectSendDmRsp", window.postMessage(t))
    } catch (e) {
        console.log("inject error:" + e.message)
    }
}))