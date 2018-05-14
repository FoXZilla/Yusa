export function fetchDeep(component){
    var originFn =component.fetch;
    component.fetch =async function (ctx) {
        if(component.components){
            var childComponents =Object.values(component.components);
            var fetchedComp =[];
            while(childComponents.length){
                let comp =childComponents.shift();
                let options = comp.options ||comp;
                if(fetchedComp.includes(comp))continue;
                else fetchedComp.push(comp);
                if(options.fetch) await options.fetch(ctx);
                if(options.components) childComponents.push(...Object.values(options.components));
            }
        };
        return originFn && originFn(ctx);
    };
    return component;
};

