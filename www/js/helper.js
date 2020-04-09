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

function getComputed(property, element='') {
    var elem;
    if(element == '') {
        elem = document.documentElement;
    } else {
        elem = document.querySelector(element);
    }
    return getComputedStyle(elem).getPropertyValue(property);
}

function getStyle(property, element='') {
    var elem;
    if(element == '') {
        elem = document.documentElement;
    } else {
        elem = document.querySelector(element);
    }
    return elem.style.getPropertyValue(property);
}

function setStyle(property, value, element='') {
    var elem;
    if(element == '') {
        elem = document.documentElement;
    } else {
        elem = document.querySelector(element);
    }
    elem.style.setProperty(property, value);
}

function logFontSize(element='') {
    log(element + ' > computed: {' + getComputed('font-size', element) + '}');
    log(element + ' > assigned: {' + getStyle('font-size', element) + '}');
}

function prettyTables(articles) {
    for (article of articles) {
        var newContent = article.content;
        newContent = newContent.replace(
            '<table', 
            '<div style="overflow-x: auto;"><table'
        );
        newContent = newContent.replace(
            '</table>', 
            '</table></div>'
        );
        article.content = newContent;
    }
}