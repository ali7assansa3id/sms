export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };
    if (request.method === "OPTIONS") return new Response(null, {status:204, headers:cors});
    const url = new URL(request.url);
    if (url.pathname !== "/send" || request.method !== "POST") return json({ok:false,error:"Use POST /send"},404,cors);
    if (!env.BIRD_API_KEY) return json({ok:false,error:"BIRD_API_KEY is not configured."},500,cors);
    let body; try { body=await request.json(); } catch { return json({ok:false,error:"Invalid JSON."},400,cors); }
    const to=normalize(String(body.to||"")), from=String(body.from||"ALI").trim(), text=String(body.text||"").trim(), category=String(body.category||"transactional");
    if (!/^\+20\d{10}$/.test(to)) return json({ok:false,error:"Invalid Egyptian number. Use +20XXXXXXXXXX."},400,cors);
    if (!/^[A-Za-z0-9 _.-]{3,11}$/.test(from) || !/[A-Za-z]/.test(from)) return json({ok:false,error:"Invalid Sender ID."},400,cors);
    if (!text || text.length>1600) return json({ok:false,error:"Message is empty or too long."},400,cors);
    if (!["transactional","marketing","authentication","service"].includes(category)) return json({ok:false,error:"Invalid category."},400,cors);
    const r=await fetch("https://eu1.platform.bird.com/v1/sms/messages",{method:"POST",headers:{Authorization:`Bearer ${env.BIRD_API_KEY}`,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({to,from,text,category,options:{smart_encoding:true}})});
    const raw=await r.text(); let data; try{data=JSON.parse(raw)}catch{data={raw}};
    return new Response(JSON.stringify({ok:r.ok,status:r.status,bird:data},null,2),{status:r.ok?200:r.status,headers:{...cors,"Content-Type":"application/json;charset=utf-8"}});
  }
};
function normalize(v){let n=v.replace(/[^\d+]/g,"");if(n.startsWith("0020"))n="+"+n.slice(2);if(n.startsWith("01")&&n.length===11)n="+20"+n.slice(1);if(n.startsWith("20")&&n.length===12)n="+"+n;return n}
function json(v,s,c){return new Response(JSON.stringify(v),{status:s,headers:{...c,"Content-Type":"application/json;charset=utf-8"}})}
