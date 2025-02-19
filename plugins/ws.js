export default async ({ $axios, $toast, store, $config, $moment }, inject) => {
  let ws = null;
  let timeInterval = null;


  const connectWebSocket = () => {
    ws = new WebSocket(store.state.ws_url + '?token=' + store.state.auth.panel_token);
    console.log("WebSocket connected");
    if (timeInterval != null) {
      clearInterval(timeInterval);
      timeInterval = null
    }


    ws.onopen = function () {
      store.dispatch('ws/setConnest', true);
      const subscribeMessage = {
        action: "subscribe",
        channels: [
          "callerId",
        ]
      };
      ws.send(JSON.stringify(subscribeMessage));

      const subscribeNotif = {
        action: "subscribe",
        channels: [
          "pushNotification",
        ]
      };
      ws.send(JSON.stringify(subscribeNotif));



    };

    ws.onmessage = function (event) {
      // console.log('on message', event)
      let messageContent = JSON.parse(event.data);
      store.dispatch('ws/encode', messageContent);
    };

    ws.onclose = function () {
      store.dispatch('ws/setConnest', false);
      console.log("WebSocket closed");
      // Reconnect logic
      if (!timeInterval)
        timeInterval = setInterval(() => {
          connectWebSocket();
        }, 5000)



    };

    ws.onerror = function (error) {
      console.error("WebSocket error:", error);
      if (!timeInterval)
        timeInterval = setInterval(() => {
          connectWebSocket();
        }, 10000)
    };
  };

  inject('initWS', (chats) => {
    connectWebSocket();

  });
}