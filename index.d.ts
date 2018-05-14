/// <reference path="notification.d.ts" />
/// <reference path="./modules/bs4-model/inject.d.ts" />


declare module '*.vue'{
    import Vue from 'vue';
    import {AxiosInstance} from 'axios';
    module 'vue/types/vue'{
        interface Vue{
            $axios :AxiosInstance;
            $t :(key: string) => string;
        }
    }
    export default Vue;
}

declare module 'jquery'{
    global{
        interface JQuery{
            modal(action:string);
        }
    }
}

declare var process:any;
