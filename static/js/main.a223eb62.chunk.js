(this.webpackJsonpportfolio=this.webpackJsonpportfolio||[]).push([[0],{25:function(e,t,n){},26:function(e,t,n){},27:function(e,t,n){},30:function(e,t,n){},31:function(e,t,n){},32:function(e,t,n){},33:function(e,t,n){},34:function(e,t,n){},53:function(e,t,n){},54:function(e,t,n){},55:function(e,t,n){"use strict";n.r(t);var c=n(1),i=n(18),a=n.n(i),s=(n(25),n(26),n(27),n(20)),r=n(0),o=function(){return Object(r.jsxs)("div",{className:"about-main",children:[Object(r.jsx)("h1",{children:"Varun Dutia"}),Object(r.jsx)(s.a,{steps:["A",1e3,"A Developer!",500],loop:1,wrapper:"h1"})]})},l=(n(30),function(){return Object(r.jsx)("section",{id:"contact",children:Object(r.jsx)("footer",{className:"footer-main",children:Object(r.jsxs)("div",{className:"footer-content",children:[Object(r.jsx)("h2",{children:"Contact Me"}),"8220618104 | ",Object(r.jsx)("a",{href:"mailto:varundutia.h@gmail.com",children:"varundutia.h@gmail.com"}),Object(r.jsxs)("div",{className:"footer-icons",children:[Object(r.jsx)("a",{href:"https://www.instagram.com/varundutia_/",children:Object(r.jsx)("i",{className:"fab fa-instagram icon"})}),Object(r.jsx)("a",{href:"https://github.com/varundutia",children:Object(r.jsx)("i",{className:"fab fa-github icon"})}),Object(r.jsx)("a",{href:"https://www.linkedin.com/in/varun-dutia-a735a2153/",children:Object(r.jsx)("i",{className:"fab fa-linkedin icon"})})]}),"\xa9 ",(new Date).getFullYear()," | Varun Dutia | All Rights Reserved"]})})})}),d=n(5),j=[{title:"SKILLS",url:"#skills",cName:"nav-links"},{title:"PROJECTS",url:"#projects",cName:"nav-links"},{title:"INDUSTRY",url:"#experience",cName:"nav-links"},{title:"CONTACT",url:"#contact",cName:"nav-links"}],u=(n(31),function(){var e=Object(c.useState)(!1),t=Object(d.a)(e,2),n=t[0],i=t[1];return Object(r.jsxs)("nav",{className:"NavbarItems",children:[Object(r.jsx)("h1",{className:"navbar-logo",children:"Varun Dutia"}),Object(r.jsx)("div",{className:"menu-icon",onClick:function(){i(!n)},children:Object(r.jsx)("i",{className:n?"fas fa-times":"fas fa-bars"})}),Object(r.jsx)("ul",{className:n?"nav-menu active":"nav-menu",children:j.map((function(e,t){return Object(r.jsx)("li",{children:Object(r.jsx)("a",{className:e.cName,href:e.url,children:e.title})})}))})]})}),b=(n(32),n(33),function(e){var t=e.label,n=e.backgroundColor,i=void 0===n?"#e5e5e5":n,a=e.visualParts,s=void 0===a?[{percentage:"0%",color:"white"}]:a,o=Object(c.useState)(s.map((function(){return 0}))),l=Object(d.a)(o,2),j=l[0],u=l[1];return Object(c.useEffect)((function(){requestAnimationFrame((function(){u(s.map((function(e){return e.percentage})))}))}),[s]),Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("div",{children:t}),Object(r.jsx)("div",{className:"progressVisualFull",style:{backgroundColor:i},children:s.map((function(e,t){return Object(r.jsx)("div",{style:{width:j[t],backgroundColor:e.color},className:"progressVisualPart"},t)}))})]})}),f=function(){return Object(r.jsxs)("section",{id:"skills",children:[Object(r.jsx)("h1",{children:"My Skills"}),Object(r.jsxs)("div",{className:"skill-main",children:[Object(r.jsxs)("div",{className:"bar1",children:[Object(r.jsx)(b,{label:"C++",backgroundColor:"#ffff",visualParts:[{percentage:"70%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"Java",backgroundColor:"#ffff",visualParts:[{percentage:"60%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"Python",backgroundColor:"#ffff",visualParts:[{percentage:"60%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"Android",backgroundColor:"#ffff",visualParts:[{percentage:"80%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"React",backgroundColor:"#ffff",visualParts:[{percentage:"50%",color:"#102e37"}]})]}),Object(r.jsxs)("div",{className:"bar2",children:[Object(r.jsx)(b,{label:"Flask",backgroundColor:"#ffff",visualParts:[{percentage:"70%",color:"#102e37"}]}),Object(r.jsx)(b,{label:".Net",backgroundColor:"#ffff",visualParts:[{percentage:"60%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"HTML",backgroundColor:"#ffff",visualParts:[{percentage:"70%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"CSS",backgroundColor:"#ffff",visualParts:[{percentage:"60%",color:"#102e37"}]}),Object(r.jsx)(b,{label:"NodeJS",backgroundColor:"#ffff",visualParts:[{percentage:"70%",color:"#102e37"}]})]})]})]})},h=(n(34),n(19)),p=n.n(h),O=(n(53),function(e){return Object(r.jsx)("a",{href:e.url,children:Object(r.jsx)("div",{className:"card",style:{width:e.width},children:Object(r.jsxs)("div",{className:"card-body",children:[Object(r.jsx)("h2",{children:e.title}),Object(r.jsx)("p",{children:e.description}),Object(r.jsx)("h5",{children:e.id})]})})})}),m=function(){var e=Object(c.useState)([]),t=Object(d.a)(e,2),n=t[0],i=t[1];return Object(c.useEffect)((function(){p.a.get("https://api.github.com/users/varundutia/starred").then((function(e){var t=e.data;i(t)}))}),[]),Object(r.jsxs)("section",{id:"projects",children:[Object(r.jsx)("h1",{children:"My Projects"}),Object(r.jsx)("div",{className:"row",children:n.map((function(e,t){return Object(r.jsx)("div",{className:"column",children:Object(r.jsx)(O,{title:e.name,description:e.description,id:e.owner.id,url:e.html_url,width:"100%"})})}))})]})},x=(n(54),[{title:"Project Engineer - Wipro",description:"Wipro Limited is an Indian multinational corporation that provides IT, consulting and business process service.",skills:"SAP SD functional consultant"},{title:"Technology Founding Member - Metta Studio",description:"Metta Studio is a Yoga / Meditation startup where teachers can book slots and teach students. Health Cafe and Sound Station is also included in the Mobile Application",skills:"Android, React-Native, Nodejs, MySQL, AWS"},{title:"Android Development Intern - Play And Shine",description:"a dynamic non-profit pan India initiative functioning at the grass root level. We work with communities to inspire and empower people to come together and create a holistic environment to enhance the spirit of learning and development",skills:"Android, Firebase"},{title:"Python And Web Development Intern - BeyondX",description:"Technology and Food",skills:"Flask, HTML, CSS, Bootstrap, Php, Nodejs"}]),v=function(){return Object(r.jsxs)("section",{id:"experience",children:[Object(r.jsx)("h1",{children:"Experience"}),Object(r.jsx)("div",{children:x.map((function(e,t){return Object(r.jsx)(O,{title:e.title,description:e.description,id:e.skills,width:"90%"})}))})]})};var g=function(){return Object(r.jsxs)("div",{className:"App",children:[Object(r.jsx)(u,{}),Object(r.jsx)(o,{}),Object(r.jsx)(f,{}),Object(r.jsx)(m,{}),Object(r.jsx)(v,{}),Object(r.jsx)(l,{})]})};a.a.render(Object(r.jsx)(g,{}),document.getElementById("root"))}},[[55,1,2]]]);
//# sourceMappingURL=main.a223eb62.chunk.js.map