(this.webpackJsonpportfolio=this.webpackJsonpportfolio||[]).push([[0],{25:function(e,t,c){},26:function(e,t,c){},27:function(e,t,c){},30:function(e,t,c){},31:function(e,t,c){},32:function(e,t,c){},33:function(e,t,c){},34:function(e,t,c){},53:function(e,t,c){},54:function(e,t,c){},55:function(e,t,c){"use strict";c.r(t);var n=c(1),a=c(18),i=c.n(a),s=(c(25),c(26),c(27),c(20)),r=c(0),o=function(){return Object(r.jsxs)("div",{className:"about-main",children:[Object(r.jsx)("h1",{children:"Varun Dutia"}),Object(r.jsx)(s.a,{steps:["A",1e3,"A Developer!",500],loop:1,wrapper:"h1"})]})},l=(c(30),function(){return Object(r.jsx)("section",{id:"contact",children:Object(r.jsx)("footer",{className:"footer-main",children:Object(r.jsxs)("div",{className:"footer-content",children:[Object(r.jsx)("h2",{children:"Contact Me"}),"8220618104 | ",Object(r.jsx)("a",{href:"mailto:varundutia.h@gmail.com",children:"varundutia.h@gmail.com"}),Object(r.jsxs)("div",{className:"footer-icons",children:[Object(r.jsx)("a",{href:"https://www.instagram.com/varundutia_/",children:Object(r.jsx)("i",{className:"fab fa-instagram icon"})}),Object(r.jsx)("a",{href:"https://github.com/varundutia",children:Object(r.jsx)("i",{className:"fab fa-github icon"})}),Object(r.jsx)("a",{href:"https://www.linkedin.com/in/varun-dutia-a735a2153/",children:Object(r.jsx)("i",{className:"fab fa-linkedin icon"})})]}),"\xa9 ",(new Date).getFullYear()," | Varun Dutia | All Rights Reserved"]})})})}),j=c(5),d=[{title:"SKILLS",url:"#skills",cName:"nav-links"},{title:"PROJECTS",url:"#projects",cName:"nav-links"},{title:"INDUSTRY",url:"#experience",cName:"nav-links"},{title:"CONTACT",url:"#contact",cName:"nav-links"}],u=(c(31),function(){var e=Object(n.useState)(!1),t=Object(j.a)(e,2),c=t[0],a=t[1];return Object(r.jsxs)("nav",{className:"NavbarItems",children:[Object(r.jsx)("h1",{className:"navbar-logo",children:"Varun Dutia"}),Object(r.jsx)("div",{className:"menu-icon",onClick:function(){a(!c)},children:Object(r.jsx)("i",{className:c?"fas fa-times":"fas fa-bars"})}),Object(r.jsx)("ul",{className:c?"nav-menu active":"nav-menu",children:d.map((function(e,t){return Object(r.jsx)("li",{children:Object(r.jsx)("a",{className:e.cName,href:e.url,children:e.title})})}))})]})}),b=(c(32),c(33),function(e){var t=e.label,c=e.backgroundColor,a=void 0===c?"#e5e5e5":c,i=e.visualParts,s=void 0===i?[{percentage:"0%",color:"white"}]:i,o=Object(n.useState)(s.map((function(){return 0}))),l=Object(j.a)(o,2),d=l[0],u=l[1];return Object(n.useEffect)((function(){requestAnimationFrame((function(){u(s.map((function(e){return e.percentage})))}))}),[s]),Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("div",{children:t}),Object(r.jsx)("div",{className:"progressVisualFull",style:{backgroundColor:a},children:s.map((function(e,t){return Object(r.jsx)("div",{style:{width:d[t],backgroundColor:e.color},className:"progressVisualPart"},t)}))})]})}),f=function(){return Object(r.jsxs)("section",{id:"skills",children:[Object(r.jsx)("h1",{children:"My Skills"}),Object(r.jsxs)("div",{className:"skill-main",children:[Object(r.jsxs)("div",{className:"bar1",children:[Object(r.jsx)(b,{label:"C++",backgroundColor:"#ffff",visualParts:[{percentage:"70%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"Java",backgroundColor:"#ffff",visualParts:[{percentage:"60%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"Python",backgroundColor:"#ffff",visualParts:[{percentage:"60%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"Android",backgroundColor:"#ffff",visualParts:[{percentage:"80%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"React",backgroundColor:"#ffff",visualParts:[{percentage:"50%",color:"#102e37"}]})]}),Object(r.jsxs)("div",{className:"bar2",children:[Object(r.jsx)(b,{label:"Flask",backgroundColor:"#ffff",visualParts:[{percentage:"70%",color:"#102e37"}]}),Object(r.jsx)(b,{label:".Net",backgroundColor:"#ffff",visualParts:[{percentage:"60%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"HTML",backgroundColor:"#ffff",visualParts:[{percentage:"70%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"CSS",backgroundColor:"#ffff",visualParts:[{percentage:"60%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"NodeJS",backgroundColor:"#ffff",visualParts:[{percentage:"70%",color:"#102e37"}]})]})]})]})},h=(c(34),c(19)),O=c.n(h),m=(c(53),function(e){return Object(r.jsx)("a",{href:e.url,children:Object(r.jsx)("div",{className:"card",style:{width:e.width},children:Object(r.jsxs)("div",{className:"card-body",children:[Object(r.jsx)("h2",{children:e.title}),Object(r.jsx)("p",{children:e.description}),Object(r.jsx)("h5",{children:e.id})]})})})}),p=function(){var e=Object(n.useState)([]),t=Object(j.a)(e,2),c=t[0],a=t[1];return Object(n.useEffect)((function(){O.a.get("https://api.github.com/users/varundutia/starred").then((function(e){var t=e.data;a(t)}))}),[]),Object(r.jsxs)("section",{id:"projects",children:[Object(r.jsx)("h1",{children:"My Projects"}),Object(r.jsx)("div",{className:"row",children:c.map((function(e,t){return Object(r.jsx)("div",{className:"column",children:Object(r.jsx)(m,{title:e.name,description:e.description,id:e.owner.id,url:e.html_url,width:"100%"})})}))})]})},x=(c(54),[{title:"Technology Founding Member - Metta Studio",description:"Metta Studio is a Yoga / Meditation startup where teachers can book slots and teach students. Health Cafe and Sound Station is also included in the Mobile Application",skills:"Android, React-Native, Nodejs, MySQL, AWS"},{title:"Android Development Intern - Play And Shine",description:"a dynamic non-profit pan India initiative functioning at the grass root level. We work with communities to inspire and empower people to come together and create a holistic environment to enhance the spirit of learning and development",skills:"Android, Firebase"},{title:"Python And Web Development Intern - BeyondX",description:"Technology and Food",skills:"Flask, HTML, CSS, Bootstrap, Php, Nodejs"}]),v=function(){return Object(r.jsxs)("section",{id:"experience",children:[Object(r.jsx)("h1",{children:"Experience"}),Object(r.jsx)("div",{children:x.map((function(e,t){return Object(r.jsx)(m,{title:e.title,description:e.description,id:e.skills,width:"90%"})}))})]})};var g=function(){return Object(r.jsxs)("div",{className:"App",children:[Object(r.jsx)(u,{}),Object(r.jsx)(o,{}),Object(r.jsx)(f,{}),Object(r.jsx)(p,{}),Object(r.jsx)(v,{}),Object(r.jsx)(l,{})]})};i.a.render(Object(r.jsx)(g,{}),document.getElementById("root"))}},[[55,1,2]]]);
//# sourceMappingURL=main.bdcf6a24.chunk.js.map