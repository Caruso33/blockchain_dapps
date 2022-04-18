export { onPastEvent, onEvent }

function onPastEvent(eventLog) {
  $("#past-log-events").append("<li>" + eventLog + "</li>")
}
function onEvent(eventLog) {
  $("#log-events").append("<li>" + eventLog + "</li>")
}

// let notificationHasShown = false

// function hasNotification() {
//   if (notificationHasShown) return
//   else notificationHasShown = true

//   if (!("Notification" in window)) {
//     alert("This browser does not support desktop notification")
//     return false
//   } else if (Notification.permission === "granted") {
//     return true
//   } else if (Notification.permission !== "denied") {
//     Notification.requestPermission().then((permission) => {
//       if (permission === "granted") {
//         return true
//       }
//       return false
//     })
//   }
// }
