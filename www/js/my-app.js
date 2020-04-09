function Application () {
// Initialize app
var myApp = new Framework7();
var data, options;
var defaults = {
            fontSize: '14px'
        };
  
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
      swipe: true,
      swipeOnlyClose: true
    },
    // Add default routes
    routes: [
      {
        path: '/',
        templateUrl: 'home.html',
      },
      {
        path: '/settings',
        templateUrl: 'settings.html'
      },
      {
        path: '/about',
        templateUrl: 'about.html'
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
        function(resp, status, xhr) {
            console.log(status);
            prettyTables(resp.articles);
            
            localStorage.setItem('data-meducation', JSON.stringify(resp));
            console.log('done');
            
            data = JSON.parse(localStorage.getItem('data-meducation'));
            mainView.router.navigate(
                '/',
                {
                    context: {
                        articles: data.articles,
                        options: options
                    }
                }
            );
            app.dialog.close();
        },
        function(xhr, status) {
            console.log(status);
            app.dialog.close();
            app.dialog.alert('Network problem', 'Error');
        }
    );
}

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    log("Device is ready!");
    app.statusbar.show();

    options = localStorage.getItem('opts-meducation');
    if (options == null) {
        log('no options set');
        // set defaults
        options = defaults;
    } else {
        log('loaded options');
    }
    
    data = localStorage.getItem('data-meducation');
    if(data == null) {
        loadContent();
    } else {
        data = JSON.parse(data);
        mainView.router.navigate(
            '/',
            {
                context: {
                    articles: data.articles,
                    options: options
                },
            }
        );
    }
});

$$(document).on('page:init', '.page' ,function() {
    var pageName = $$(this).attr('data-name');
    log(pageName);
    if(pageName == 'settings') {
        $$('#fontSize').click(function() {
            var config = {
                title: 'Select font size',
                items: [
                    {text: '10 px', value: '10px'},
                    {text: '12 px', value: '12px'},
                    {text: '14 px', value: '14px'},
                    {text: '16 px', value: '16px'},
                    {text: '18 px', value: '18px'},
                    {text: '20 px', value: '20px'},
                ],
                selectedValue: options.fontSize,
                androidTheme: 5
            };
            log(config);
            log(plugins);
            log(plugins.listpicker.showPicker);
            plugins.listpicker.showPicker(
                config,
                function(item) {
                    log('selected' + item);
                    options.fontSize = item;
                },
                null
            );
        });
    }
});

$$(document).on('click', 'a', function() {
    log($$(this).attr('id'));
    var id = $$(this).attr('id').split('-')[1];
    id = data.articles.length - parseInt(id);
    var article = data.articles[id];

    mainView.router.navigate(
        '/article',
        {
            context: {
                article: article,
                options: options
            }
        }
    );
});

$$(document).on('ptr:refresh', '.ptr-content', function() {
    loadContent();
    app.ptr.done();
});

$$('.side-menu').on('click', function() {
    var id = $$(this).attr('id');
    log('panel menu clicked > ' + id);
    if (id == 'home-menu') {
        log('going to home');
        // navigate to home page
        mainView.router.navigate(
            '/',
            {
                context: {
                    articles: data.articles,
                    options: options
                }
            }
        );
    } else if (id == 'settings-menu') {
        log('going to settings');
        // navigate to settings page
        mainView.router.navigate(
            '/settings', {context: {options: options}}
        );
    } else if (id == 'about-menu') {
        log('going to about');
        // navigate to about page
        mainView.router.navigate(
            '/about', {context: {options: options}}
            );
    }
    app.panel.close();
});

$$(document).on('backbutton', function() {
    log('backbutton');
    log(mainView.router.url);
    if (mainView.router.url == '/') {
        navigator.notification.confirm(
            '\nAre you sure to close the app?',
            function(buttonIndex) {
                if (buttonIndex == 1) {
                    log('exiting app...');
                    navigator.app.exitApp();
                }
            }
        );
    } else {
        mainView.router.back();
    }
});
}

Application();