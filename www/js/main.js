'use strict';

var App;
var kendoApp;
var DBHandler;
var db;
var lastPressExit = new Date();
var IsDesktop = true;
require.config({
  paths: {
    jquery: "libs/jquery-2.1.1.min",
    domReady: "libs/domReady",
    kendo: "libs/kendo.all.min"
  },
  waitSeconds: 30,
  shim: {
    jquery: {
      exports: "jQuery"
    },
    kendo: {
      deps: ["jquery"],
      exports: "kendo"
    }
  }
});

define([
  'app',
  'jquery',
  'domReady',
  'db'
], function (Application, $, domReady, DB) {
  App = application;
  DBHandler = DB;

  console.log('Require initiating..');

  domReady(function () {
    function onDeviceReady(desktop) {
      console.log('Device ready..');

      DBHandler.init();
      if (desktop != true){
        IsDesktop = false;

        document.addEventListener("backbutton", app.backPressed, false);
        document.addEventListener("menubutton", app.menuPressed, false);
      }
    }

    if (navigator.userAgent.match(/(iPad|iPhone|Android)/)) {
      // This is running on a device so waiting for deviceready event
      document.addEventListener("deviceready", onDeviceReady, false);

      onDeviceReady(false);
    } else {
      // Polyfill for navigator.notification features to work in browser when debugging
      navigator.notification = {
        alert:function (message) {
          // Using standard alert
          alert(message);
        },
        beep: function (time){
          alert('BUZZ '+time+'x !');
        },
        confirm: function(message){
          confirm(message);
        }
      };

      window.Toast = {
        shortshow: function(msg, duration, successCallback, failureCallback){
          alert(msg);
        },
        longshow: function(msg, duration, successCallback, failureCallback){
          alert(msg);
        }
      };
      // On desktop don't have to wait for anything
      onDeviceReady(true);
    }
  });
});
