// Initialize app
var myApp = new Framework7();
var data;
  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Meducation',
    // App id
    id: 'com.galib.meducation',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/about',
        url: 'about.html',
      },
      {
        path: '/article',
        templateUrl: 'article.html',
      }
    ],

    statusbar: {
        androidOverlaysWebView: false,
        androidBackgroundColor: '#272727',
        androidTextColor: 'white'
    },
    // ... other parameters
  });

var mainView = app.views.create('.view-main');


function loadContent() {
    app.dialog.preloader();
    // get json
    var url = 'http://galib45.herokuapp.com/pathology/json';
    console.log(url);
    console.log('getting json...');
    app.request.json(
        url, 
        function(data, status, xhr) {
            console.log(status);
            localStorage.setItem('data-meducation', JSON.stringify(data));
            console.log('done');
            
            data = JSON.parse(localStorage.getItem('data-meducation'));
            prepareList(data.articles);
            
            app.dialog.close();
        },
        function(xhr, status) {
            console.log(status);
            app.dialog.close();
            app.dialog.alert('Network problem', 'Error');
        }
    );
}

function prepareList(articles) {
    var content, listContent;
    $$('ul').html('');
    for (article of articles) {
        prettyTables(article);
        content = '<a href="#" id="article-' + article.id + '"' + 
                'class="item-link item-content no-ripple"><div class="item-inner">' + 
                '<div class="item-title-row"><div class="item-title">' +
                '<h1 style="margin: 5px 0 1px; white-space: normal;">' + 
                article.title + '</h1>' +
                '</div></div><div class="item-subtitle">' + 
                '<h2 style="margin: 0;" class="text-color-blue">' + article.subtitle + '</h2></div>' +
                '<div class="item-text">' + 
                '<p style="margin: 1px 0 5px;">' + 
                'Posted by <b>' + article.author + '</b> on ' + article.date_created + 
                '</p></div></div></a>';
        listContent = '<li>' + content + '</li>';
        $$('ul').append(listContent);
    }
}

function prettyTables(article) {
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

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    log("Device is ready!");
    app.statusbar.show();
    //localStorage.clear();
    data = localStorage.getItem('data-meducation');
    if(data == null) {
        loadContent();
    } else {
        data = JSON.parse(data);
        prepareList(data.articles);
    }
});

$$(document).on('click', 'a', function() {
    var id = $$(this).attr('id').split('-')[1];
    id = data.articles.length - parseInt(id);
    var article = data.articles[id];

    mainView.router.navigate(
        '/article',
        {
            context: {
                article: article
            }
        }
    );
});

$$('.ptr-content').on('ptr:refresh', function() {
    loadContent();
    app.ptr.done();
});

$$(document).on('backbutton', function() {
    log('backbutton');
    if (mainView.router.url == '/article') {
        mainView.router.back();
    } else {
        navigator.notification.confirm(
            '\nAre you sure to close the app?',
            function(buttonIndex) {
                if (buttonIndex == 1) {
                    log('exiting app...');
                    navigator.app.exitApp();
                }
            }
        );
    }
});
