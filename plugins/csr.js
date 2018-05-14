import Vue from 'vue';
import Notifications from 'vue-notification';
import 'babel-polyfill';
import 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';

Vue.use(Notifications);

export default function(context){
    window.NuxtContext =context;
}
