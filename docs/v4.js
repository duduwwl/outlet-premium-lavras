const scriptUrl = document.querySelector('script[src$="v4.js"]').src;
const asset = path => path.startsWith('http') ? path : new URL(path.replace(/^\//, ''), scriptUrl).href;
const money = cents => new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'}).format(cents / 100);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const $ = selector => document.querySelector(selector);

const PRODUCTS = [
  {id:'camisetas-neutras',name:'Camisetas em tons essenciais',category:'camisetas',label:'Camisetas',image:'/images/camisetas-neutras.png',alt:'Camisetas dobradas em tons neutros',price:7990,stock:12,sizes:['P','M','G','GG'],description:'Uma paleta versátil, do branco ao terracota. Peças de gola redonda para usar com jeans ou sobreposições.',details:[['Referência','Foto divulgada pela loja'],['Cores na imagem','Branco, preto e tons terrosos']]},
  {id:'camisetas-cores',name:'Camisetas de cores variadas',category:'camisetas',label:'Camisetas',image:'/images/camisetas-cores.png',alt:'Camisetas masculinas dobradas em várias cores',price:7990,stock:15,sizes:['P','M','G','GG'],description:'Cores claras, vibrantes e escuras para atualizar os essenciais do guarda-roupa.',details:[['Referência','Foto divulgada pela loja'],['Cores na imagem','Neutras e coloridas']]},
  {id:'camisa-xadrez',name:'Camisa xadrez contemporânea',category:'camisas',label:'Camisas',image:'/images/camisa-xadrez.png',alt:'Modelo usando camisa xadrez cinza e azul',price:14990,stock:7,sizes:['P','M','G','GG'],description:'Padronagem xadrez de manga longa em composição com jeans escuro.',details:[['Referência','Foto divulgada pela loja'],['Padronagem','Xadrez cinza e azul']]},
  {id:'jeans-escuro',name:'Jeans azul escuro',category:'calcas',label:'Calças',crop:'crop-jeans-dark',alt:'Detalhe de jeans masculino azul escuro',price:16990,stock:8,sizes:['38','40','42','44','46'],description:'Denim de lavagem escura visto nas publicações da loja, fácil de combinar com camisetas e camisas.',details:[['Referência','Publicação da loja'],['Lavagem na imagem','Azul escuro']]},
  {id:'jeans-lavagens',name:'Jeans em duas lavagens',category:'calcas',label:'Calças',crop:'crop-jeans-varied',alt:'Calças jeans em lavagens azul médio e escuro',price:16990,stock:6,sizes:['38','40','42','44','46'],description:'Duas leituras do jeans: uma clara e descontraída; outra escura e clássica.',details:[['Referência','Publicação da loja'],['Lavagens na imagem','Azul médio e escuro']]},
  {id:'camisa-casual',name:'Camisa xadrez casual',category:'camisas',label:'Camisas',image:'/images/camisa-xadrez.png',alt:'Modelo com camisa xadrez de manga longa',price:13990,stock:5,sizes:['P','M','G','GG'],description:'Camisa de manga longa com desenho xadrez discreto para composições casuais alinhadas.',details:[['Referência','Foto divulgada pela loja'],['Estilo','Casual']]},
  {id:'jaqueta-marrom',name:'Jaqueta em tom terroso',category:'jaquetas',label:'Jaquetas',crop:'crop-jacket',alt:'Modelo com jaqueta masculina marrom',price:21990,stock:4,sizes:['P','M','G','GG'],description:'Uma camada marcante em marrom quente, fotografada com base escura.',details:[['Referência','Publicação da loja'],['Cor na imagem','Marrom']]},
  {id:'camisa-social-branca',name:'Camisa social branca',category:'camisas',label:'Camisas',image:'/images/camisa-social-branca-estudio.png',alt:'Camisa social branca inteira em fundo de estúdio',illustrative:true,price:14990,stock:8,sizes:['P','M','G','GG'],description:'Uma referência de visual alinhado. Imagem ilustrativa; modelos reais devem ser confirmados com a loja.',details:[['Imagem','Ilustrativa, gerada para este catálogo'],['Modelo','Camisa social branca de manga longa']]},
  {id:'cinto-marrom',name:'Cinto masculino marrom',category:'acessorios',label:'Acessórios',image:'https://images.unsplash.com/photo-1664286074176-5206ee5dc878?auto=format&fit=crop&w=1000&q=82',alt:'Cinto marrom com fivela metálica',illustrative:true,price:8990,stock:9,sizes:['Único'],description:'Um acessório de acabamento para composições casuais ou alinhadas. Foto ilustrativa da categoria.',details:[['Imagem','Ilustrativa'],['Foto','seeetz / Unsplash']]},
  {id:'cinto-preto',name:'Cinto masculino preto',category:'acessorios',label:'Acessórios',image:'/images/cinto-preto-estudio.png',alt:'Cinto masculino preto inteiro com fivela prata',illustrative:true,price:8990,stock:9,sizes:['Único'],description:'Uma referência sóbria para o dia a dia e ocasiões mais formais. Imagem ilustrativa da categoria.',details:[['Imagem','Ilustrativa, gerada para este catálogo'],['Cor','Preto']]},
  {id:'polos',name:'Polos masculinas',category:'camisetas',label:'Camisetas',image:'/images/polo-azul-estudio.png',alt:'Camisa polo masculina azul-marinho inteira',illustrative:true,price:9990,stock:10,sizes:['P','M','G','GG'],description:'Uma opção para composições casuais mais alinhadas. Imagem ilustrativa da categoria.',details:[['Imagem','Ilustrativa, gerada para este catálogo'],['Cor','Azul-marinho']]},
  {id:'camisetas-claras',name:'Camisetas em cores claras',category:'camisetas',label:'Camisetas',image:'/images/camisetas-cores.png',alt:'Camisetas dobradas em tons claros, azul e verde',price:7990,stock:11,sizes:['P','M','G','GG'],description:'Tons suaves como branco, azul e verde aparecem nesta seleção fotografada pela loja.',details:[['Referência','Foto divulgada pela loja'],['Cores na imagem','Claras e suaves']]}
];
const productById = id => PRODUCTS.find(product => product.id === id);
const readJSON = (key,fallback) => {try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}};
const getStock = () => {
  const saved = readJSON('outlet-v4-stock',{});
  return Object.fromEntries(PRODUCTS.map(p => [p.id,Number.isInteger(saved[p.id]) ? Math.max(0,saved[p.id]) : p.stock]));
};
const setStock = stock => localStorage.setItem('outlet-v4-stock',JSON.stringify(stock));
const getCart = () => readJSON('outlet-v4-cart',[]);
const setCart = cart => {localStorage.setItem('outlet-v4-cart',JSON.stringify(cart));updateCartCount()};
const getOrders = () => {
  let orders = readJSON('outlet-v4-orders',null);
  if(orders) return orders;
  orders = [
    {id:'OP-EX01',customer:'Cliente exemplo',items:['1 × Camisa xadrez contemporânea · M'],fulfillment:'Retirada na loja',payment:'Pix',total:14990,status:'Novo',date:'Exemplo'},
    {id:'OP-EX02',customer:'Cliente exemplo',items:['1 × Jeans azul escuro · 42'],fulfillment:'Entrega',payment:'Débito',total:18490,status:'Em atendimento',date:'Exemplo'}
  ];
  setOrders(orders);
  return orders;
};
const setOrders = orders => localStorage.setItem('outlet-v4-orders',JSON.stringify(orders));
const totalCart = cart => cart.reduce((sum,item) => sum + (productById(item.id)?.price ?? 0) * item.qty,0);
function updateCartCount(){
  const node = $('#cart-count');
  if(node) node.textContent = getCart().reduce((sum,item) => sum + item.qty,0);
}
function imageMarkup(product){
  if(product.crop) return '<div class="screenshot-crop '+product.crop+'" role="img" aria-label="'+escapeHTML(product.alt)+'"><img src="'+asset('/images/instagram-produtos.png')+'" alt=""></div>';
  return '<img src="'+asset(product.image)+'" alt="'+escapeHTML(product.alt)+'" loading="lazy">';
}
function mediaMarkup(product){
  return imageMarkup(product)+(product.illustrative?'<span class="product-source">Foto ilustrativa</span>':'');
}
function quantityInCart(id){return getCart().filter(item=>item.id===id).reduce((sum,item)=>sum+item.qty,0)}
function addToCart(id,size){
  const available = getStock()[id];
  if(quantityInCart(id)>=available) return false;
  const cart=getCart(),existing=cart.find(item=>item.id===id&&item.size===size);
  if(existing) existing.qty++;
  else cart.push({id,size,qty:1});
  setCart(cart);
  return true;
}
function initCommon(){
  updateCartCount();
  const menu=$('#menu-toggle'),mobile=$('#mobile-nav');
  menu?.addEventListener('click',()=>{const opening=mobile.hidden;mobile.hidden=!opening;menu.setAttribute('aria-expanded',String(opening));document.body.classList.toggle('menu-open',opening)});
  mobile?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mobile.hidden=true;document.body.classList.remove('menu-open')}));
  document.querySelector('[data-nav="'+document.body.dataset.page+'"]')?.classList.add('active');
}
function initCarousel(){
  const hero=$('.hero'),slides=[...hero.querySelectorAll('.hero-slide')],dots=[...hero.querySelectorAll('.hero-dots button')];
  let index=0,timer=null;
  function show(next){index=(next+slides.length)%slides.length;slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===index));dots.forEach((dot,i)=>{dot.classList.toggle('is-active',i===index);if(i===index)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current')})}
  function stop(){if(timer)clearInterval(timer);timer=null}
  function start(){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.hidden)return;stop();timer=setInterval(()=>show(index+1),5500)}
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{show(i);start()}));
  hero.addEventListener('mouseenter',stop);hero.addEventListener('mouseleave',start);
  hero.addEventListener('focusin',stop);hero.addEventListener('focusout',start);
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  start();
}
function initCatalog(){
  const grid=$('#product-grid'),search=$('#catalog-search'),filters=[...document.querySelectorAll('.filter')],dialog=$('#product-dialog');
  let category='todos',active=null,lastTrigger=null;
  const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function render(){
    const term=normalize(search.value.trim()),stock=getStock();
    const visible=PRODUCTS.filter(p=>(category==='todos'||p.category===category)&&(!term||normalize(p.name+' '+p.description+' '+p.label).includes(term)));
    grid.innerHTML=visible.map(p=>'<article class="product-card" id="'+p.id+'"><button type="button" class="product-open" data-id="'+p.id+'" aria-label="Ver '+escapeHTML(p.name)+'"><div class="product-media">'+mediaMarkup(p)+'</div><div class="product-info"><span class="product-category">'+p.label+'</span><h3>'+escapeHTML(p.name)+'</h3><div class="product-status"><span>'+money(p.price)+'</span><span class="stock-pill'+(stock[p.id]===0?' out':'')+'">'+(stock[p.id]?'Estoque fictício: '+stock[p.id]:'Esgotado na simulação')+'</span></div></div></button></article>').join('');
    $('#catalog-count').textContent=visible.length+' '+(visible.length===1?'peça':'peças');
    $('#empty-state').hidden=visible.length>0;
  }
  filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;filters.forEach(item=>{const on=item===button;item.classList.toggle('active',on);item.setAttribute('aria-pressed',String(on))});render()}));
  search.addEventListener('input',render);
  grid.addEventListener('click',event=>{
    const button=event.target.closest('.product-open');if(!button)return;
    active=productById(button.dataset.id);lastTrigger=button;
    $('#dialog-media').innerHTML=mediaMarkup(active);
    $('#dialog-category').textContent=active.label+(active.illustrative?' · FOTO ILUSTRATIVA':' · REFERÊNCIA DA LOJA');
    $('#dialog-title').textContent=active.name;
    $('#dialog-description').textContent=active.description;
    $('#dialog-facts').innerHTML=active.details.map(([a,b])=>'<div><span>'+escapeHTML(a)+'</span><strong>'+escapeHTML(b)+'</strong></div>').join('')+'<div><span>Preço fictício</span><strong>'+money(active.price)+'</strong></div>';
    $('#product-size').innerHTML=active.sizes.map(size=>'<option>'+escapeHTML(size)+'</option>').join('');
    $('#dialog-stock').textContent='Estoque fictício: '+getStock()[active.id]+' unidades';
    $('#add-message').textContent='';
    $('#add-to-cart').disabled=getStock()[active.id]===0;
    $('#dialog-whatsapp').href='https://wa.me/5535997687127?text='+encodeURIComponent('Olá, gostaria de conhecer '+active.name+' na Outlet Premium Lavras.');
    dialog.showModal();
  });
  $('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  dialog.addEventListener('close',()=>lastTrigger?.focus());
  $('#add-to-cart').addEventListener('click',()=>{
    if(!active)return;
    const added=addToCart(active.id,$('#product-size').value);
    $('#add-message').textContent=added?'Adicionado à sacola.':'Quantidade indisponível no estoque fictício.';
  });
  render();
}
function initCheckout(){
  const cartItems=$('#cart-items'),form=$('#checkout-form'),message=$('#checkout-message');
  form.after(message);
  let shipping=null;
  function render(){
    const stock=getStock(),cart=getCart();
    $('#cart-empty').hidden=cart.length>0;
    form.hidden=cart.length===0;
    cartItems.innerHTML=cart.map(item=>{const p=productById(item.id);if(!p)return '';
      return '<div class="cart-item"><div class="cart-thumb">'+imageMarkup(p)+'</div><div><h3>'+escapeHTML(p.name)+'</h3><p>Tamanho '+escapeHTML(item.size)+' · Estoque fictício: '+stock[p.id]+'</p><p class="cart-price">'+money(p.price * item.qty)+'</p><div class="cart-qty"><button type="button" data-action="minus" data-id="'+p.id+'" data-size="'+escapeHTML(item.size)+'" aria-label="Reduzir quantidade">−</button><span>'+item.qty+'</span><button type="button" data-action="plus" data-id="'+p.id+'" data-size="'+escapeHTML(item.size)+'" aria-label="Aumentar quantidade">+</button></div></div><button type="button" class="remove-item" data-action="remove" data-id="'+p.id+'" data-size="'+escapeHTML(item.size)+'">Remover</button></div>'}).join('');
    $('#summary-items').innerHTML=cart.map(item=>{const p=productById(item.id);return p?'<div class="summary-item"><span>'+item.qty+' × '+escapeHTML(p.name)+' · '+escapeHTML(item.size)+'</span><strong>'+money(p.price*item.qty)+'</strong></div>':''}).join('');
    $('#summary-subtotal').textContent=money(totalCart(cart));
    updateFulfillment();
  }
  cartItems.addEventListener('click',event=>{
    const button=event.target.closest('button[data-action]');if(!button)return;
    let cart=getCart(),item=cart.find(i=>i.id===button.dataset.id&&i.size===button.dataset.size);
    if(!item)return;
    if(button.dataset.action==='plus'){
      if(quantityInCart(item.id)<getStock()[item.id])item.qty++;
      else message.textContent='Quantidade máxima do estoque fictício atingida.';
    }
    if(button.dataset.action==='minus')item.qty=Math.max(1,item.qty-1);
    if(button.dataset.action==='remove')cart=cart.filter(i=>i!==item);
    setCart(cart);render();
  });
  function updateFulfillment(){
    const delivery=form.elements.fulfillment.value==='delivery';
    $('#delivery-fields').hidden=!delivery;
    ['zip','street','number','district','city'].forEach(name=>form.elements[name].required=delivery);
    $('#summary-shipping').textContent=delivery?(shipping===null?'A calcular':money(shipping)):'Retirada grátis';
    $('#summary-total').textContent=money(totalCart(getCart())+(delivery?shipping??0:0));
  }
  form.querySelectorAll('[name="fulfillment"]').forEach(input=>input.addEventListener('change',updateFulfillment));
  $('#zip').addEventListener('input',()=>{shipping=null;updateFulfillment()});
  $('#calculate-shipping').addEventListener('click',()=>{
    const zip=form.elements.zip.value.replace(/\D/g,'');
    if(zip.length!==8){shipping=null;$('#shipping-result').textContent='Digite um CEP com 8 números.'}
    else if(zip.startsWith('372')){shipping=1500;$('#shipping-result').textContent='Taxa fictícia para CEP 372: '+money(shipping)+'.'}
    else{shipping=null;$('#shipping-result').textContent='Fora da região simulada. Consulte a loja para entrega.'}
    updateFulfillment();
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();const cart=getCart();if(!cart.length)return;
    const stock=getStock(),delivery=form.elements.fulfillment.value==='delivery';
    if(cart.some(item=>quantityInCart(item.id)>stock[item.id])){message.textContent='Revise as quantidades: o estoque fictício foi atualizado.';render();return}
    if(delivery&&shipping===null){message.textContent='Calcule a taxa fictícia de entrega ou escolha retirada na loja.';return}
    const orderId='OP-'+Date.now().toString().slice(-7),total=totalCart(cart)+(delivery?shipping:0);
    const lines=cart.map(item=>item.qty+' × '+productById(item.id).name+' · '+item.size);
    const order={id:orderId,customer:form.elements.name.value.trim().split(/\s+/)[0].slice(0,40)||'Cliente',items:lines,fulfillment:delivery?'Entrega (simulação)':'Retirada na loja',payment:form.elements.payment.value,total,status:'Novo',date:new Date().toLocaleString('pt-BR')};
    const orders=getOrders();orders.unshift(order);setOrders(orders);
    cart.forEach(item=>stock[item.id]=Math.max(0,stock[item.id]-item.qty));setStock(stock);
    setCart([]);render();form.reset();shipping=null;updateFulfillment();
    const text='Olá, montei o pedido '+orderId+' no catálogo de demonstração da Outlet Premium. Itens: '+lines.join('; ')+'. Total fictício: '+money(total)+'. Gostaria de confirmar preço, estoque e entrega reais.';
    message.innerHTML='Pedido <strong>'+orderId+'</strong> registrado nesta demonstração. Total fictício: <strong>'+money(total)+'</strong>. Nenhum pagamento foi feito. <a class="text-link" target="_blank" rel="noopener noreferrer" href="https://wa.me/5535997687127?text='+encodeURIComponent(text)+'">Confirmar pelo WhatsApp</a>.';
    message.scrollIntoView({behavior:'smooth',block:'center'});
  });
  render();
}
function initAdmin(){
  const login=$('#admin-login'),panel=$('#admin-panel');
  $('#admin-form').addEventListener('submit',event=>{event.preventDefault();if($('#admin-password').value!=='outlet-demo-2026'){$('#admin-error').textContent='Use a senha fictícia exibida no campo.';return}login.hidden=true;panel.hidden=false;render()});
  function render(){
    const orders=getOrders(),term=$('#order-search').value.toLocaleLowerCase('pt-BR'),filter=$('#order-filter').value;
    $('#stat-total').textContent=orders.length;
    $('#stat-new').textContent=orders.filter(o=>o.status==='Novo').length;
    $('#stat-done').textContent=orders.filter(o=>o.status==='Finalizado').length;
    const visible=orders.filter(o=>(filter==='todos'||o.status===filter)&&(!term||(o.id+' '+o.customer).toLocaleLowerCase('pt-BR').includes(term)));
    $('#order-list').innerHTML=visible.length?visible.map(o=>'<article class="order-card"><div><span class="order-badge">'+escapeHTML(o.status)+'</span><h3>'+escapeHTML(o.id)+'</h3><p>'+escapeHTML(o.date)+' · '+escapeHTML(o.customer)+' · '+escapeHTML(o.fulfillment)+' · '+escapeHTML(o.payment)+' · '+money(o.total??0)+'</p><div class="order-detail">'+o.items.map(escapeHTML).join('<br>')+'</div></div><select data-id="'+escapeHTML(o.id)+'" aria-label="Status do pedido '+escapeHTML(o.id)+'">'+['Novo','Em atendimento','Finalizado','Cancelado'].map(s=>'<option'+(o.status===s?' selected':'')+'>'+s+'</option>').join('')+'</select></article>').join(''):'<div class="empty">Nenhum pedido encontrado.</div>';
    const stock=getStock();
    $('#inventory-list').innerHTML=PRODUCTS.map(p=>'<label class="inventory-row"><span>'+escapeHTML(p.name)+'</span><input type="number" min="0" max="999" value="'+stock[p.id]+'" data-id="'+p.id+'" aria-label="Estoque fictício de '+escapeHTML(p.name)+'"></label>').join('');
  }
  $('#order-search').addEventListener('input',render);
  $('#order-filter').addEventListener('change',render);
  $('#order-list').addEventListener('change',event=>{if(!event.target.matches('select[data-id]'))return;const orders=getOrders(),order=orders.find(o=>o.id===event.target.dataset.id);if(order)order.status=event.target.value;setOrders(orders);render()});
  $('#inventory-list').addEventListener('change',event=>{if(!event.target.matches('input[data-id]'))return;const stock=getStock();stock[event.target.dataset.id]=Math.max(0,Math.min(999,Number(event.target.value)||0));setStock(stock);render()});
  $('#reset-demo').addEventListener('click',()=>{localStorage.removeItem('outlet-v4-orders');localStorage.removeItem('outlet-v4-stock');render()});
}
document.addEventListener('DOMContentLoaded',()=>{initCommon();const page=document.body.dataset.page;if(page==='home')initCarousel();if(page==='catalog')initCatalog();if(page==='checkout')initCheckout();if(page==='admin')initAdmin()});
