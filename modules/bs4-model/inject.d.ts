
import {UserOption} from './types';

declare module 'vue/types/vue' {
    interface Vue {
        $model<T>(options:{
            id ?:string,
            title ?:string,
            text :string,
            options :UserOption[]
        }):Promise<T>;
    }
}