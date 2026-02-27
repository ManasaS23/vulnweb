/**
 * SecureBank — Intentionally Vulnerable Express Backend
 * Full original UI restored: navy/gold banking aesthetic on every route
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Intentional: CORS wildcard + version disclosure
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("X-Powered-By", "SecureBank/2.3.1 PHP/7.4 MySQL/5.7");
  next();
});

// ── SHARED UI PRIMITIVES ──────────────────────────────────────────
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">`;

const CSS = `<style>
:root{--navy:#1a3c5e;--navy2:#0f2740;--gold:#c9a84c;--bg:#f0f4f8;--white:#fff;--card:#fff;--border:#dce3ed;--text:#1e2d3d;--muted:#637484;--red:#dc2626;--green:#16a34a;--shadow:0 2px 16px rgba(26,60,94,.10);--shadow-lg:0 8px 40px rgba(26,60,94,.18);}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);font-size:15px;line-height:1.6;min-height:100vh;}
body.login-page{background:linear-gradient(135deg,#0f2740,#1a3c5e 50%,#0f3460);display:flex;align-items:center;justify-content:center;}
body.login-page::before{content:'';position:fixed;inset:0;background:radial-gradient(circle at 20% 50%,rgba(201,168,76,.08),transparent 60%),radial-gradient(circle at 80% 20%,rgba(201,168,76,.06),transparent 50%);pointer-events:none;}
.login-wrapper{width:100%;max-width:420px;padding:1.5rem;position:relative;z-index:1;}
.login-brand{text-align:center;margin-bottom:2rem;}
.bank-logo{display:inline-flex;margin-bottom:.75rem;filter:drop-shadow(0 4px 16px rgba(201,168,76,.3));}
.bank-name{font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:#fff;letter-spacing:1px;}
.bank-tagline{color:rgba(255,255,255,.5);font-size:.82rem;letter-spacing:1.5px;text-transform:uppercase;margin-top:.2rem;}
.login-card{background:var(--white);border-radius:16px;padding:2.5rem;box-shadow:var(--shadow-lg);}
.login-card h2{font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--navy);margin-bottom:.3rem;}
.login-sub{color:var(--muted);font-size:.9rem;margin-bottom:2rem;}
.form-group{margin-bottom:1.2rem;}
.form-group label{display:block;font-size:.82rem;font-weight:600;color:var(--navy);margin-bottom:.4rem;}
.form-group input,.form-group select,.form-group textarea{width:100%;border:1.5px solid var(--border);border-radius:8px;padding:.65rem .9rem;font-family:'DM Sans',sans-serif;font-size:.9rem;color:var(--text);background:#fafbfc;transition:border-color .2s,box-shadow .2s;outline:none;}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--navy);background:#fff;box-shadow:0 0 0 3px rgba(26,60,94,.08);}
.form-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;}
.checkbox-label{display:flex;align-items:center;gap:.4rem;font-size:.85rem;color:var(--muted);cursor:pointer;}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
.form-grid .full-width{grid-column:1/-1;}
.btn-primary{background:var(--navy);color:#fff;border:none;border-radius:8px;padding:.75rem 1.5rem;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:600;cursor:pointer;transition:background .2s,transform .1s;text-decoration:none;display:inline-block;}
.btn-primary:hover{background:var(--navy2);}
.btn-full{width:100%;text-align:center;}
.btn-secondary{background:transparent;color:var(--navy);border:1.5px solid var(--navy);border-radius:8px;padding:.65rem 1.2rem;font-family:'DM Sans',sans-serif;font-size:.88rem;font-weight:600;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-block;}
.btn-secondary:hover{background:var(--navy);color:#fff;}
.btn-danger-sm{background:var(--red);color:#fff;border:none;border-radius:6px;padding:.4rem .9rem;font-size:.8rem;font-weight:600;cursor:pointer;}
.link{color:var(--navy);font-size:.85rem;font-weight:500;text-decoration:none;}
.link:hover{color:var(--gold);text-decoration:underline;}
.security-notice{text-align:center;font-size:.78rem;color:var(--muted);margin-top:1.5rem;}
.login-error{background:#fef2f2;border:1px solid #fecaca;color:var(--red);border-radius:8px;padding:.75rem 1rem;font-size:.88rem;margin-top:1rem;}
.login-footer{text-align:center;margin-top:1.5rem;font-size:.88rem;color:var(--muted);}
.login-footer a{color:var(--navy);font-weight:600;text-decoration:none;margin-left:.3rem;}
.navbar{background:var(--navy);height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;box-shadow:0 2px 12px rgba(15,39,64,.3);position:sticky;top:0;z-index:100;}
.nav-brand{display:flex;align-items:center;gap:.6rem;font-family:'Playfair Display',serif;font-size:1.2rem;color:#fff;font-weight:600;text-decoration:none;}
.nav-links{display:flex;gap:.25rem;}
.nav-link{color:rgba(255,255,255,.65);text-decoration:none;padding:.4rem .9rem;border-radius:6px;font-size:.88rem;font-weight:500;transition:all .2s;}
.nav-link:hover,.nav-link.active{background:rgba(255,255,255,.1);color:#fff;}
.admin-link{color:var(--gold)!important;}
.nav-user{display:flex;align-items:center;gap:.8rem;}
.user-avatar{width:36px;height:36px;border-radius:50%;background:var(--gold);color:var(--navy);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;}
.user-name{color:#fff;font-size:.88rem;font-weight:600;}
.user-acct{color:rgba(255,255,255,.5);font-size:.75rem;}
.btn-logout{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.8);padding:.35rem .9rem;border-radius:6px;cursor:pointer;font-size:.82rem;transition:all .2s;text-decoration:none;}
.btn-logout:hover{background:var(--red);border-color:var(--red);color:#fff;}
.dash-layout{display:grid;grid-template-columns:240px 1fr;min-height:calc(100vh - 60px);}
.sidebar{background:var(--white);border-right:1px solid var(--border);padding:1.5rem 0;position:sticky;top:60px;height:calc(100vh - 60px);overflow-y:auto;}
.sidebar-section{margin-bottom:1.5rem;}
.sidebar-label{font-size:.7rem;font-weight:700;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;padding:0 1.2rem;margin-bottom:.5rem;}
.sidebar-link{display:block;padding:.5rem 1.2rem;color:var(--muted);font-size:.88rem;text-decoration:none;transition:all .15s;border-left:3px solid transparent;}
.sidebar-link:hover{background:#f5f8fc;color:var(--navy);border-left-color:var(--gold);}
.sidebar-link.active{background:#f0f4f8;color:var(--navy);border-left-color:var(--navy);}
.dash-main{padding:2rem;background:var(--bg);}
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;}
.section-header h2{font-family:'Playfair Display',serif;font-size:1.6rem;color:var(--navy);}
.date-badge{background:var(--white);border:1px solid var(--border);border-radius:8px;padding:.4rem .9rem;font-size:.82rem;color:var(--muted);}
.card{background:var(--card);border-radius:12px;padding:1.5rem;box-shadow:var(--shadow);border:1px solid var(--border);margin-bottom:1.5rem;}
.card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
.card-header h3{font-size:1rem;font-weight:700;color:var(--navy);}
.accounts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.2rem;margin-bottom:1.5rem;}
.account-card{border-radius:14px;padding:1.5rem;position:relative;overflow:hidden;color:#fff;transition:transform .2s,box-shadow .2s;}
.account-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg);}
.account-card.checking{background:linear-gradient(135deg,#1a3c5e,#2563eb);}
.account-card.savings{background:linear-gradient(135deg,#0f2740,#c9a84c);}
.account-card.credit{background:linear-gradient(135deg,#7c1d1d,#dc2626);}
.account-card::after{content:'';position:absolute;right:-20px;top:-20px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.06);}
.ac-type{font-size:.75rem;font-weight:700;letter-spacing:2px;opacity:.7;text-transform:uppercase;}
.ac-num{font-family:'DM Mono',monospace;font-size:.9rem;margin:.5rem 0;opacity:.9;letter-spacing:1px;}
.ac-bal{font-size:2rem;font-weight:700;font-family:'Playfair Display',serif;}
.ac-label{font-size:.78rem;opacity:.6;margin-top:.25rem;}
.tx-item{display:flex;align-items:center;gap:1rem;padding:.85rem 0;border-bottom:1px solid #f0f4f8;}
.tx-item:last-child{border-bottom:none;}
.tx-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;}
.tx-icon.debit{background:#fef2f2;}.tx-icon.credit{background:#f0fdf4;}
.tx-info{flex:1;}.tx-desc{font-size:.9rem;font-weight:600;color:var(--text);}
.tx-date{font-size:.78rem;color:var(--muted);}
.tx-amt{font-family:'DM Mono',monospace;font-weight:700;font-size:.95rem;}
.tx-amt.debit{color:var(--red);}.tx-amt.credit{color:var(--green);}
.data-table{width:100%;border-collapse:collapse;font-size:.85rem;}
.data-table th{background:#f8fafc;padding:.65rem 1rem;text-align:left;font-size:.75rem;font-weight:700;color:var(--muted);letter-spacing:.8px;text-transform:uppercase;border-bottom:2px solid var(--border);}
.data-table td{padding:.7rem 1rem;border-bottom:1px solid #f0f4f8;color:var(--text);}
.data-table tr:hover td{background:#fafbfc;}
.mono{font-family:'DM Mono',monospace;font-size:.8rem;}
.sensitive{color:var(--red);font-family:'DM Mono',monospace;font-size:.8rem;}
.profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;}
.profile-field{background:#f8fafc;border-radius:8px;padding:.8rem 1rem;border:1px solid var(--border);}
.profile-field label{font-size:.72rem;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:.25rem;display:block;}
.profile-field .pf-val{font-size:.92rem;color:var(--text);font-weight:500;}
.profile-field.sensitive .pf-val{font-family:'DM Mono',monospace;color:var(--red);font-size:.85rem;}
.alert{border-radius:8px;padding:.75rem 1rem;font-size:.88rem;margin:1rem 0;}
.alert.success{background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d;}
.alert.error{background:#fef2f2;border:1px solid #fecaca;color:var(--red);}
.alert.info{background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8;}
.badge-danger{background:#fef2f2;color:var(--red);border:1px solid #fecaca;border-radius:5px;padding:.25rem .7rem;font-size:.75rem;font-weight:600;}
.info-note{background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:.7rem 1rem;font-size:.82rem;color:#1d4ed8;margin-bottom:1rem;}
.danger-note{background:#fff7ed;border-color:#fed7aa;color:#c2410c;}
.admin-warning{background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:.75rem 1.2rem;color:#c2410c;font-size:.88rem;margin-bottom:1.5rem;}
.code-out{background:#0f1117;border:1px solid #2d3748;border-radius:8px;padding:1rem;font-family:'DM Mono',monospace;font-size:.8rem;color:#68d391;line-height:1.7;white-space:pre-wrap;max-height:300px;overflow-y:auto;}
.sys-info{display:flex;flex-direction:column;}
.sys-row{display:flex;justify-content:space-between;padding:.65rem 0;border-bottom:1px solid #f0f4f8;font-size:.88rem;}
.sys-row:last-child{border-bottom:none;}
.sys-row span:first-child{color:var(--muted);font-weight:600;font-size:.82rem;}
.sys-row span:last-child{font-family:'DM Mono',monospace;font-size:.82rem;}
.result-card{background:#f8fafc;border:1px solid var(--border);border-radius:10px;padding:1rem 1.2rem;margin-top:.75rem;}
.rc-row{display:flex;justify-content:space-between;padding:.4rem 0;font-size:.88rem;border-bottom:1px solid #eef2f7;}
.rc-row:last-child{border-bottom:none;}
.rc-label{color:var(--muted);font-weight:600;font-size:.8rem;}
.rc-val{font-family:'DM Mono',monospace;font-size:.82rem;}
.rc-val.red{color:var(--red);}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}
</style>`;

const LOGO = (size=32) => `<svg width="${size}" height="${size}" viewBox="0 0 42 42" fill="none"><rect width="42" height="42" rx="${size>36?10:8}" fill="#1a3c5e"/><path d="M21 6L36 14V16H6V14L21 6Z" fill="#c9a84c"/><rect x="9" y="18" width="4" height="14" fill="#c9a84c"/><rect x="16" y="18" width="4" height="14" fill="#c9a84c"/><rect x="23" y="18" width="4" height="14" fill="#c9a84c"/><rect x="30" y="18" width="4" height="14" fill="#c9a84c"/><rect x="6" y="33" width="30" height="3" fill="#c9a84c"/></svg>`;

const head = (title) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title} — SecureBank</title><meta name="generator" content="SecureBank v2.3.1 (PHP/7.4, MySQL/5.7)"><meta name="author" content="SecureBank IT Dept — admin@securebank.local"><!-- TODO: DB credentials mysql://sbadmin:Passw0rd!@db.securebank.local/securebank_prod --><!-- Test creds: guest/guest123 -->${FONTS}${CSS}<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script></head>`;

const navbar = (name="John Doe", acct="ACC-001", active="") => {
  const links = [{h:"/dashboard",l:"Accounts",k:"accounts"},{h:"/transfer",l:"Transfer",k:"transfer"},{h:"/search",l:"History",k:"history"},{h:"/profile",l:"Profile",k:"profile"},{h:"/tickets",l:"Support",k:"support"},{h:"/admin",l:"Admin",k:"admin",c:"admin-link"}];
  const ini = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return `<nav class="navbar"><a href="/dashboard" class="nav-brand">${LOGO(32)}<span>SecureBank</span></a><div class="nav-links">${links.map(l=>`<a href="${l.h}" class="nav-link ${l.c||""} ${active===l.k?"active":""}">${l.l}</a>`).join("")}</div><div class="nav-user"><div class="user-avatar">${ini}</div><div><div class="user-name">${name}</div><div class="user-acct">${acct}</div></div><a href="/logout" class="btn-logout">Logout</a></div></nav>`;
};

const sidebar = (active="") => {
  const links = [{h:"/dashboard",i:"🏠",l:"Overview",k:"accounts"},{h:"/transfer",i:"💸",l:"Transfer Money",k:"transfer"},{h:"/search",i:"📋",l:"Transaction History",k:"history"},{h:"/profile",i:"👤",l:"My Profile",k:"profile"},{h:"/tickets",i:"💬",l:"Customer Support",k:"support"},{h:"/admin",i:"⚙",l:"Admin Panel",k:"admin"}];
  return `<aside class="sidebar"><div class="sidebar-section"><div class="sidebar-label">Navigation</div>${links.map(l=>`<a href="${l.h}" class="sidebar-link ${active===l.k?"active":""}">${l.i} ${l.l}</a>`).join("")}</div></aside>`;
};

const fmt = n => n==null?"N/A":((n<0?"-$":"$")+Math.abs(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}));
const fmtDate = d => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const statusColor = s => s==="open"?"var(--red)":s==="resolved"?"var(--green)":"var(--muted)";

// ── DATABASE ──────────────────────────────────────────────────────
const DB = {
  users:[
    {id:1,username:"john.doe",   password:"password123",name:"John Doe",      email:"john.doe@email.com",    phone:"+1-555-201-4455",ssn:"287-54-9012",dob:"1985-03-14",credit_score:742,annual_income:87500, role:"customer",accounts:["ACC-001","ACC-002"]},
    {id:2,username:"sarah.miller",password:"sarah2024", name:"Sarah Miller",  email:"s.miller@gmail.com",    phone:"+1-555-302-7788",ssn:"391-22-8844",dob:"1990-07-22",credit_score:818,annual_income:126000,role:"customer",accounts:["ACC-003","ACC-004"]},
    {id:3,username:"carlos.ruiz",password:"ruiz#9900",  name:"Carlos Ruiz",   email:"carlos.r@outlook.com",  phone:"+1-555-490-3312",ssn:"522-67-1103",dob:"1978-11-30",credit_score:671,annual_income:62000, role:"customer",accounts:["ACC-005"]},
    {id:4,username:"priya.sharma",password:"Priya@1234",name:"Priya Sharma",  email:"priya.sharma@corp.com", phone:"+1-555-611-9900",ssn:"445-90-2278",dob:"1993-05-08",credit_score:795,annual_income:145000,role:"customer",accounts:["ACC-006","ACC-007"]},
    {id:5,username:"admin",      password:"Admin@2024!",name:"Bank Admin",    email:"admin@securebank.local",phone:"+1-555-000-0001",ssn:"000-00-0000",dob:"1970-01-01",credit_score:850,annual_income:250000,role:"admin",   accounts:["ACC-ADM"]},
    {id:6,username:"guest",      password:"guest123",   name:"Guest User",    email:"guest@securebank.local",phone:"N/A",            ssn:"N/A",         dob:"N/A",        credit_score:0,  annual_income:0,     role:"guest",   accounts:[]},
    {id:7,username:"linda.chen", password:"lchen!456",  name:"Linda Chen",    email:"linda.chen@techcorp.io",phone:"+1-555-733-2244",ssn:"634-11-7799",dob:"1988-09-17",credit_score:760,annual_income:198000,role:"customer",accounts:["ACC-008"]},
    {id:8,username:"david.okafor",password:"Dav1d@ok", name:"David Okafor",  email:"d.okafor@business.ng",  phone:"+1-555-852-6610",ssn:"789-33-5566",dob:"1982-12-03",credit_score:703,annual_income:94000, role:"customer",accounts:["ACC-009","ACC-010"]},
  ],
  accounts:[
    {id:"ACC-001",owner_id:1,type:"checking",balance:12450.88,routing:"021000021",status:"active"},
    {id:"ACC-002",owner_id:1,type:"savings", balance:34200.00,routing:"021000021",status:"active"},
    {id:"ACC-003",owner_id:2,type:"checking",balance:8770.55, routing:"021000021",status:"active"},
    {id:"ACC-004",owner_id:2,type:"savings", balance:92100.30,routing:"021000021",status:"active"},
    {id:"ACC-005",owner_id:3,type:"checking",balance:3301.44, routing:"021000021",status:"active"},
    {id:"ACC-006",owner_id:4,type:"checking",balance:21880.00,routing:"021000021",status:"active"},
    {id:"ACC-007",owner_id:4,type:"savings", balance:187500.75,routing:"021000021",status:"active"},
    {id:"ACC-ADM",owner_id:5,type:"checking",balance:999999.00,routing:"021000021",status:"active"},
    {id:"ACC-008",owner_id:7,type:"savings", balance:254300.60,routing:"021000021",status:"active"},
    {id:"ACC-009",owner_id:8,type:"checking",balance:6440.22, routing:"021000021",status:"active"},
    {id:"ACC-010",owner_id:8,type:"credit",  balance:-4320.00,routing:"021000021",status:"active",credit_limit:15000},
  ],
  transactions:[
    {id:"TXN-0001",account_id:"ACC-001",type:"debit", amount:85.50,  description:"Amazon.com Purchase",       date:"2024-11-20",note:"Online Shopping"},
    {id:"TXN-0002",account_id:"ACC-001",type:"credit",amount:3500.00,description:"Payroll — TechCorp Inc",    date:"2024-11-15",note:"November salary"},
    {id:"TXN-0003",account_id:"ACC-001",type:"debit", amount:1200.00,description:"Rent — Oak Properties LLC", date:"2024-11-01",note:"Monthly rent"},
    {id:"TXN-0004",account_id:"ACC-002",type:"credit",amount:500.00, description:"Transfer from ACC-001",     date:"2024-11-10",note:"Monthly savings"},
    {id:"TXN-0005",account_id:"ACC-003",type:"debit", amount:2200.00,description:"Wire Transfer — Sarah Miller",date:"2024-11-18",note:""},
    {id:"TXN-0006",account_id:"ACC-005",type:"debit", amount:450.00, description:"Electric Bill — FPL",       date:"2024-11-12",note:""},
    {id:"TXN-0007",account_id:"ACC-007",type:"credit",amount:50000.00,description:"Stock Sale — AAPL",        date:"2024-11-08",note:"Long-term gain"},
  ],
  tickets:[
    {id:"TKT-001",user_id:1,subject:"Login issue",           message:"I cannot login from mobile.",                  status:"open"},
    {id:"TKT-002",user_id:2,subject:"Transfer limit",         message:"Please raise my limit to $25,000.",           status:"resolved"},
    {id:"TKT-003",user_id:3,subject:"Suspicious transaction", message:"Unauthorized charge. My SSN: 522-67-1103.",    status:"open"},
    {id:"TKT-004",user_id:4,subject:"Wire transfer",          message:"Wire to HDFC Bank account 5091234567.",        status:"closed"},
    {id:"TKT-005",user_id:7,subject:"Statement request",      message:"Need 12 months of statements for tax filing.", status:"open"},
  ],
};

const SESSIONS = {};
const createSession = u => { const t=`SB_SESS_${u.id}_${Date.now()}`; SESSIONS[t]={user_id:u.id,role:u.role}; return t; };
const getUser = req => { const t=req.headers["authorization"]?.replace("Bearer ","")||req.headers["cookie"]?.match(/sb_token=([^;]+)/)?.[1]; if(!t||!SESSIONS[t])return null; return DB.users.find(u=>u.id===SESSIONS[t].user_id)??null; };
const sqliTest = s => [/'\s*or\s*/i,/--/,/1=1/,/union.*select/i,/'\s*#/,/admin'--/i,/'\s*;/,/drop\s+table/i].some(p=>p.test(s));

