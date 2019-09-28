(window["webpackJsonptodomvc-typescript-react-rxjs"]=window["webpackJsonptodomvc-typescript-react-rxjs"]||[]).push([[0],{19:function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return o}));var r=n(26);function c(e){return function(t){return t[e]}}function o(e){return function(t){return function(n){return Object.assign(t,Object(r.a)({},e,n))}}}},2:function(e,t,n){"use strict";var r=n(33),c=n(61);n.d(t,"IS_TUPLE",(function(){return c.a})),n.d(t,"arrayBimap",(function(){return c.b})),n.d(t,"isArray",(function(){return c.c}));n(62);n.d(t,"first",(function(){return r.a})),n.d(t,"second",(function(){return r.b})),n.d(t,"thruple",(function(){return r.c})),n.d(t,"tuple",(function(){return r.d}));n(19);var o=n(63);n.d(t,"isNotNull",(function(){return o.a})),n.d(t,"take",(function(){return o.b}));var a=n(64);n.d(t,"compose",(function(){return a.a})),n.d(t,"identity",(function(){return a.b})),n.d(t,"once",(function(){return a.c}));n(65)},33:function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return o})),n.d(t,"d",(function(){return a})),n.d(t,"c",(function(){return i}));var r=n(3),c=function(e){return Object(r.a)(e,1)[0]},o=function(e){return Object(r.a)(e,2)[1]},a=function(e,t){return[e,t]},i=function(e,t,n){return[e,t,n]}},61:function(e,t,n){"use strict";n.d(t,"b",(function(){return c})),n.d(t,"a",(function(){return o})),n.d(t,"c",(function(){return a}));var r=n(33),c=function(e){return function(t){return function(n){return n.map((function(n){return Object(r.d)(e(n),t(n))}))}}},o=!0,a=function(e){return function(t){return!!Array.isArray(t)&&(!(e&&t.length>0)||Array.isArray(t[0]))}}},62:function(e,t,n){"use strict";n(59),n(39),n(88)},63:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return c}));var r=function(e){return null!=e},c=function(e){return function(t){for(var n=[],r=t.length,c=0;c<r&&c<e;c+=1)n.push(t[c]);return n}}},64:function(e,t,n){"use strict";n.d(t,"c",(function(){return r})),n.d(t,"b",(function(){return c})),n.d(t,"a",(function(){return o}));var r=function(e){var t;return function(n){return t||(t=e(n)),t}},c=function(e){return e},o=function(e,t){return function(n){return e(t(n))}}},65:function(e,t){},77:function(e,t,n){e.exports=n(87)},82:function(e,t,n){},87:function(e,t,n){"use strict";n.r(t);var r,c,o=n(0),a=n.n(o),i=n(43),u=n.n(i),l=(n(82),n(3)),s=n(45),f=n(47),d=n(116),p=n(99),b=n(114),m=n(46),O=n(71);!function(e){e.Fetch="Fetch",e.Edit="Edit",e.Save="Save",e.Delete="Delete"}(r||(r={})),function(e){e.Noop="Noop",e.Pending="Pending",e.Ok="Ok",e.Bad="Bad"}(c||(c={}));var j=function(e){return function(t){return e===t}},y=j(c.Ok),v=j(c.Bad),h=j(c.Noop),g=j(c.Pending),w=function(e){return function(t){return e(t.status)}},E=w(y),x=w(v),k=w(h),C=w(g),A=function(e){return{status:c.Noop,state:e}};function S(e,t){return null!=t?{status:c.Pending,state:e.state,action:t}:{status:c.Pending,state:e.state}}var P,N=function(e){return o.createElement(o.Fragment,null,o.createElement(p.b,{title:e.todo.title,style:{opacity:e.isDeleting?.5:1,transition:"opacity 0.2s ease-in-out"}},o.createElement(p.c,{icon:{icon:e.todo.completed?"check_circle_outline":"radio_button_unchecked",theme:e.todo.completed?"primary":void 0,onClick:function(){return e.onSave({completed:!e.todo.completed})}}}),o.createElement(p.g,null,o.createElement(p.e,{theme:"secondary"},e.todo.title),o.createElement(p.f,{theme:e.error?"error":void 0,style:{fontStyle:"italic "}},e.error?e.error:e.status&&g(e.status)?e.isDeleting?"...deleting":"...saving":e.todo.completed?o.createElement(s.a,{theme:"primary",use:"caption"},"You're a go-getter!"):o.createElement(s.a,{use:"caption"},"Start working on it!"))),o.createElement(p.d,{icon:null==e.status?"":g(e.status)?o.createElement(m.a,{theme:"secondary"}):v(e.status)?{icon:"error",theme:"error"}:y(e.status)?{icon:"check",theme:"primary"}:""})),o.createElement(p.a,null))},D=n(14),T=function(e){var t=e.new,n=E(t)?D.a:function(t){e.onChangeNew(t.currentTarget.value)},c=x(e.new)?o.createElement(b.a,{icon:{icon:"error",theme:"secondary"},open:!0,theme:"primaryBg",style:{background:"var(--mdc-theme-primary)"},message:e.new.error}):null;return o.createElement(d.a,{className:"todo-list",twoLine:!0},o.createElement(p.b,null,o.createElement(p.c,{title:"Mark all as complete.",icon:{icon:"keyboard_arrow_down",onClick:e.onCompleteAll},theme:"secondary"}),C(e.new)?o.createElement(o.Fragment,null,o.createElement(p.g,null,o.createElement(p.e,{theme:"secondary"},e.new.state),o.createElement(p.f,{style:{fontStyle:"italic "}},"...busy")),o.createElement(p.d,{icon:null==e.new.status?"":C(e.new)?o.createElement(m.a,{theme:"secondary"}):x(e.new)?{icon:"error",theme:"error"}:E(e.new)?{icon:"check",theme:"primary"}:""})):o.createElement(O.a,{fullwidth:!0,theme:"textPrimaryOnDark",placeholder:"Where do you want to go today?",style:{height:"100%"},onChange:n,value:e.new.state||"",onKeyUp:function(t){return 13===t.keyCode&&e.onSubmitNew()},autoFocus:!0,trailingIcon:x(e.new)?{icon:"error",theme:"error"}:void 0})),o.createElement(p.a,null),function(e){return e.todos.map((function(t){var n=Object(l.a)(t,2),c=n[0],a=n[1];return o.createElement(N,{key:c.id,todo:c,onEdit:e.onEdit(c,a),onSave:e.onSave(c,a),status:a&&a.status,isDeleting:C(a)&&a.action===r.Delete,error:a&&x(a)&&a.error||void 0})}))}(e),c)},F={textAlign:"center",marginTop:15},_=function(){return o.createElement("div",{style:F},o.createElement(s.a,{use:"headline1",theme:"secondary"},"todos"))},B=n(41);!function(e){e.All="All",e.Active="Active",e.Completed="Completed"}(P||(P={}));var I,U=function(e){return function(t){return t===e}},M=U(P.All),L=U(P.Completed),R=U(P.Active),W=function(e){return function(t){return e===P.All?t:t.filter((function(t){var n=Object(l.a)(t,1)[0];return L(e)&&n.completed||R(e)&&!n.completed}))}},Y=W(P.Completed),q=W(P.Active),J=n(2),z=n(11),K=n(104),V=n(102),$=function(e){var t=new V.a(e);return[t.asObservable(),function(e){t.next(e)},function(){return t.getValue()}]},G=n(53),H=n(103),Q=n(115),X=n(105),Z=n(27),ee=n(59),te=n(39),ne=n(70),re=n(109),ce=n(106),oe=n(107),ae=n(108),ie=n(88);!function(e){e.Update="Update",e.Remove="Remove",e.Add="Add"}(I||(I={}));var ue=function(e){return function(t){return{type:e,payload:t}}},le=ue(I.Add),se=ue(I.Update),fe=ue(I.Remove),de=function(){arguments.length>0&&void 0!==arguments[0]&&arguments[0];var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return function(t){return function(n){return e?[].concat(Object(z.a)(t),Object(z.a)(Object(J.isArray)(e)(n.payload)?n.payload:[n.payload])):t.concat(n.payload)}}},pe=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(e,t){return e===t},t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return function(n){return function(r){var c=Object(z.a)(n);return(Object(J.isArray)(t)(r.payload)?r.payload:[r.payload]).forEach((function(t){var n=c.findIndex((function(n){return e(n,t)}));n>=0?c.splice(n,1,t):c.push(t)})),c}}},be=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(e,t){return e===t},t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return function(n){return function(r){var c=Object(J.isArray)(t)(r.payload)?Object(z.a)(r.payload):[r.payload];return n.filter((function(t){var n=c.findIndex((function(n){return e(t,n)}));return!(n>=0)||(c.splice(n,1),!1)}))}}},me=$(P.All),Oe=function(e){return o.createElement(B.b,{choice:!0,style:{justifyContent:"center"}},o.createElement(B.a,{label:"All",theme:M(e.filterType)?"secondaryBg":void 0,onClick:function(){return e.onChangeFilterType(P.All)}}),o.createElement(B.a,{label:"Active",icon:"radio_button_unchecked",theme:R(e.filterType)?"secondaryBg":void 0,onClick:function(){return e.onChangeFilterType(P.Active)}}),o.createElement(B.a,{label:"Completed",icon:"check_circle_outline",theme:L(e.filterType)?"secondaryBg":void 0,onClick:function(){return e.onChangeFilterType(P.Completed)}}))},je=function(e){var t=o.createElement(T,{todos:e.todos,onEdit:e.onEdit,onSave:e.onSave,onChangeNew:e.onChangeNew,new:e.new,onSubmitNew:e.onSubmitNew,onCompleteAll:e.onCompleteAll}),n=o.createElement("div",null,o.createElement(f.a,{onClick:e.onClearComplete},"Clear completed")),r=o.createElement(Oe,{filterType:e.filterType,onChangeFilterType:e.onChangeFilterType}),c=o.createElement(s.a,{use:"caption",style:{color:"#999  "}},o.createElement("strong",null,e.todos.filter((function(e){return!Object(l.a)(e,1)[0].completed})).length)," ","item left");return o.createElement(o.Fragment,null,o.createElement(_,null),o.createElement("section",{className:"todoapp"},o.createElement("section",{className:"main"},t),o.createElement("footer",{className:"footer",style:{textAlign:"center"}},r,n,c)))},ye=n(20),ve=n(72),he=function(e){return o.createElement("div",{style:{padding:15}},o.createElement(ve.a,{value:e.index,onInput:function(t){e.setIndex(t.detail.value)},discrete:!0,start:0,max:e.max,step:1}),o.createElement("div",{className:"controls"},o.createElement(ye.a,{theme:0===e.index?void 0:"secondary",icon:"fast_rewind",onClick:function(){return e.setIndex(0)},disabled:0===e.index}),o.createElement(ye.a,{theme:0===e.index?void 0:"secondary",icon:"skip_previous",onClick:function(){return e.setIndex(e.index-1)},disabled:0===e.index}),o.createElement(ye.a,{theme:"secondary",icon:"stop",onClick:e.pause}),o.createElement(ye.a,{theme:"secondary",icon:"play_circle_filled",onClick:e.play}),o.createElement(ye.a,{theme:e.index===e.max?void 0:"secondary",icon:"skip_next",onClick:function(){return e.setIndex(e.index+1)},disabled:e.index===e.max}),o.createElement(ye.a,{theme:e.index===e.max?void 0:"secondary",icon:"fast_forward",onClick:function(){return e.setIndex(e.max)},disabled:e.index===e.max})))},ge={flex:"1 1 auto",display:"flex",alignItems:"center",justifyContent:"center"},we=function(){return o.createElement("div",{style:ge},o.createElement("div",null,o.createElement(m.a,{theme:"secondary",size:"large"})))},Ee=n(55),xe=n(110),ke=n(111),Ce=n(112),Ae=n(69),Se=n(113),Pe=n(26),Ne=n(21),De=n.n(Ne),Te=n(40);function Fe(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function _e(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Fe(n,!0).forEach((function(t){Object(Pe.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Fe(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var Be=[],Ie=[!0,!1,!1,!0,!0,!1,!0],Ue=0,Me=function(){return(Ue+=1)>Ie.length-1&&(Ue=0),Ie[Ue]},Le=function(e){return new Promise((function(t){return setTimeout(t,e)}))},Re=function(){return Le(Math.ceil(2500*Math.random()))},We=function(){var e=Object(Te.a)(De.a.mark((function e(){var t,n;return De.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(Me(),!(Be.length<=0)){e.next=13;break}return e.next=4,fetch("https://jsonplaceholder.typicode.com/todos/");case 4:return t=e.sent,e.next=7,t.json();case 7:return n=e.sent,e.next=10,Le(1500);case 10:Be=Object(J.take)(6)(n),e.next=15;break;case 13:return e.next=15,Le(1e3);case 15:return e.abrupt("return",Be);case 16:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Ye=function(){var e=Object(Te.a)(De.a.mark((function e(t){var n,r,o;return De.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=Me(),r=t.state.trim()){e.next=4;break}return e.abrupt("return",{status:c.Bad,error:"A title is required!",state:t.state});case 4:return e.next=6,Re();case 6:if(!n){e.next=8;break}return e.abrupt("return",{status:c.Bad,error:"Something went terribly wrong!",state:t.state});case 8:if(!Be.find((function(e){return e.title===r}))){e.next=11;break}return e.abrupt("return",{status:c.Bad,error:"A task with this title alreay exists!",state:t.state});case 11:return o={id:Math.floor(1e4*Math.random()),userId:Math.floor(1e4*Math.random()),title:t.state,completed:!1},Be=[].concat(Object(z.a)(Be),[o]),e.abrupt("return",{status:c.Ok,state:o});case 14:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),qe=function(){var e=Object(Te.a)(De.a.mark((function e(t,n){var o,a;return De.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Re();case 2:if(!Me()){e.next=5;break}return e.abrupt("return",{status:c.Bad,error:"Something went terribly wrong!",state:n.state,action:r.Save});case 5:if(o=n.state.title.trim()){e.next=8;break}return e.abrupt("return",{status:c.Bad,action:r.Save,error:"A title is required!",state:_e({},n.state,{title:o})});case 8:return a=_e({},t,{},n.state,{title:o}),Be=Be.map((function(e){return e.id===a.id?a:t})),e.abrupt("return",{status:c.Ok,state:_e({},t,{},n.state,{title:o}),action:r.Save});case 11:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),Je=function(){var e=Object(Te.a)(De.a.mark((function e(t,n){return De.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Re();case 2:if(!Me()){e.next=5;break}return e.abrupt("return",{status:c.Bad,error:"Unable to delete!",state:n.state,action:r.Delete});case 5:return Be=Be.filter((function(e){return e.id!==t.id})),e.abrupt("return",{status:c.Ok,state:t,action:r.Delete});case 7:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),ze=function(e,t){return{type:r.Save,todo:e,operation:t}},Ke=function(e){return function(t){return t===e}},Ve=Ke(r.Fetch),$e=Ke(r.Edit),Ge=Ke(r.Save),He=Ke(r.Delete),Qe=function(e){return function(t){return e(t.type)}},Xe=Qe(Ve),Ze=Qe($e),et=Qe(Ge),tt=(Qe(He),n(19)),nt={completed:!1,title:""},rt=function(e){return at(it(nt)(ot(e)))(ct(e))},ct=(Object(tt.a)("id"),Object(tt.a)("title")),ot=Object(tt.a)("completed"),at=(Object(tt.b)("id"),Object(tt.b)("title")),it=Object(tt.b)("completed");function ut(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}var lt=function(e){return function(t){return function(n){return t(e(n))}}},st=lt(le),ft=lt(se),dt=lt(fe),pt=function(e){return function(t){return function(n){ft(e)(Object(J.tuple)(E(n)?function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ut(n,!0).forEach((function(t){Object(Pe.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ut(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},t,{},n.state):t,n))}}},bt=new Z.a,mt=function(e){console.warn("Dispatching ".concat(e.type)),bt.next(e)},Ot=function(){return mt({type:r.Fetch})},jt=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(e,t){return e===t},n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r={type:I.Add,payload:e},c=$(r),o=Object(l.a)(c,2),a=o[0],i=o[1],u=a.pipe(Object(ce.a)((function(e,r){switch(r.type){case I.Add:return de(t,n)(e)(r);case I.Update:return pe(t,n)(e)(r);case I.Remove:return be(t,n)(e)(r);default:return e}}),[]));return Object(J.tuple)(u,i)}([],(function(e,t){var n=Object(l.a)(e,1)[0],r=Object(l.a)(t,1)[0];return n.id===r.id}),J.IS_TUPLE),yt=Object(l.a)(jt,2),vt=yt[0],ht=yt[1],gt=function(e){return e.pipe(Object(ie.a)(1e3),Object(H.a)((t=ht,function(e){var n=Object(l.a)(e,2),r=n[0],c=n[1],o=A(E(c)?rt(c.state):c.state),a={type:I.Update,payload:E(c)?Object(J.tuple)(c.state,o):Object(J.tuple)(r.todo,o)};t(a)})));var t},wt=bt.pipe(Object(xe.a)((function(e){return Xe(e)?r.Fetch:e.todo.id}),(function(e){return e}),(function(e){return e.pipe(Object(ke.a)(15e3,ne.a),Object(Ce.a)())})),Object(Ae.a)((function(e){return e.pipe(Object(ae.a)((function(e){return Xe(e)?Et(e):Ze(e)?kt(e):et(e)?Ct(e):xt(e)})))}))),Et=function(e){return Object(Ee.a)(We()).pipe(Object(G.a)(Object(J.arrayBimap)(J.identity)(Object(J.compose)(A,rt))),Object(H.a)(st(ht)))},xt=function(e){var t,n=S(A(rt(e.todo)),r.Delete),c=Je(e.todo,n);return Object(ee.a)(Object(te.a)(Object(J.tuple)(e.todo,n)).pipe(Object(H.a)(ft(ht))),Object(Ee.a)(c).pipe(Object(H.a)((t=ht,function(e){return function(n){return E(n)?dt(t)(Object(J.tuple)(e,n)):ft(t)(Object(J.tuple)(e,n))}})(e.todo)),Object(oe.a)(x),Object(G.a)((function(t){return Object(J.tuple)(e,t)})),gt))},kt=function(e){var t=k(e.operation)?e.operation:A(e.operation.state);return Object(te.a)(Object(J.tuple)(e.todo,t)).pipe(Object(H.a)(ft(ht)))},Ct=function(e){var t=S(e.operation,r.Save),n={type:I.Update,payload:Object(J.tuple)(e.todo,t)},c=qe(e.todo,e.operation);return Object(ee.a)(Object(te.a)(void 0).pipe(Object(H.a)((function(){return ht(n)}))),Object(Ee.a)(c).pipe(Object(H.a)(pt(ht)(e.todo)),Object(G.a)((function(t){return Object(J.tuple)(e,t)})),gt))},At=wt,St=$(A("")),Pt=Object(l.a)(St,3),Nt=Pt[0],Dt=Pt[1],Tt=Pt[2],Ft=Object(J.thruple)(Nt.pipe(Object(ae.a)((function(e){return C(e)?Object(Ee.a)(Ye(e)).pipe(Object(H.a)((t=ht,function(e){if(E(e)){var n=Object(J.tuple)(e.state,A({title:e.state.title,completed:!1}));st(t)(n)}})),Object(G.a)((function(e){return x(e)?e:A("")})),Object(Se.a)(e)):Object(te.a)(e);var t}))),Dt,Tt),_t=function(e){var t=new V.a(-1),n=Object(K.a)(t,e).pipe(Object(ce.a)((function(e,t){var n=Object(l.a)(e,3),r=n[0],c=n[1],o=n[2],a=Object(l.a)(t,2),i=a[0],u=a[1];return r!==u?[u,c>=0&&c+1<o.length?c+1:-1,r?[].concat(Object(z.a)(o),[[r,Date.now()]]):[]]:[u,i,o]}),[void 0,-1,[]]),Object(oe.a)((function(e){return Object(J.isNotNull)(e[0])})),Object(G.a)((function(e){var t=Object(l.a)(e,3),n=t[0],r=t[1],c=t[2];return r<0||r>=c.length?[n,c,c.length,c.length]:[c[r][0],c,r,c.length]})),Object(Q.a)()),r=new Z.a,c=r.pipe(Object(X.a)(n),Object(ae.a)((function(e){var t=Object(l.a)(e,2),r=t[0],c=t[1];return"PLAY"===r?Object(ee.a)(Object(te.a)(c),n).pipe(Object(ae.a)((function(e){var t=Object(l.a)(e,3),n=t[0],r=t[1],c=t[2],a=n?[].concat(Object(z.a)(r),[Object(J.tuple)(n,r[r.length-1][1]+250)]):r,i=c>0&&a[c+1]?a[c+1][1]-a[c][1]:0;return Object(te.a)(void 0).pipe(Object(ie.a)(i>2500?250:i),Object(H.a)((function(){return o(a[c+1]?c+1:0)})))}))):ne.a}))),o=function(e){t.next(e)};return[Object(re.a)(c,n).pipe(Object(oe.a)((function(e){return Object(J.isNotNull)(e)}))),o,t.asObservable(),function(){return r.next("PLAY")},function(){return r.next("PAUSE")}]}(function(e){var t=Object.keys(e).reduce((function(t,n){var r=e[n];if(function(e){return Array.isArray(e)}(r)){var c=Object(l.a)(r,2),o=c[0],a=c[1],i=o.pipe(Object(G.a)((function(e){return[n,function(){return e},function(e){a(e)}]})));t.push(i)}else{var u=r.pipe(Object(G.a)((function(e){return[n,function(){return e},function(e){0}]})),Object(H.a)((function(e){return console.warn("Streaming [".concat(n,"]"))})));t.push(u)}return t}),[]);return K.a.apply(void 0,Object(z.a)(t)).pipe(Object(G.a)((function(e){return e.reduce((function(e,t){var n=Object(l.a)(t,3),r=n[0],c=n[1],o=n[2];return Object.defineProperty(e,r,{get:c,set:o}),e}),{})})),Object(H.a)((function(e){return console.log("State, state",e)})),Object(Q.a)())}({todos:Object(K.a)(vt,me[0]).pipe(Object(G.a)((function(e){var t=Object(l.a)(e,2),n=t[0];return function(e){return R(e)?q:L(e)?Y:J.identity}(t[1])(n)}))),filterType:me,new:Ft})),Bt=Object(l.a)(_t,5),It=Bt[0],Ut=Bt[1],Mt=(Bt[2],Bt[3]),Lt=Bt[4],Rt=function(e){return!0===e.completed};function Wt(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Yt(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Wt(n,!0).forEach((function(t){Object(Pe.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Wt(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var qt=function(e){return function(e,t){return function(n){(k(t)||x(t))&&mt(function(e,t){return{type:r.Edit,todo:e,operation:t}}(e,Yt({},t,{state:Yt({},t.state,{},n)})))}}},Jt=function(e,t){return function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(k(t)||x(t))&&mt(ze(e,Yt({},t,{state:Yt({},t.state,{},n)})))}},zt=function(e){return function(){e.todos.filter(Object(J.compose)(Rt,J.first)).filter((function(e){return k(Object(J.second)(e))||x(Object(J.second)(e))})).forEach((function(e){var t=Object(l.a)(e,1)[0];return mt(function(e){return{type:r.Delete,todo:e}}(t))}))}},Kt=It.pipe(Object(G.a)((function(e){var t=Object(l.a)(e,4),n=t[0],r=(t[1],t[2]!==t[3]),c=r?D.a:function(e){return function(t){e.filterType=t}}(n),o=r?D.a:function(e){return function(t){e.new=A(t)}}(n),a=r?D.a:function(e){return function(){C(e.new)||(e.new=S(e.new))}}(n),i=r?function(){return D.a}:qt(),u=r?function(){return D.a}:Jt,s=r?D.a:function(e){return function(){return e.todos.filter(Object(J.compose)((function(e){return!e}),Object(J.compose)(Rt,J.first))).filter((function(e){return k(Object(J.second)(e))||x(Object(J.second)(e))})).map((function(e){return Object(J.tuple)(Object(J.first)(e),Yt({},Object(J.second)(e),{state:Yt({},Object(J.second)(e).state,{completed:!0})}))})).forEach((function(e){return mt(ze.apply(void 0,Object(z.a)(e)))}))}}(n),f=r?D.a:zt(n);return{todos:n.todos,new:n.new,filterType:n.filterType,onChangeFilterType:c,onChangeNew:o,onSubmitNew:a,onEdit:i,onSave:u,onCompleteAll:s,onClearComplete:f}}))),Vt=function(){var e=function(){var e=o.useState({index:-1,max:0}),t=Object(l.a)(e,2),n=t[0],r=t[1],c=o.useState(),a=Object(l.a)(c,2),i=a[0],u=a[1];return o.useEffect((function(){var e=Kt.pipe(Object(H.a)(u)).subscribe(),t=At.subscribe(),n=It.pipe(Object(H.a)((function(e){var t=Object(l.a)(e,4),n=t[2],c=t[3];return r({index:n,max:c})}))).subscribe();return Ot(),function(){t.unsubscribe(),n.unsubscribe(),e.unsubscribe()}}),[]),[i,n,r]}(),t=Object(l.a)(e,2),n=t[0],r=t[1];if(null!=n){var c=a.a.createElement(je,{todos:n.todos,new:n.new,onChangeFilterType:n.onChangeFilterType,onChangeNew:n.onChangeNew,onSubmitNew:n.onSubmitNew,filterType:n.filterType,onEdit:n.onEdit,onSave:n.onSave,onCompleteAll:n.onCompleteAll,onClearComplete:n.onClearComplete}),i=a.a.createElement(he,{index:r.index,max:r.max,setIndex:Ut,pause:Lt,play:Mt});return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",null,a.a.createElement("div",{className:"todomvc"},c)),a.a.createElement("div",null,i))}return a.a.createElement(we,null)};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));u.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(Vt,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[77,1,2]]]);
//# sourceMappingURL=main.a9df1c15.chunk.js.map