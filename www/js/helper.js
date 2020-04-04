function log(obj) {
    if(typeof obj == 'object') {
        console.log(JSON.stringify(obj, null, 2));
    } else {
        console.log(obj);
    }
}

function alert(message, title='Alert') {
    navigator.notification.alert(
        message, null,
        title, 'Okay'
    );
}