// ── ROUTES ────────────────────────────────────────────────────────

// LOGIN PAGE
app.get("/", (req,res) => {
  const e = req.query.error ?? "";
  res.send(`${head("Login")}<body class="login-page">
<div class="login-wrapper">
  <div class="login-brand"><div class="bank-logo">${LOGO(48)}</div>
    <div class="bank-name">SecureBank</div>
    <div class="bank-tagline">Trusted Banking Since 1987</div>
  </div>
  <div class="login-card">
    <h2>Online Banking Login</h2>
    <p class="login-sub">Access your accounts securely</p>
    <form action="/api/login" method="POST">
      <div class="form-group"><label>Customer ID / Username</label>
        <input type="text" name="username" placeholder="Enter your username" autocomplete="off"></div>
      <div class="form-group"><label>Password</label>
        <input type="password" name="password" placeholder="Enter your password"></div>
      <input type="hidden" name="remember_token" value="">
      <div class="form-row">
        <label class="checkbox-label"><input type="checkbox"> Remember me</label>
        <a href="#" class="link">Forgot password?</a>
      </div>
      <button type="submit" class="btn-primary btn-full">Sign In</button>
    </form>
    ${e ? `<div class="login-error">${e}</div>` : ""}
    <div class="security-notice">🔒 Your connection is protected by 128-bit SSL encryption</div>
  </div>
</div>
<div style="display:none;">
  <a href="/api/account?id=ACC-001">acct</a><a href="/api/user?id=1">user</a>
  <a href="/api/transactions?account_id=ACC-001&search=">txn</a>
  <a href="/api/ticket?id=TKT-001">ticket</a><a href="/admin">admin</a>
  <a href="/transfer">transfer</a><a href="/ping">ping</a><a href="/debug">debug</a>
  <a href="/search?q=">search</a><a href="/tickets">tickets</a>
</div>
</body></html>`);
});

