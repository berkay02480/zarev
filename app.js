let sozluk = {};
let ters = {};
let yon = "tr-zv";

const EKLER = {
  "lar":"vek","ler":"vek","da":"na","de":"na","ta":"na","te":"na",
  "dan":"dor","den":"dor","tan":"dor","ten":"dor",
  "a":"ra","e":"ra","ı":"im","i":"im","u":"im","ü":"im",
  "ın":"un","in":"un","un":"un","ün":"un",
  "ımız":"envek","imiz":"envek","umuz":"envek","ümüz":"envek",
  "ınız":"qen","iniz":"qen","unuz":"qen","ünüz":"qen",
  "acak":"zan","ecek":"zan","yor":"yor",
  "malı":"mal","meli":"mal","mak":"ruk","mek":"ruk",
  "lık":"lik","lik":"lik","luk":"lik","lük":"lik",
  "sız":"siz","siz":"siz","suz":"siz","süz":"siz"
};

const input = document.getElementById("input");
const output = document.getElementById("output");
const info = document.getElementById("info");

function parseCSV(text){
  const rows = text.split(/\r?\n/);
  for(const row of rows){
    if(!row.trim()) continue;
    const parts = row.split(",");
    if(parts.length < 2) continue;
    const tr = parts[0].trim().toLowerCase();
    const zv = parts.slice(1).join(",").trim();
    if(tr && zv && tr !== "türkçe" && tr !== "turkce"){
      sozluk[tr] = zv;
    }
  }
  ters = {};
  for(const [tr,zv] of Object.entries(sozluk)) ters[zv.toLowerCase()] = tr;
}

function trToZv(word){
  const k=word.toLowerCase();
  if(sozluk[k]) return sozluk[k];
  for(const ek of Object.keys(EKLER).sort((a,b)=>b.length-a.length)){
    if(k.endsWith(ek) && k.length>ek.length+1){
      const kok=k.slice(0,-ek.length);
      if(sozluk[kok]) return sozluk[kok]+EKLER[ek];
    }
  }
  return "[bilinmiyor]";
}

function zvToTr(word){
  const k=word.toLowerCase();
  if(ters[k]) return ters[k];
  for(const ek of [...new Set(Object.values(EKLER))].sort((a,b)=>b.length-a.length)){
    if(k.endsWith(ek) && k.length>ek.length+1){
      const kok=k.slice(0,-ek.length);
      if(ters[kok]) return ters[kok]+"[ek]";
    }
  }
  return "[bilinmiyor]";
}

function translate(){
  const text=input.value;
  const fn=yon==="tr-zv"?trToZv:zvToTr;
  output.textContent=text.trim()?text.split(/(\s+)/).map(x=>/\s+/.test(x)?x:fn(x)).join(""):"";
}

document.getElementById("trBtn").onclick=()=>{
  yon="tr-zv";
  document.getElementById("trBtn").classList.add("active");
  document.getElementById("zvBtn").classList.remove("active");
};
document.getElementById("zvBtn").onclick=()=>{
  yon="zv-tr";
  document.getElementById("zvBtn").classList.add("active");
  document.getElementById("trBtn").classList.remove("active");
};
document.getElementById("translate").onclick=translate;
document.getElementById("clear").onclick=()=>{input.value="";output.textContent="Burada çeviri görünecek.";};
document.getElementById("copy").onclick=async()=>{await navigator.clipboard.writeText(output.textContent);};

Promise.all([
  fetch("berkay_001.csv").then(r => {
    if (!r.ok) throw Error("berkay_001.csv bulunamadı");
    return r.text();
  }),
  fetch("berkay_002.csv").then(r => {
    if (!r.ok) throw Error("berkay_002.csv bulunamadı");
    return r.text();
  })
])
.then(([t1, t2]) => {
  parseCSV(t1);
  parseCSV(t2);

  info.textContent =
    `${Object.keys(sozluk).length.toLocaleString("tr-TR")} sözlük kaydı yüklendi.`;
})
.catch(err => {
  info.textContent = "Sözlük dosyaları yüklenemedi: " + err.message;
});
