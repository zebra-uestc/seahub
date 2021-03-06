/*global define*/
define([
    'jquery',
    'backbone',
    'common',
    'sysadmin-app/views/side-nav',
    'sysadmin-app/views/dashboard',
    'sysadmin-app/views/desktop-devices',
    'sysadmin-app/views/mobile-devices',
    'sysadmin-app/views/device-errors',
    'sysadmin-app/views/repos',
    'sysadmin-app/views/search-repos',
    'sysadmin-app/views/system-repo',
    'sysadmin-app/views/trash-repos',
    'sysadmin-app/views/search-trash-repos',
    'sysadmin-app/views/dir',
    'app/views/account'
], function($, Backbone, Common, SideNavView, DashboardView,
    DesktopDevicesView, MobileDevicesView, DeviceErrorsView,
    ReposView, SearchReposView, SystemReposView, TrashReposView, 
    SearchTrashReposView, DirView, AccountView) {

    "use strict";

    var Router = Backbone.Router.extend({
        routes: {
            '': 'showDashboard',
            'dashboard/': 'showDashboard',
            'desktop-devices/': 'showDesktopDevices',
            'mobile-devices/': 'showMobileDevices',
            'device-errors/': 'showDeviceErrors',
            'all-libs/': 'showLibraries',
            'search-libs/': 'showSearchLibraries',
            'system-lib/': 'showSystemLibrary',
            'trash-libs/': 'showTrashLibraries',
            'search-trash-libs/': 'showSearchTrashLibraries',
            'libs/:repo_id(/*path)': 'showLibraryDir',
            // Default
            '*actions': 'showDashboard'
        },

        initialize: function() {
            $('#initial-loading-view').hide();

            Common.prepareApiCsrf();
            Common.initLocale();

            this.sideNavView = new SideNavView();
            app.ui = {
                sideNavView: this.sideNavView
            };

            this.dashboardView = new DashboardView();
            this.desktopDevicesView = new DesktopDevicesView();
            this.mobileDevicesView = new MobileDevicesView();
            this.deviceErrorsView = new DeviceErrorsView();

            this.reposView = new ReposView();
            this.searchReposView = new SearchReposView();
            this.systemReposView = new SystemReposView();
            this.trashReposView = new TrashReposView();
            this.searchTrashReposView = new SearchTrashReposView();
            this.dirView = new DirView();

            app.ui.accountView = this.accountView = new AccountView();

            this.currentView = this.dashboardView;

            $('#info-bar .close').click(Common.closeTopNoticeBar);
        },

        switchCurrentView: function(newView) {
            if (this.currentView != newView) {
                this.currentView.hide();
                this.currentView = newView;
            }
        },

        showDashboard: function() {
            this.switchCurrentView(this.dashboardView);
            this.sideNavView.setCurTab('dashboard');
            this.dashboardView.show();
        },

        showDesktopDevices: function(current_page) {
            var url = window.location.href;
            var page = url.match(/.*?page=(\d+)/);
            if (page) {
                var current_page = page[1];
            } else {
                var current_page = null;
            }
            this.switchCurrentView(this.desktopDevicesView);
            this.sideNavView.setCurTab('devices');
            this.desktopDevicesView.show({'current_page': current_page});
        },

        showMobileDevices: function(current_page) {
            var url = window.location.href;
            var page = url.match(/.*?page=(\d+)/);
            if (page) {
                current_page = page[1];
            } else {
                current_page = null;
            }
            this.switchCurrentView(this.mobileDevicesView);
            this.sideNavView.setCurTab('devices');
            this.mobileDevicesView.show({'current_page': current_page});
        },

        showDeviceErrors: function() {
            this.switchCurrentView(this.deviceErrorsView);
            this.sideNavView.setCurTab('devices');
            this.deviceErrorsView.show();
        },

        showLibraries: function() {
            // url_match: null or an array like ["http://127.0.0.1:8000/sysadmin/#libraries/?page=2", "2"] 
            var url_match = location.href.match(/.*?page=(\d+)/);
            var page = url_match ? url_match[1] : 1; // 1: default

            this.switchCurrentView(this.reposView);
            this.sideNavView.setCurTab('libraries', {'option': 'all'});
            this.reposView.show({'page': page});
        },

        showSearchLibraries: function() {
            // url_match: null or an array
            var url_match = location.href.match(/.*?name=(.*)&owner=(.*)/); // search by repo_name/owner
            var repo_name = url_match ? url_match[1] : '';
            var owner = url_match ? url_match[2] : '';

            this.switchCurrentView(this.searchReposView);
            this.sideNavView.setCurTab('libraries', {'option': 'search'});
            this.searchReposView.show({
                'name': decodeURIComponent(repo_name),
                'owner': decodeURIComponent(owner)
            });
        },

        showLibraryDir: function(repo_id, path) {
            if (path) {
                path = '/' + path;
            } else {
                path = '/';
            }
            this.switchCurrentView(this.dirView);
            this.dirView.show(repo_id, path);
            this.sideNavView.setCurTab('libraries', {'option': ''});
        },

        showSystemLibrary: function() {
            this.switchCurrentView(this.systemReposView);
            this.sideNavView.setCurTab('libraries', {'option': 'system'});
            this.systemReposView.show();
        },

        // show trash libs by page
        showTrashLibraries: function() {
            // url_match: null or an array
            var url_match = location.href.match(/.*?page=(\d+)/);
            var page = url_match ? url_match[1] : 1; // 1: default

            this.switchCurrentView(this.trashReposView);
            this.sideNavView.setCurTab('libraries', {'option': 'trash'});
            this.trashReposView.show({'page': page});
        },

        // search trash libs by owner
        showSearchTrashLibraries: function() {
            // url_match: null or an array
            var url_match = location.href.match(/.*?name=(.*)/); // search by owner
            var owner = url_match ? url_match[1] : '';

            this.switchCurrentView(this.searchTrashReposView);
            this.sideNavView.setCurTab('libraries', {'option': 'trash'});
            this.searchTrashReposView.show({'owner': decodeURIComponent(owner)});
        }

    });

    return Router;
});
