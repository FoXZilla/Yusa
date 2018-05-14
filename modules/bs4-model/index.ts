import Model from './bs4-model.vue';
import {UserOption,ModelOption} from './types';

export default {install};

export function install(Vue:any){
    Vue.component(Model.name, Model);
    Vue.prototype.$model =async function(modelOption:ModelOption){
        modelOption.id =modelOption.id ||'default';
        var vm =vmMap[modelOption.id];
        if(!vm){
            throw new Error(`Not found bs4-model#${modelOption.id}, did you add <bs4-model id="${modelOption.id}"> anywhere?`);
        };
        vm.callOption   =modelOption;

        reloveMap[vm.id] =reloveMap[vm.id] ||[];

        //@ts-ignore
        $(`#${vm.id}`).modal('show').one('hidden.bs.modal',function(){
            onclose(vm);
        });

        return new Promise(r=>reloveMap[vm.id].push(r));
    };
};
export var vmMap ={};
export var reloveMap ={};
export function onclose(vm:ModelOption ,option?:UserOption){
    if(reloveMap[vm.id]){
        reloveMap[vm.id].forEach(r=>r(option&&option.flag));
        reloveMap[vm.id].length=0;
    };
    //@ts-ignore
    $(`#${vm.id}`).modal('hide');
}