// LOGIN API
app.post("/api/login", (req,res) => {
  const {username="",password=""} = req.body;
  console.log(`[AUTH] username="${username}" password="${password}"`);
  let user = sqliTest(username)||sqliTest(password)
    ? (username.toLowerCase().includes("admin") ? DB.users.find(u=>u.role==="admin") : DB.users[0])
    : DB.users.find(u=>u.username===username&&u.password===password);
  if (!user) {
    const exists = DB.users.some(u=>u.username===username);
    const msg = exists ? `Incorrect password for "${username}"` : `No account found for "${username}"`;
    if (req.headers["content-type"]?.includes("urlencoded")) return res.redirect(`/?error=${encodeURIComponent(msg)}`);
    return res.status(401).json({error:msg});
  }
  const token = createSession(user);
  res.setHeader("Set-Cookie",`sb_token=${token}; Path=/; SameSite=None`);
  if (req.headers["content-type"]?.includes("urlencoded")) return res.redirect("/dashboard");
  return res.json({token, user:{id:user.id,name:user.name,role:user.role,accounts:user.accounts}});
});

app.get("/logout",(req,res) => { res.setHeader("Set-Cookie","sb_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"); res.redirect("/"); });

// DASHBOARD
app.get("/dashboard", (req,res) => {
  const user = getUser(req)??DB.users[0];
  const accts = DB.accounts.filter(a=>user.accounts.includes(a.id));
  const txs   = DB.transactions.filter(t=>user.accounts.includes(t.account_id)).slice(0,5);
  res.send(`${head("Dashboard")}<body>
${navbar(user.name,user.accounts[0]??"—","accounts")}
<div class="dash-layout">${sidebar("accounts")}<main class="dash-main">
  <div class="section-header"><h2>Account Overview</h2>
    <div class="date-badge">${new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
  </div>
  <div class="accounts-grid">
    ${accts.map(a=>`<div class="account-card ${a.type}">
      <div class="ac-type">${a.type} Account</div>
      <div class="ac-num">${a.id} · ···· ${a.routing.slice(-4)}</div>
      <div class="ac-bal">${fmt(a.balance)}</div>
      <div class="ac-label">Available Balance · USD</div>
    </div>`).join("")}
  </div>
  <div class="card"><div class="card-header"><h3>Recent Transactions</h3><a href="/search" class="link">View All</a></div>
    ${txs.map(t=>`<div class="tx-item">
      <div class="tx-icon ${t.type}">${t.type==="debit"?"⬆️":"⬇️"}</div>
      <div class="tx-info"><div class="tx-desc">${t.description}</div>
        <div class="tx-date">${fmtDate(t.date)} · ${t.account_id}</div></div>
      <div class="tx-amt ${t.type}">${t.type==="debit"?"-":"+"}${fmt(t.amount)}</div>
    </div>`).join("")}
  </div>
</main></div></body></html>`);
});

