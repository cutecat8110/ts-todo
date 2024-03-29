import{d as v,u as F,q as g,K as B,e as E,h as t,w as b,i as o,c as S,g as R,J as d,o as I,f as s,C as x,_ as M}from"./index-DZvZe3qW.js";const q={class:"container flex min-h-screen items-center justify-center py-12"},z=s("div",{class:"tracking-widest"},[s("h1",{class:"text-center text-4xl font-bold"},"TS Todo"),s("h2",{class:"mt-2 text-center text-sm text-gray-400"},"Sign in to System")],-1),L={class:"space-y-4"},U={class:"block",for:"email"},$=s("div",{class:"font-bold"},"電子信箱",-1),N={class:"block",for:"password"},T=s("div",{class:"font-bold"},"密碼",-1),j={class:"space-y-4"},A=s("div",{class:"text-center text-xs text-gray-600"},"Copyright © 2024 by Hao",-1),J=v({__name:"LoginView",setup(D){var u,p;const y=F(),w=S(),c=(p=(u=R())==null?void 0:u.proxy)==null?void 0:p.$Swal,h=g(null),n=g({email:"test@example.com",password:"test123456"}),{isFetching:r,execute:k}=B({afterFetch({data:l}){const{token:e,nickname:i}=l;return y.auth={token:e,nickname:i},w.push({name:"todo"}),{data:l}},onFetchError({data:l}){return c==null||c.fire({title:l.message,icon:"error",showConfirmButton:!1,timer:2e3,willClose:()=>{var e;(e=document.getElementById("email"))==null||e.focus()}}),l}}).post(n.value);return(l,e)=>{const i=d("VField"),f=d("ErrorMessage"),_=M,V=d("RouterLink"),C=d("VForm");return I(),E("div",q,[t(C,{ref_key:"formRefs",ref:h,class:"flex max-w-80 flex-1 flex-col gap-16 pb-16",onSubmit:e[2]||(e[2]=m=>o(k)())},{default:b(({errors:m})=>[z,s("div",L,[s("label",U,[$,t(i,{id:"email",modelValue:o(n).email,"onUpdate:modelValue":e[0]||(e[0]=a=>o(n).email=a),modelModifiers:{trim:!0},class:x([m.email?"ring-red-600":"ring-gray-300 focus:ring-blue-600","mt-2 w-full rounded-md px-4 py-2 outline-none ring-1 ring-inset"]),name:"email",label:"電子信箱",type:"text",rules:"required|email",disabled:o(r)},null,8,["modelValue","class","disabled"]),t(f,{class:"mt-2 block text-red-600",name:"email"})]),s("label",N,[T,t(i,{id:"password",modelValue:o(n).password,"onUpdate:modelValue":e[1]||(e[1]=a=>o(n).password=a),modelModifiers:{trim:!0},class:x([m.password?"ring-red-600":"ring-gray-300 focus:ring-blue-600 ","mt-2 w-full rounded-md px-4 py-2 outline-none ring-1 ring-inset"]),name:"password",label:"密碼",type:"password",rules:"required",disabled:o(r)},null,8,["modelValue","class","disabled"]),t(f,{class:"mt-2 block text-red-600",name:"password"})])]),s("div",j,[t(_,{label:"登入",type:"submit",block:"",color:"blue",size:"lg",disabled:o(r)},null,8,["disabled"]),t(V,{to:{name:"signup"},custom:""},{default:b(({navigate:a})=>[t(_,{class:"mx-auto",label:"註冊",color:"blue",role:"link",size:"lg",variant:"link",disabled:o(r),onClick:a},null,8,["disabled","onClick"])]),_:1})]),A]),_:1},512)])}}});export{J as default};
