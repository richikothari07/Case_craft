import React,{useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {Search,ArrowRight,ChevronDown,ChevronLeft,Target,TrendingUp,Layers,BarChart3,Lightbulb,Compass,Users,Briefcase,CheckCircle2} from "lucide-react";
import {catalog} from "./data";
import "./styles.css";

const sectors=["All",...Array.from(new Set(catalog.map(x=>x.sector)))];
const content={
  overview:{
    "PhonePe":["Digital payments platform built around everyday transactions and expanding financial services.","Mass-market consumers and merchants","Payments, financial services, distribution and ecosystem"],
    "Blinkit":["Quick-commerce product optimized around immediacy, assortment and dense local fulfillment.","Urban, convenience-seeking consumers","High-frequency commerce, advertising and fulfillment"],
    "Groww":["Consumer investing platform focused on making investing simpler and more accessible.","First-time and retail investors","Distribution, financial products and engagement"],
    "Zerodha":["Low-cost investing platform whose simplicity and transparent pricing changed retail broking.","Self-directed retail investors","Brokerage, distribution and platform services"],
    "CRED":["Premium fintech membership product built around creditworthy users, rewards and financial discovery.","Creditworthy, digitally active consumers","Rewards, financial products and commerce"],
    "Stable Money":["Fixed-income investing product that reduces complexity in discovering and investing in fixed-income products.","Retail savers seeking predictable returns","Distribution and financial-product commissions"],
    "Zepto":["Quick-commerce marketplace built around fast delivery, dense dark-store networks and high-frequency use cases.","Urban convenience shoppers","Commerce margin, advertising and fulfillment"],
    "Swiggy":["Multi-sided convenience platform connecting consumers with food, delivery and adjacent services.","Urban consumers","Food delivery, quick commerce, advertising and platform economics"],
    "Zomato":["Food discovery and delivery platform that evolved into a broader local-commerce ecosystem.","Urban consumers","Food delivery, quick commerce, advertising and services"],
    "Meesho":["Value-led marketplace designed to bring price-sensitive consumers and small sellers online.","Value-conscious shoppers and SMB sellers","Marketplace commissions, logistics and services"],
    "Razorpay":["Payments and financial infrastructure platform helping businesses accept, move and manage money.","Internet businesses and SMBs","Payments, banking infrastructure and financial services"],
  }
};

const fallback={
  thesis:"A scaled digital product competing on a combination of customer experience, distribution, operational execution and economics.",
  user:"Primary consumer or business users in the product's category",
  model:"Platform, transaction, subscription, advertising or services-led monetization",
};
function getInfo(name){
  const [thesis,user,model]=content.overview[name]||[];
  return {thesis:thesis||fallback.thesis,user:user||fallback.user,model:model||fallback.model};
}
function scoreFor(name){
  let h=0; for(let i=0;i<name.length;i++)h=(h*31+name.charCodeAt(i))%997;
  return {ux:(8+(h%12)/10).toFixed(1),value:(8.2+((h>>2)%9)/10).toFixed(1),growth:(7.8+((h>>4)%14)/10).toFixed(1),moat:(7.5+((h>>6)%16)/10).toFixed(1)};
}
function App(){
 const [sector,setSector]=useState("All"),[product,setProduct]=useState(""),[search,setSearch]=useState(""),[active,setActive]=useState("Overview");
 const filtered=useMemo(()=>catalog.filter(x=>(sector==="All"||x.sector===sector)&&x.name.toLowerCase().includes(search.toLowerCase())),[sector,search]);
 const selected=catalog.find(x=>x.name===product);
 if(selected) return <ProductPage selected={selected} active={active} setActive={setActive} back={()=>{setProduct("");setActive("Overview")}}/>;
 return <div className="app"><header><div className="brand" onClick={()=>{setSector("All");setSearch("")}}>Indian <span>Product Lab</span></div><nav><a>Explore</a><a>Interview</a><a>About</a></nav></header>
 <main className="home"><section className="hero"><div className="eyebrow">PRODUCT INTELLIGENCE · INDIA</div><h1>Study how India's<br/><em>best products</em> work.</h1><p>Simple, practical teardowns of the products shaping India's digital economy.</p>
 <div className="picker"><div className="field"><label>SECTOR</label><select value={sector} onChange={e=>{setSector(e.target.value);setProduct("")}}>{sectors.map(s=><option key={s}>{s}</option>)}</select><ChevronDown/></div><div className="field"><label>PRODUCT</label><select value={product} onChange={e=>setProduct(e.target.value)}><option value="">Choose a product...</option>{filtered.map(x=><option key={x.name}>{x.name}</option>)}</select><ChevronDown/></div><button disabled={!product} onClick={()=>setActive("Overview")}>Explore <ArrowRight size={17}/></button></div></section>
 <section className="browse"><div className="sectionHead"><div><div className="eyebrow">EXPLORE</div><h2>Browse products</h2></div><div className="count">{catalog.length} products</div></div>
 <div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." /></div>
 <div className="chips">{sectors.slice(1).map(s=><button className={sector===s?"active":""} onClick={()=>setSector(s)} key={s}>{s}</button>)}</div>
 <div className="grid">{filtered.map(x=><button className="productCard" key={x.name} onClick={()=>setProduct(x.name)}><span>{x.sector}</span><strong>{x.name}</strong><small>View product teardown <ArrowRight size={14}/></small></button>)}</div></section></main>
 <footer>Indian Product Lab · Built for curious PMs</footer></div>
}
function ProductPage({selected,active,setActive,back}){
 const info=getInfo(selected.name), s=scoreFor(selected.name);
 const tabs=["Overview","Product","Business","Strategy","Metrics","Competition","Opportunities","Interview"];
 return <div className="app"><header><button className="back" onClick={back}><ChevronLeft size={17}/> All products</button><div className="brand">Indian <span>Product Lab</span></div><div/></header>
 <main className="product"><div className="productTop"><div><div className="eyebrow">{selected.sector}</div><h1>{selected.name}</h1><p>{info.thesis}</p></div><div className="score"><small>PRODUCT SCORE</small><b>{((+s.ux + +s.value + +s.growth + +s.moat)/4).toFixed(1)}</b><span>/ 10</span></div></div>
 <div className="tabs">{tabs.map(t=><button className={active===t?"active":""} onClick={()=>setActive(t)} key={t}>{t}</button>)}</div>
 {active==="Overview"&&<Overview selected={selected} info={info} s={s}/>}
 {active==="Product"&&<Product selected={selected}/>}
 {active==="Business"&&<Business selected={selected}/>}
 {active==="Strategy"&&<Strategy selected={selected}/>}
 {active==="Metrics"&&<Metrics selected={selected}/>}
 {active==="Competition"&&<Competition selected={selected}/>}
 {active==="Opportunities"&&<Opportunities selected={selected}/>}
 {active==="Interview"&&<Interview selected={selected}/>}
 </main></div>
}
function Section({icon,title,children}){return <section className="analysis"><div className="analysisTitle">{icon}<div><div className="eyebrow">ANALYSIS</div><h2>{title}</h2></div></div>{children}</section>}
function Overview({selected,info,s}){return <><Section icon={<Compass/>} title="Product at a glance"><div className="cards three"><div><small>TARGET USER</small><b>{info.user}</b></div><div><small>BUSINESS MODEL</small><b>{info.model}</b></div><div><small>CORE JOB</small><b>Help users complete a high-value task with less friction.</b></div></div></Section><Section icon={<BarChart3/>} title="Product health"><div className="health">{[["UX",s.ux],["Value proposition",s.value],["Growth engine",s.growth],["Moat",s.moat]].map(x=><div key={x[0]}><span>{x[0]}</span><div className="bar"><i style={{width:(+x[1]*10)+"%"}}/></div><b>{x[1]}</b></div>)}</div></Section><Section icon={<Target/>} title="PM thesis"><div className="insight">The strongest products win because their core user promise is tightly connected to a repeatable distribution engine and an economic model that can scale.</div></Section></>}
function Product({selected}){return <><Section icon={<Users/>} title="User journey"><div className="journey">{["Discover","Evaluate","Choose","Transact","Experience","Return"].map((x,i)=><div key={x}><b>0{i+1}</b><span>{x}</span></div>)}</div><div className="grid two"><div className="note"><b>What the product optimizes for</b><p>Reduce time-to-value at the moment of highest user intent.</p></div><div className="note"><b>Key friction to watch</b><p>Every additional decision, delay or uncertainty can reduce conversion.</p></div></div></Section><Section icon={<Layers/>} title="Product teardown"><div className="teardown">{["Discovery & acquisition","Activation & first value","Core experience","Retention & habit"].map((x,i)=><article key={x}><span>0{i+1}</span><h3>{x}</h3><p>Identify the key product decision, the user friction it removes, and the business impact created by that choice.</p><label>PM QUESTION</label><strong>Why is this experience designed this way?</strong></article>)}</div></Section></>}
function Business({selected}){return <><Section icon={<Briefcase/>} title="How the business works"><div className="flow">{["Acquisition","Activation","Transaction / usage","Monetization","Retention"].map((x,i)=><div key={x}><b>{i+1}</b><span>{x}</span>{i<4&&<ArrowRight/>}</div>)}</div></Section><Section icon={<TrendingUp/>} title="Growth flywheel"><div className="flywheel"><div>More users</div><ArrowRight/><div>More usage</div><ArrowRight/><div>Better economics</div><ArrowRight/><div>More investment</div></div></Section><Section icon={<BarChart3/>} title="Business questions"><div className="questions"><p>• What drives incremental revenue?</p><p>• Which costs scale with every transaction?</p><p>• Where does density or scale create an advantage?</p><p>• What must improve before the next growth phase?</p></div></Section></>}
function Strategy({selected}){return <><Section icon={<Compass/>} title="Strategic priorities"><div className="priority"><article><span>01</span><h3>Deepen the core</h3><p>Improve the primary user journey before adding complexity.</p></article><article><span>02</span><h3>Expand monetization</h3><p>Find adjacent revenue pools that strengthen the existing flywheel.</p></article><article><span>03</span><h3>Build defensibility</h3><p>Turn distribution, data, operations or brand into a harder-to-copy advantage.</p></article></div></Section><Section icon={<Target/>} title="Business goal → product implication"><div className="matrix"><div><b>Goal</b><b>Product move</b></div><div><span>Increase retention</span><span>Increase repeat value and reduce friction</span></div><div><span>Grow revenue</span><span>Increase conversion, frequency or monetization</span></div><div><span>Improve economics</span><span>Automate, increase density or shift mix</span></div></div></Section></>}
function Metrics(){return <><Section icon={<BarChart3/>} title="Metric tree"><div className="metricTree"><div className="north">NORTH STAR<br/><b>Value delivered to active users</b></div><div className="metricCols">{[["Acquisition","CAC","Organic share","Conversion"],["Activation","Time to value","First-use conversion","Onboarding completion"],["Engagement","Frequency","Transactions/user","Session depth"],["Retention","D30","D90","Repeat rate"],["Economics","Revenue/user","Contribution margin","CAC payback"]].map(a=><div key={a[0]}><b>{a[0]}</b>{a.slice(1).map(x=><span key={x}>{x}</span>)}</div>)}</div></div></Section><Section icon={<CheckCircle2/>} title="How to read the numbers"><div className="insight">Public = reported by the company or credible source. Estimated = reasoned approximation. PM-recommended = a metric we would track even if the company does not publicly disclose it.</div></Section></>}
function Competition(){return <><Section icon={<Layers/>} title="Competitive position"><div className="compare"><div></div><b>Core UX</b><b>Distribution</b><b>Economics</b><b>Moat</b>{["This product","Direct competitor","Traditional alternative"].map((x,i)=><React.Fragment key={x}><span>{x}</span><span>{"★".repeat(5-i)}</span><span>{"★".repeat(4+i%2)}</span><span>{"★".repeat(3+i)}</span><span>{"★".repeat(5-i)}</span></React.Fragment>)}</div></Section><Section icon={<Lightbulb/>} title="Why could it win?"><div className="insight">A strong position comes from a clear customer promise combined with a distribution or operational advantage competitors cannot easily reproduce.</div></Section></>}
function Opportunities(){return <><Section icon={<Lightbulb/>} title="If I were the PM"><div className="opps">{["Reduce the biggest conversion friction","Create a stronger repeat-use loop","Improve personalization","Open an adjacent monetization pool","Turn an operational advantage into UX"].map((x,i)=><article key={x}><span>0{i+1}</span><div><h3>{x}</h3><p>Define the user problem, propose the smallest useful solution, then connect it to a measurable business outcome.</p><div className="tags"><label>HIGH IMPACT</label><label>MEDIUM EFFORT</label></div></div></article>)}</div></Section><Section icon={<Target/>} title="Prioritization"><div className="priorityGrid"><div><b>BIG BETS</b><p>High impact / High effort</p></div><div><b>DO NOW</b><p>High impact / Low effort</p></div><div><b>AVOID</b><p>Low impact / High effort</p></div><div><b>FILL-INS</b><p>Low impact / Low effort</p></div></div></Section></>}
function Interview({selected}){return <Section icon={<Target/>} title="Practice as a PM"><div className="interview">{["How would you improve this product?","What should its North Star Metric be?","What is the biggest growth constraint?","Retention dropped 15%. How would you diagnose it?","What adjacent market should it enter next?"].map((q,i)=><button key={q}><span>0{i+1}</span><div><b>{q}</b><small>Reveal interview framework <ArrowRight size={14}/></small></div></button>)}</div></Section>}
createRoot(document.getElementById("root")).render(<App/>);
