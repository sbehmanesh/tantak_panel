
export default ({ redirect, store, $toast }, inject) => {
    inject('showBrowserNotif', (data) => {
        try {
            let permission = Notification.permission;

            if (permission === "granted") {
                showNotification(data);
            } else if (permission === "default") {
                requestAndShowPermission();
            } else {
                console.log("Use normal alert");
            }

            function showNotification() {
                if (document.visibilityState === "visible") {
                    return;
                }
                var title = data.title;
                var icon = null
                var body = data.message;
                var notification = new Notification(title, { body, icon });
                notification.onclick = () => {
                    notification.close();
                    window.parent.focus();
                }
            }
            function requestAndShowPermission() {
                Notification.requestPermission(function (permission) {
                    if (permission === "granted") {
                        showNotification(data);
                    }
                });
            }
        } catch (error) {
            console.log(error, 'error')
        }
    })
}