// TRANSACTION HISTORY + SEARCH (SQLi + Reflected XSS)
app.get("/search", (req,res) => {
  const user = getUser(req)??DB.users[0];
  const q    = req.query.q??"";
  const injected = sqliTest(q);
  const txs  = injected ? DB.transactions : DB.transactions.filter(t=>t.description.toLowerCase().includes(q.toLowerCase())||t.note.toLowerCase().includes(q.toLowerCase()));
  res.send(`${head("Transaction History")}<body>
${navbar(user.name,user.accounts[0]??"—","history")}
<div class="dash-layout">${sidebar("history")}<main class="dash-main">
  <div class="section-header"><h2>Transaction History</h2></div>
  <div class="card">
    <div class="card-header"><h3>Search Transactions</h3></div>
    <div class="info-note">Backend query: <code>SELECT * FROM transactions WHERE description LIKE '%${q}%'</code></div>
    <form action="/search" method="GET" style="display:flex;gap:1rem;align-items:flex-end;margin-bottom:1rem;">
      <div class="form-group" style="flex:1;margin:0;"><label>Search Description</label>
        <input type="text" name="q" value="${q}" placeholder="Try: ' OR 1=1-- or &lt;img src=x onerror=alert(1)&gt;"></div>
      <button type="submit" class="btn-secondary">Search</button>
    </form>
    ${injected?`<div class="info-note danger-note">⚠ SQL Injection — query altered. All ${DB.transactions.length} records from ALL accounts returned.</div>`:""}
    ${q&&!injected?`<p style="font-size:.88rem;color:var(--muted);margin-bottom:1rem;">Results for: <strong>${q}</strong></p>`:""}
    ${txs.map(t=>`<div class="tx-item">
      <div class="tx-icon ${t.type}">${t.type==="debit"?"⬆️":"⬇️"}</div>
      <div class="tx-info"><div class="tx-desc">${t.description}</div>
        <div class="tx-date">${fmtDate(t.date)} · ${t.account_id}</div>
        <div style="font-size:.78rem;color:#7c8fa0;">${t.note}</div></div>
      <div class="tx-amt ${t.type}">${t.type==="debit"?"-":"+"}${fmt(t.amount)}</div>
    </div>`).join("")||`<p style="color:var(--muted);font-size:.88rem;">No transactions found.</p>`}
  </div>
</main></div></body></html>`);
});

