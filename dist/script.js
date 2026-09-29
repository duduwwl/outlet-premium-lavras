const products = [
  { id:'camisetas-neutras', name:'Camisetas em tons neutros', category:'camisetas', label:'Camisetas', image:'/images/camisetas-neutras.png', alt:'Camisetas masculinas dobradas em branco, preto, terracota e tons claros', description:'Seleção de camisetas masculinas em tons neutros e terrosos, conforme fotografia da loja.', facts:[['Cores na foto','Branco, preto e tons terrosos'],['Marca visível','Gagnoa']] },
  { id:'camisetas-cores', name:'Camisetas em várias cores', category:'camisetas', label:'Camisetas', image:'/images/camisetas-cores.png', alt:'Camisetas masculinas dobradas em várias cores', description:'Camisetas em diferentes cores, fotografadas em uma das publicações da Outlet Premium.', facts:[['Cores na foto','Tons claros, escuros e vivos'],['Marca visível','Gagnoa']] },
  { id:'camisa-xadrez', name:'Camisa xadrez de manga longa', category:'camisas', label:'Camisas', image:'/images/camisa-xadrez.png', alt:'Homem veste camisa xadrez e jeans escuro', description:'Camisa masculina xadrez de manga longa, apresentada em composição com jeans escuro.', facts:[['Padronagem','Xadrez'],['Cor na foto','Cinza e azul']] },
  { id:'jeans-escuro', name:'Jeans de lavagem escura', category:'calcas', label:'Calças', crop:'crop-jeans-dark', alt:'Detalhe de calça jeans masculina de lavagem escura', description:'Jeans masculino de lavagem escura visto nas referências publicadas pela loja.', facts:[['Tipo','Jeans masculino'],['Lavagem na foto','Escura']] },
  { id:'jeans-lavagens', name:'Jeans em diferentes lavagens', category:'calcas', label:'Calças', crop:'crop-jeans-varied', alt:'Calças jeans masculinas em diferentes lavagens', description:'Referência de calças jeans em lavagens diferentes compartilhada pela loja.', facts:[['Tipo','Jeans masculino'],['Lavagens na foto','Azul médio e escuro']] },
  { id:'camisa-casual', name:'Camisa de manga longa', category:'camisas', label:'Camisas', crop:'crop-shirt', alt:'Homem veste camisa masculina de manga longa em padrão xadrez', description:'Camisa de manga longa em padronagem xadrez, apresentada no perfil da Outlet Premium.', facts:[['Tipo','Camisa de manga longa'],['Padronagem','Xadrez']] },
  { id:'jaqueta-marrom', name:'Jaqueta em tom terroso', category:'jaquetas', label:'Jaquetas', crop:'crop-jacket', alt:'Homem veste jaqueta masculina em tom marrom', description:'Jaqueta masculina em tom terroso apresentada nas referências da loja.', facts:[['Tipo','Jaqueta masculina'],['Cor na foto','Marrom']] },
  { id:'camisas-sociais', name:'Camisas sociais', category:'camisas', label:'Camisas', query:true, description:'Consulte a loja sobre os modelos de camisas sociais disponíveis atualmente.', facts:[['Categoria','Camisas sociais']] },
  { id:'cintos', name:'Cintos masculinos', category:'acessorios', label:'Acessórios', query:true, description:'Consulte a loja sobre os modelos de cintos masculinos disponíveis atualmente.', facts:[['Categoria','Cintos masculinos']] }
];

const grid = document.querySelector('#product-grid');
const count = document.querySelector('#catalog-count');
const empty = document.querySelector('#empty-state');
const search = document.querySelector('#catalog-search');
const filters = [...document.querySelectorAll('.filter')];
const dialog = document.querySelector('#product-dialog');
let activeFilter = 'todos';
let lastTrigger = null;

const normalized = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const whatsapp = name => 'https://wa.me/5535997687127?text=' + encodeURIComponent('Olá, vi ' + name + ' no catálogo da Outlet Premium e gostaria de saber os modelos, tamanhos, preços e disponibilidade.');

function mediaMarkup(product) {
  if (product.image) return '<img src="' + product.image + '" alt="' + product.alt + '" loading="lazy">';
  if (product.crop) return '<div class="screenshot-crop ' + product.crop + '" role="img" aria-label="' + product.alt + '"><img src="/images/instagram-produtos.png" alt="" loading="lazy"></div>';
  return '<div class="unpictured"><span>CONSULTE A SELEÇÃO</span><strong>' + product.name + '</strong><span>OUTLET PREMIUM / LAVRAS</span></div>';
}

function cardMarkup(product, index) {
  return '<article class="product-card"><button type="button" class="product-open" data-id="' + product.id + '" aria-label="Ver detalhes de ' + product.name + '"><div class="product-media">' + mediaMarkup(product) + '<span class="image-index">' + String(index + 1).padStart(2,'0') + ' / 09</span></div><div class="product-info"><div><span class="product-category">' + product.label + '</span><h3>' + product.name + '</h3><span class="product-status">' + (product.query ? 'Modelos sob consulta' : 'Preço e tamanhos sob consulta') + '</span></div><span class="product-arrow" aria-hidden="true">↗</span></div></button></article>';
}

function renderProducts() {
  const term = normalized(search.value.trim());
  const visible = products.filter(product => (activeFilter === 'todos' || product.category === activeFilter) && (!term || normalized(product.name + ' ' + product.label + ' ' + product.description).includes(term)));
  grid.innerHTML = visible.map(product => cardMarkup(product, products.indexOf(product))).join('');
  count.textContent = visible.length + (visible.length === 1 ? ' referência' : ' referências');
  empty.hidden = visible.length > 0;
  grid.hidden = visible.length === 0;
}

filters.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filters.forEach(item => { const active = item === button; item.classList.toggle('active',active); item.setAttribute('aria-pressed',String(active)); });
  renderProducts();
}));
search.addEventListener('input',renderProducts);
document.querySelector('#clear-filters').addEventListener('click', () => { search.value = ''; filters[0].click(); search.focus(); });

grid.addEventListener('click', event => {
  const trigger = event.target.closest('.product-open');
  if (!trigger) return;
  const product = products.find(item => item.id === trigger.dataset.id);
  lastTrigger = trigger;
  document.querySelector('#dialog-category').textContent = product.label + ' / OUTLET PREMIUM';
  document.querySelector('#dialog-title').textContent = product.name;
  document.querySelector('#dialog-description').textContent = product.description;
  document.querySelector('#dialog-media').innerHTML = mediaMarkup(product);
  document.querySelector('#dialog-facts').innerHTML = product.facts.map(([label,value]) => '<div><dt>' + label + '</dt><dd>' + value + '</dd></div>').join('');
  document.querySelector('#dialog-whatsapp').href = whatsapp(product.name);
  dialog.showModal();
});
document.querySelector('.dialog-close').addEventListener('click',() => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close',() => lastTrigger?.focus());

const menuButton = document.querySelector('#menu-button');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMenu() { mobileMenu.hidden = true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Abrir menu'); document.body.classList.remove('menu-open'); }
menuButton.addEventListener('click',() => { const opening = mobileMenu.hidden; mobileMenu.hidden = !opening; menuButton.setAttribute('aria-expanded',String(opening)); menuButton.setAttribute('aria-label',opening ? 'Fechar menu' : 'Abrir menu'); document.body.classList.toggle('menu-open',opening); });
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event => { if (event.key === 'Escape') closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();
renderProducts();
