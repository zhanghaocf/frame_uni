import { onLoad, onUnload } from "@dcloudio/uni-app";
let _route="";
let _params={};
export default function useLinkPage(){
    onLoad(()=>{
        routerLink();
    });
    function routerLink(){
        if(!_route){
            return;
        }
        let route=_route;
        let params=Object.keys(_params).reduce((tol,pre)=>{
            tol+=`${pre}=${_params[pre]}&`;
            return tol;
        },'?').slice(0,-1);
        setRouter('',{});
        console.log("route+params:::",route+params)
        uni.navigateTo({
            url:route+params
        });
    }
    function setRouter(route,params={}){
        _route=route;
        _params=params;
    }
    return {
        setRouter,
        routerLink
    }
}