app.get("/api/transactions",(req,res) => {
  const {account_id="",search=""} = req.query;
  if (sqliTest(search)||sqliTest(account_id)) return res.json({injected:true,data:DB.transactions});
  res.json({data:DB.transactions.filter(t=>(account_id?t.account_id===account_id:true)&&(search?t.description.toLowerCase().includes(search.toLowerCase()):true))});
});

// TRANSFER (Stored XSS + IDOR + no CSRF)
app.get("/transfer",(req,res) => {
  const user = getUser(req)??DB.users[0];
  const opts = DB.accounts.filter(a=>user.accounts.includes(a.id)).map(a=>`<option value="${a.id}">${a.id} — ${a.type} (${fmt(a.balance)})</option>`).join("");
  res.send(`${head("Transfer Money")}<body>
${navbar(user.name,user.accounts[0]??"—","transfer")}
<div class="dash-layout">${sidebar("transfer")}<main class="dash-main">
  <div class="section-header"><h2>Transfer Money</h2></div>
  <div class="card">
    <div class="card-header"><h3>New Transfer</h3></div>
    <form action="/api/transfer" method="POST">
      <div class="form-grid">
        <div class="form-group"><label>From Account</label><select name="from">${opts}</select></div>
        <div class="form-group"><label>To Account Number</label>
          <input type="text" name="to" placeholder="e.g. ACC-003, ACC-005..."></div>
        <div class="form-group"><label>Beneficiary Name</label>
          <input type="text" name="beneficiary" placeholder="Recipient full name"></div>
        <div class="form-group"><label>Amount (USD)</label>
          <input type="number" name="amount" placeholder="0.00" min="0"></div>
        <div class="form-group full-width"><label>Remarks / Note</label>
          <input type="text" name="note" placeholder="e.g. Rent payment (Stored XSS point)"></div>
      </div>
      <button type="submit" class="btn-primary" style="margin-top:.5rem;">Confirm Transfer</button>
    </form>
  </div>
  <div class="card">
    <div class="card-header"><h3>Account Lookup</h3></div>
    <div class="info-note">🔍 IDOR — no ownership check. Any account ID returns full PII.</div>
    <form action="/api/account" method="GET" style="display:flex;gap:1rem;align-items:flex-end;">
      <div class="form-group" style="flex:1;margin:0;"><label>Account ID</label>
        <input type="text" name="id" placeholder="Try ACC-001 through ACC-ADM"></div>
      <button type="submit" class="btn-secondary">Lookup</button>
    </form>
  </div>
</main></div></body></html>`);
});

