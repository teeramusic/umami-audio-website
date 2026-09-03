import{j as n}from"./react-vendor-SGJwu1ew.js";const r=({size:a=56})=>{const t=[0,1,2];return n.jsxs("span",{"aria-hidden":"true","data-uma-emblem":"",style:{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",width:a,height:a,borderRadius:a*.32,background:"var(--color-warning-tint, rgba(255,159,10,0.12))",boxShadow:"inset 0 0 0 1px rgba(255,159,10,0.25)",flex:"0 0 auto"},children:[n.jsx("span",{style:{position:"absolute",inset:0,borderRadius:a*.32,boxShadow:"0 0 0 0 rgba(255,159,10,0.35)",animation:"umaMaintHalo 2.8s ease-in-out infinite"}}),n.jsx("span",{style:{display:"flex",alignItems:"flex-end",gap:a*.06,height:a*.42},children:t.map(e=>n.jsx("span",{style:{width:a*.08,height:"100%",borderRadius:999,background:"var(--color-warning, #FF9F0A)",transformOrigin:"bottom",animation:`umaMaintBar 1.8s ease-in-out ${e*.22}s infinite`}},e))}),n.jsx("style",{children:`
        @keyframes umaMaintBar {
          0%, 100% { transform: scaleY(0.4); opacity: 0.65; }
          50%      { transform: scaleY(1);   opacity: 1; }
        }
        @keyframes umaMaintHalo {
          0%   { box-shadow: 0 0 0 0 rgba(255,159,10,0.30); }
          70%  { box-shadow: 0 0 0 10px rgba(255,159,10,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,159,10,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-uma-emblem] * { animation: none !important; }
        }
      `})]})};export{r as M};
