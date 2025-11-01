const products = [];
const rnd = (min,max)=>Math.floor(Math.random()*(max-min+1))+min;

function generateDailySeries(days=30, base=1000){
  const s=[];
  for(let d=0;d<days;d++){
    const imp=rnd(base*0.8, base*1.2);
    const clicks=Math.round(imp*(0.01+rnd(1,5)/100));
    const conv=Math.round(clicks*(0.02+rnd(1,8)/100));
    const revenue=conv*rnd(5,50);
    s.push({impressions:imp, clicks, conversions:conv, revenue});
  }
  return s;
}

const productListEl=document.getElementById('productList');
function renderList(){
  productListEl.innerHTML='';
  products.forEach((p,i)=>{
    const el=document.createElement('div');
    el.className='product';
    el.innerHTML=`<b>${p.name}</b> - ₹${p.price}`;
    el.onclick=()=>selectProduct(i);
    productListEl.appendChild(el);
  });
}

let selectedIndex=null;
function selectProduct(i){
  selectedIndex=i;
  const p=products[i];
  document.getElementById('selectedTitle').textContent=p.name;
  document.getElementById('selectedDesc').textContent=p.desc;
  updateUI();
}

document.getElementById('addProd').onclick=()=>{
  const name=document.getElementById('prodName').value;
  const price=document.getElementById('prodPrice').value;
  const desc=document.getElementById('prodDesc').value;
  products.push({name,price,desc,series:[]});
  renderList();
}

document.getElementById('seedData').onclick=()=>{
  products.length=0;
  products.push({name:'Eco Scooter',price:499,desc:'Electric scooter',series:generateDailySeries()});
  products.push({name:'Smart Mug',price:1299,desc:'Heated mug',series:generateDailySeries()});
  renderList();
};

document.getElementById('simulate').onclick=()=>{
  if(selectedIndex===null) return alert('Select a product first');
  const d=document.getElementById('days').value;
  products[selectedIndex].series=generateDailySeries(d);
  updateUI();
};

document.getElementById('clearData').onclick=()=>{
  if(selectedIndex===null) return;
  products[selectedIndex].series=[];
  updateUI();
};

const ctx=document.getElementById('trendChart').getContext('2d');
const chart=new Chart(ctx,{type:'line',data:{labels:[],datasets:[]},options:{responsive:true}});

function updateUI(){
  if(selectedIndex===null) return;
  const p=products[selectedIndex];
  if(!p.series.length) return;
  const labels=p.series.map((_,i)=>`Day ${i+1}`);
  chart.data.labels=labels;
  chart.data.datasets=[{
    label:'Clicks',
    data:p.series.map(x=>x.clicks),
    borderWidth:2
  }];
  chart.update();
  document.getElementById('mImpr').textContent=p.series.reduce((a,x)=>a+x.impressions,0);
  document.getElementById('mClicks').textContent=p.series.reduce((a,x)=>a+x.clicks,0);
  document.getElementById('mConv').textContent=p.series.reduce((a,x)=>a+x.conversions,0);
  document.getElementById('mRev').textContent='₹'+p.series.reduce((a,x)=>a+x.revenue,0);
}

document.getElementById('forecastBtn').onclick=()=>{
  document.getElementById('insights').textContent='Forecast generated!';
};