app.post("/api/transfer",(req,res) => {
  const {from,to,amount,note,beneficiary} = req.body;
  const user = getUser(req)??DB.users[0];
  if (!from||!to||!amount) {
    return res.send(`${head("Transfer")}<body>${navbar(user.name,user.accounts[0]??"—","transfer")}<div class="dash-layout">${sidebar("transfer")}<main class="dash-main"><div class="section-header"><h2>Transfer Money</h2></div><div class="card"><div class="alert error">❌ Missing required fields.</div><a href="/transfer" class="btn-secondary" style="margin-top:1rem;display:inline-block;">← Back</a></div></main></div></body></html>`);
  }
  const fromAcct = DB.accounts.find(a=>a.id===from);
  if (!fromAcct||fromAcct.balance<parseFloat(amount)) {
    return res.send(`${head("Transfer")}<body>${navbar(user.name,user.accounts[0]??"—","transfer")}<div class="dash-layout">${sidebar("transfer")}<main class="dash-main"><div class="section-header"><h2>Transfer Money</h2></div><div class="card"><div class="alert error">❌ ${!fromAcct?"Account not found.":"Insufficient funds."}</div><a href="/transfer" class="btn-secondary" style="margin-top:1rem;display:inline-block;">← Back</a></div></main></div></body></html>`);
  }
  fromAcct.balance -= parseFloat(amount);
  const txId = `TXN-${String(DB.transactions.length+1).padStart(4,"0")}`;
  DB.transactions.push({id:txId,account_id:from,type:"debit",amount:parseFloat(amount),description:`Transfer to ${to} — ${beneficiary??""}`,date:new Date().toISOString().split("T")[0],note:note??""});
  // Reflected XSS: beneficiary + note echoed without escaping
  res.send(`${head("Transfer Confirmed")}<body>${navbar(user.name,user.accounts[0]??"—","transfer")}<div class="dash-layout">${sidebar("transfer")}<main class="dash-main">
  <div class="section-header"><h2>Transfer Money</h2></div>
  <div class="card"><div class="card-header"><h3>Transfer Confirmed</h3></div>
    <div class="alert success">✅ Transfer of ${fmt(parseFloat(amount))} to <strong>${beneficiary}</strong> (${to}) confirmed!<br>Transaction ID: <code>${txId}</code><br>Note: ${note}</div>
    <a href="/transfer" class="btn-secondary" style="margin-top:1rem;display:inline-block;">New Transfer</a>
  </div></main></div></body></html>`);
});

app.get("/api/account",(req,res) => {
  const acct = DB.accounts.find(a=>a.id===req.query.id);
  if (!acct) return res.status(404).json({error:"Account not found"});
  const owner = DB.users.find(u=>u.id===acct.owner_id);
  res.json({account:acct,owner:{name:owner?.name,email:owner?.email,phone:owner?.phone,ssn:owner?.ssn,dob:owner?.dob,credit_score:owner?.credit_score,annual_income:owner?.annual_income,password:owner?.password}});
});

// PROFILE (Sensitive data + Stored XSS)
app.get("/profile",(req,res) => {
  const user = getUser(req)??DB.users[0];
  res.send(`${head("My Profile")}<body>
${navbar(user.name,user.accounts[0]??"—","profile")}
<div class="dash-layout">${sidebar("profile")}<main class="dash-main">
  <div class="section-header"><h2>My Profile</h2></div>
  <div class="card">
    <div class="profile-grid">
      <div class="profile-field"><label>Full Name</label><div class="pf-val">${user.name}</div></div>
      <div class="profile-field"><label>Username</label><div class="pf-val">${user.username}</div></div>
      <div class="profile-field"><label>Email</label><div class="pf-val">${user.email}</div></div>
      <div class="profile-field"><label>Phone</label><div class="pf-val">${user.phone}</div></div>
      <div class="profile-field sensitive"><label>Date of Birth</label><div class="pf-val">${user.dob}</div></div>
      <div class="profile-field"><label>Address</label><div class="pf-val">142 Maple Street, Austin, TX</div></div>
      <div class="profile-field sensitive"><label>Social Security Number</label><div class="pf-val">${user.ssn}</div></div>
      <div class="profile-field sensitive"><label>Annual Income</label><div class="pf-val">${fmt(user.annual_income)}</div></div>
      <div class="profile-field sensitive"><label>Credit Score</label><div class="pf-val">${user.credit_score}</div></div>
      <div class="profile-field"><label>Role</label><div class="pf-val">${user.role}</div></div>
    </div>
    <hr style="border-color:#e5e9f0;margin:1.5rem 0;">
    <h4 style="margin-bottom:1rem;color:var(--navy);">Update Profile</h4>
    <form action="/api/profile" method="POST">
      <div class="form-grid">
        <div class="form-group"><label>Display Name</label><input type="text" name="name" value="${user.name}"></div>
        <div class="form-group"><label>Phone Number</label><input type="text" name="phone" value="${user.phone}"></div>
        <div class="form-group full-width"><label>Bio / Notes (Stored XSS point)</label>
          <textarea name="bio" rows="3">${user.bio??""}</textarea></div>
      </div>
      <button type="submit" class="btn-primary">Save Changes</button>
    </form>
  </div>
  <div class="card"><div class="card-header"><h3>Account Security Details</h3></div>
    <div class="info-note danger-note">⚠ Full user object returned by API — no field filtering:</div>
    <div class="code-out">${JSON.stringify({...user,note:"GET /api/user?id="+user.id+" — no auth required"},null,2)}</div>
  </div>
</main></div></body></html>`);
});

app.get("/api/user",(req,res) => {
  const user = DB.users.find(u=>u.id===parseInt(req.query.id));
  if (!user) return res.status(404).json({error:"User not found"});
  res.json({user});
});

app.post("/api/profile",(req,res) => {
  const user = getUser(req)??DB.users[0];
  const {name,phone,bio} = req.body;
  user.name=name; user.phone=phone; user.bio=bio;
  res.send(`${head("Profile Updated")}<body>
${navbar(user.name,user.accounts[0]??"—","profile")}
<div class="dash-layout">${sidebar("profile")}<main class="dash-main">
  <div class="section-header"><h2>My Profile</h2></div>
  <div class="card">
    <div class="alert success">✅ Profile updated! Welcome, ${name}</div>
    <div style="margin-top:1rem;padding:1rem;background:#f8fafc;border-radius:8px;border:1px solid var(--border);">
      <div style="font-size:.8rem;color:var(--muted);margin-bottom:.3rem;">YOUR BIO</div>
      <div>${bio}</div>
    </div>
    <a href="/profile" class="btn-secondary" style="margin-top:1rem;display:inline-block;">← Back to Profile</a>
  </div>
</main></div></body></html>`);
});

// SUPPORT TICKETS (Stored XSS + IDOR)
app.get("/tickets",(req,res) => {
  const user = getUser(req)??DB.users[0];
  const mine = DB.tickets.filter(t=>t.user_id===user.id);
  res.send(`${head("Support")}<body>
${navbar(user.name,user.accounts[0]??"—","support")}
<div class="dash-layout">${sidebar("support")}<main class="dash-main">
  <div class="section-header"><h2>Customer Support</h2></div>
  <div class="card"><div class="card-header"><h3>Submit a Ticket</h3></div>
    <form action="/api/ticket" method="POST">
      <div class="form-group"><label>Subject</label><input type="text" name="subject" placeholder="Brief subject"></div>
      <div class="form-group"><label>Message (Stored XSS point)</label>
        <textarea name="message" rows="5" placeholder="Describe your issue..."></textarea></div>
      <button type="submit" class="btn-primary">Submit Ticket</button>
    </form>
  </div>
  <div class="card">
    <div class="card-header"><h3>My Tickets</h3>
      <a href="/ticket/TKT-003" class="btn-secondary" style="font-size:.82rem;padding:.4rem .8rem;">View Any Ticket (IDOR)</a>
    </div>
    ${mine.map(t=>`<div class="result-card" style="margin-bottom:.75rem;">
      <div class="rc-row"><span class="rc-label">ID</span><span class="rc-val">${t.id}</span></div>
      <div class="rc-row"><span class="rc-label">Subject</span><span class="rc-val">${t.subject}</span></div>
      <div class="rc-row"><span class="rc-label">Status</span>
        <span class="rc-val" style="color:${statusColor(t.status)};">${t.status.toUpperCase()}</span></div>
      <div style="padding:.5rem 0;font-size:.85rem;">
        <div class="rc-label" style="margin-bottom:.3rem;">Message:</div>
        <div style="background:#f8fafc;padding:.75rem;border-radius:6px;border:1px solid var(--border);">${t.message}</div>
      </div>
    </div>`).join("")||`<p style="color:var(--muted);font-size:.88rem;">No tickets found.</p>`}
  </div>
</main></div></body></html>`);
});

app.get("/api/ticket",(req,res) => {
  const t = DB.tickets.find(t=>t.id===req.query.id);
  if (!t) return res.status(404).json({error:"Ticket not found"});
  const o = DB.users.find(u=>u.id===t.user_id);
  res.json({ticket:t,submitter:{name:o?.name,email:o?.email,ssn:o?.ssn}});
});

app.post("/api/ticket",(req,res) => {
  const user = getUser(req)??DB.users[0];
  const {subject,message} = req.body;
  if (!subject||!message) return req.headers["content-type"]?.includes("urlencoded")?res.redirect("/tickets"):res.status(400).json({error:"Subject and message required"});
  const t = {id:`TKT-${String(DB.tickets.length+1).padStart(3,"0")}`,user_id:user.id,subject,message,status:"open"};
  DB.tickets.push(t);
  if (req.headers["content-type"]?.includes("urlencoded")) return res.redirect("/tickets");
  res.json({ticket:t});
});

// Ticket view — Stored XSS rendered
app.get("/ticket/:id",(req,res) => {
  const t = DB.tickets.find(t=>t.id===req.params.id);
  if (!t) return res.status(404).send("Not found");
  const user = getUser(req)??DB.users[0];
  const owner = DB.users.find(u=>u.id===t.user_id);
  res.send(`${head(`Ticket ${t.id}`)}<body>
${navbar(user.name,user.accounts[0]??"—","support")}
<div class="dash-layout">${sidebar("support")}<main class="dash-main">
  <div class="section-header"><h2>Support Ticket</h2></div>
  <div class="card">
    <div class="result-card">
      <div class="rc-row"><span class="rc-label">Ticket ID</span><span class="rc-val">${t.id}</span></div>
      <div class="rc-row"><span class="rc-label">Submitted By</span><span class="rc-val red">${owner?.name} (${owner?.email})</span></div>
      <div class="rc-row"><span class="rc-label">SSN</span><span class="rc-val red">${owner?.ssn}</span></div>
      <div class="rc-row"><span class="rc-label">Subject</span><span class="rc-val">${t.subject}</span></div>
      <div class="rc-row"><span class="rc-label">Status</span><span class="rc-val" style="color:${statusColor(t.status)};">${t.status.toUpperCase()}</span></div>
    </div>
    <div style="margin-top:1rem;">
      <div class="rc-label" style="margin-bottom:.5rem;">Message (Stored XSS renders here):</div>
      <div style="background:#f8fafc;padding:1rem;border-radius:8px;border:1px solid var(--border);">${t.message}</div>
    </div>
    <a href="/tickets" class="btn-secondary" style="margin-top:1rem;display:inline-block;">← Back to Tickets</a>
  </div>
</main></div></body></html>`);
});

// ADMIN PANEL (no role check)
app.get("/admin",(req,res) => {
  const user = getUser(req)??DB.users[0];
  res.send(`${head("Admin Panel")}<body>
${navbar(user.name,user.accounts[0]??"—","admin")}
<div class="dash-layout">${sidebar("admin")}<main class="dash-main">
  <div class="section-header"><h2>⚙ Admin Panel</h2><span class="badge-danger">No Role Verification</span></div>
  <div class="admin-warning">⚠ This panel is accessible to ALL authenticated users — no admin role check performed.</div>
  <div class="card">
    <div class="card-header"><h3>All Customer Accounts</h3><a href="/api/users" class="btn-danger-sm">Export JSON</a></div>
    <div style="overflow-x:auto;"><table class="data-table">
      <thead><tr><th>ID</th><th>Username</th><th>Full Name</th><th>Email</th><th>Phone</th><th>SSN</th><th>DOB</th><th>Password</th><th>Score</th><th>Income</th><th>Role</th></tr></thead>
      <tbody>${DB.users.map(u=>`<tr>
        <td class="mono">${u.id}</td><td><strong>${u.username}</strong></td><td>${u.name}</td>
        <td class="sensitive">${u.email}</td><td class="sensitive">${u.phone}</td>
        <td class="sensitive">${u.ssn}</td><td>${u.dob}</td>
        <td class="sensitive">${u.password}</td><td class="mono">${u.credit_score}</td>
        <td class="mono">${fmt(u.annual_income)}</td>
        <td style="color:${u.role==="admin"?"var(--red)":"var(--navy)"};">${u.role}</td>
      </tr>`).join("")}</tbody>
    </table></div>
  </div>
  <div class="card"><div class="card-header"><h3>System Information</h3></div>
    <div class="sys-info">
      <div class="sys-row"><span>Server</span><span>Apache/2.4.51 (Ubuntu)</span></div>
      <div class="sys-row"><span>PHP Version</span><span>7.4.33 (EOL)</span></div>
      <div class="sys-row"><span>Database</span><span style="color:var(--red);">MySQL 5.7.40 — sbadmin:Passw0rd!@db.securebank.local</span></div>
      <div class="sys-row"><span>JWT Secret</span><span style="color:var(--red);">sbJWT_w3ak_s3cr3t_2024</span></div>
      <div class="sys-row"><span>AWS Key</span><span style="color:var(--red);">AKIAIOSFODNN7EXAMPLE</span></div>
      <div class="sys-row"><span>Stripe Key</span><span style="color:var(--red);">sk_live_HARDCODED_KEY_12345</span></div>
      <div class="sys-row"><span>Session Flags</span><span>HttpOnly=false, Secure=false, SameSite=None</span></div>
      <div class="sys-row"><span>CORS Policy</span><span style="color:var(--red);">Access-Control-Allow-Origin: *</span></div>
      <div class="sys-row"><span>Debug Mode</span><span style="color:var(--red);">ENABLED</span></div>
    </div>
  </div>
  <div class="card"><div class="card-header"><h3>Network Diagnostic Tool</h3></div>
    <div class="info-note danger-note">⚠ Backend runs: <code>ping -c 1 [INPUT]</code> without sanitization (Command Injection)</div>
    <form action="/api/ping" method="POST" style="display:flex;gap:1rem;align-items:flex-end;">
      <div class="form-group" style="flex:1;margin:0;"><label>Host / IP Address</label>
        <input type="text" name="host" placeholder="e.g. 8.8.8.8 or ; cat /etc/passwd"></div>
      <button type="submit" class="btn-secondary">Run Ping</button>
    </form>
  </div>
</main></div></body></html>`);
});

// PING (Command Injection)
app.get("/ping",(req,res) => {
  const user = getUser(req)??DB.users[0];
  res.send(`${head("Network Diagnostics")}<body>
${navbar(user.name,user.accounts[0]??"—","admin")}
<div class="dash-layout">${sidebar("admin")}<main class="dash-main">
  <div class="section-header"><h2>Network Diagnostics</h2></div>
  <div class="card">
    <div class="info-note danger-note">⚠ Input passed directly to shell: <code>ping -c 1 [host]</code></div>
    <form action="/api/ping" method="POST" style="display:flex;gap:1rem;align-items:flex-end;">
      <div class="form-group" style="flex:1;margin:0;"><label>Host / IP</label>
        <input type="text" name="host" placeholder="e.g. 8.8.8.8 or google.com"></div>
      <button type="submit" class="btn-secondary">Run Ping</button>
    </form>
  </div>
</main></div></body></html>`);
});

app.post("/api/ping",(req,res) => {
  const {host} = req.body;
  if (!host) return res.status(400).json({error:"Host required"});
  const user = getUser(req)??DB.users[0];
  const dangerous = /[;&|`$<>\\]/.test(host)||/\/etc\/|passwd|shadow|\.env/i.test(host);
  const output = dangerous
    ? `[COMMAND INJECTION SIMULATED]\n$ ping -c 1 ${host}\n\nroot:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:/var/www:/usr/sbin/nologin\n\nDB_HOST=db.securebank.local\nDB_PASS=Passw0rd!\nJWT_SECRET=sbJWT_w3ak_s3cr3t_2024`
    : `PING ${host}: 56 data bytes\n64 bytes from ${host}: icmp_seq=0 ttl=56 time=12.1ms\n1 packets transmitted, 1 received, 0% packet loss`;
  // Reflected XSS: host echoed in heading
  res.send(`${head("Ping Result")}<body>
${navbar(user.name,user.accounts[0]??"—","admin")}
<div class="dash-layout">${sidebar("admin")}<main class="dash-main">
  <div class="section-header"><h2>Network Diagnostics</h2></div>
  <div class="card"><div class="card-header"><h3>Result for: ${host}</h3></div>
    <div class="code-out">${output}</div>
    <a href="/ping" class="btn-secondary" style="margin-top:1rem;display:inline-block;">← Run Another</a>
  </div>
</main></div></body></html>`);
});

// DATA EXPOSURE ENDPOINTS
app.get("/api/users",(req,res) => res.json({users:DB.users}));
app.get("/debug",(req,res) => res.json({NODE_ENV:"production",DB_HOST:"db.securebank.local",DB_USER:"sbadmin",DB_PASS:"Passw0rd!",JWT_SECRET:"sbJWT_w3ak_s3cr3t_2024",AWS_KEY:"AKIAIOSFODNN7EXAMPLE",AWS_SECRET:"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",STRIPE_KEY:"sk_live_HARDCODED_KEY_12345",APP_VERSION:"SecureBank v2.3.1",DEBUG_MODE:true}));
app.get("/api/error-demo",(req,res) => res.status(500).json({error:`PDOException: SQLSTATE[42000] near '${req.query.input??""}'`,file:"/var/www/html/app/Models/UserModel.php",line:147,db_host:"db.securebank.local",db_pass:"Passw0rd!",server:"Apache/2.4.51 Ubuntu PHP/7.4.33"}));

// 404
app.use((req,res) => res.status(404).json({error:`Route ${req.method} ${req.path} not found`,server:"SecureBank/2.3.1 Node.js/"+process.version,routes:["/","/dashboard","/transfer","/search","/profile","/tickets","/ticket/:id","/admin","/ping","/debug","/api/login","/api/logout","/api/user","/api/account","/api/transactions","/api/ticket","/api/transfer","/api/ping","/api/users"]}));

app.listen(3000,() => {
  console.log("✓ SecureBank: http://localhost:3000");
  console.log("✓ Login: john.doe / password123  |  admin / Admin@2024!");
  console.log("⚠ Intentionally vulnerable — do NOT expose publicly");
});

export default app;