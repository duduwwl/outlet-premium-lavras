"""Build the static multi-page storefront for Sites and project GitHub Pages."""
from pathlib import Path
import runpy

root = Path(__file__).parent / "dist"
runpy.run_path(str(Path(__file__).parent / "build-v3.py"))

ig = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle class="icon-dot" cx="17.7" cy="6.4" r="1"/></svg>'
wa = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.7 11.6a8.7 8.7 0 0 1-12.9 7.6l-4.6 1.2 1.2-4.5A8.7 8.7 0 1 1 20.7 11.6Z"/><path d="M8.3 7.9c-.4 0-.9.6-.9 1.2 0 2.8 4.5 6.9 7.1 6.9.8 0 1.5-.7 1.6-1.1l-2.2-1.1-.9 1c-1.5-.6-2.5-1.6-3.1-3.1l1-.9-1.1-2.2c-.4-.5-1-.7-1.5-.7Z"/></svg>'

old_logo = '<img src="/images/logo-premium.svg" alt="Outlet Premium" width="64" height="64">'
new_logo = '<span class="brand-photo" role="img" aria-label="Outlet Premium"><img src="/images/logo-instagram-referencia.png" alt=""></span>'
old_footer_logo = '<img src="/images/logo-premium.svg" alt="Outlet Premium" width="74" height="74">'
new_footer_logo = '<span class="brand-photo footer-brand-photo" role="img" aria-label="Outlet Premium"><img src="/images/logo-instagram-referencia.png" alt=""></span>'

hero = """<section class="hero" aria-label="Fotos da seleção Outlet Premium Lavras">
<div class="hero-slides" id="hero-slides">
<div class="hero-slide is-active"><img src="/images/camisa-xadrez.png" alt="Modelo com camisa xadrez e jeans" fetchpriority="high"></div>
<div class="hero-slide"><img src="/images/camisetas-neutras.png" alt="Camisetas masculinas em tons neutros" loading="lazy"></div>
<div class="hero-slide"><img src="/images/camisetas-cores.png" alt="Seleção de camisetas em várias cores" loading="lazy"></div>
<div class="hero-slide"><img src="https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1800&q=88" alt="Camisa social branca, fotografia ilustrativa" loading="lazy"></div>
</div><div class="hero-wash"></div><div class="hero-signature"><span>OUTLET PREMIUM</span><span>LAVRAS · MG</span></div>
<div class="hero-dots" role="group" aria-label="Escolher foto do destaque"><button type="button" class="is-active" data-slide="0" aria-label="Foto 1" aria-current="true"></button><button type="button" data-slide="1" aria-label="Foto 2"></button><button type="button" data-slide="2" aria-label="Foto 3"></button><button type="button" data-slide="3" aria-label="Foto 4"></button></div>
</section>"""

intro = """<section class="intro block"><div class="intro-photo"><img src="/images/camisetas-neutras.png" alt="Camisetas da Outlet Premium em tons neutros" loading="lazy"></div><div><span class="eyebrow">A CURADORIA</span><h1>Peças que acompanham seu ritmo.</h1><p>Uma seleção multimarcas para diferentes momentos. Descubra cores, texturas e combinações, com atendimento da equipe em Lavras.</p><a class="text-link" href="/catalogo/">Conhecer o catálogo</a></div></section>"""

old_hero_start = '<section class="hero" aria-label="Outlet Premium Lavras">'
old_intro_start = '<section class="intro block">'

for route in ("", "catalogo", "checkout", "admin"):
    file = root / route / "index.html"
    page = file.read_text(encoding="utf-8")
    page = page.replace('family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1', 'family=Archivo:wght@500;600;700;800&family=Manrope:wght@400;500;600;700')
    page = page.replace('<script defer src="/v3.js"></script>', '<script defer src="/v4.js"></script>')
    page = page.replace(old_logo, new_logo).replace(old_footer_logo, new_footer_logo)
    page = page.replace('<a href="/#loja" data-nav="store">A loja</a>', '')
    page = page.replace('<a href="/#loja">A loja</a>', '')
    page = page.replace('<div class="header-end"><a href="/checkout/"', '<div class="header-end"><a class="social-icon" href="https://www.instagram.com/outlet.premium.lavras/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' + ig + '</a><a class="social-icon" href="https://wa.me/5535997687127" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">' + wa + '</a><a href="/checkout/"')
    page = page.replace('<link rel="canonical" href="https://outlet-premium-lavras.duducraft11.chatgpt.site/' + (route + "/" if route else "") + '">', '')
    if route == "":
        start = page.index(old_hero_start)
        end = page.index('</section>', start) + len('</section>')
        page = page[:start] + hero + page[end:]
        start = page.index(old_intro_start)
        end = page.index('</section>', start) + len('</section>')
        page = page[:start] + intro + page[end:]
    elif route == "catalogo":
        page = page.replace('Valores, tamanhos e disponibilidade são confirmados diretamente com a loja.', 'Preços e estoque abaixo são fictícios para demonstração. Confira os itens reais com a loja.')
        page = page.replace('Nenhuma peça, valor ou estoque é garantido pelo site.', 'Preços e quantidades são simulados e não representam o estoque real da loja.')
        page = page.replace('<p class="soft-note">Preço e tamanhos sob consulta.</p>', '<p class="soft-note">Preço e estoque exibidos são fictícios.</p><label class="variant-field">Tamanho<select id="product-size"></select></label><p id="dialog-stock" class="stock-line"></p><p id="add-message" class="form-message" role="status"></p>')
    elif route == "checkout":
        page = page.replace('Este checkout é uma demonstração: preços e disponibilidade precisam ser confirmados pela loja antes de qualquer pagamento.', 'Preços, estoque e frete são fictícios para testar a compra. Confirme os valores e a disponibilidade real com a loja antes de pagar.')
        page = page.replace('<label class="full-label">Observações<textarea name="notes" rows="3" placeholder="Tamanho, cor ou outra informação útil"></textarea></label>', '')
        page = page.replace('Criar pedido de demonstração', 'Realizar pedido')
        page = page.replace('<strong>Sob consulta</strong>', '<strong id="summary-subtotal">R$ 0,00</strong>')
        page = page.replace('Preços e taxa final dependem de confirmação da loja.', 'Valores fictícios. Nenhum pagamento é processado neste site.')
        page = page.replace('<p>Valores fictícios. Nenhum pagamento é processado neste site.</p>', '<div class="summary-line summary-total"><span>Total estimado</span><strong id="summary-total">R$ 0,00</strong></div><p>Valores fictícios. Nenhum pagamento é processado neste site.</p>')
    elif route == "admin":
        page = page.replace('<div id="order-list" class="order-list"></div>', '<div id="order-list" class="order-list"></div><section class="inventory-admin"><h2>Estoque fictício</h2><p>Quantidades usadas somente na demonstração deste navegador.</p><div id="inventory-list"></div></section>')
    page = page.replace('Fotos de referência. Disponibilidade e valores sob confirmação da loja.', 'Fotos de referência. Preços e estoque são fictícios.')
    page = page.replace('<strong>Explore</strong>', '<strong>Páginas</strong>')
    # Keep both destinations, but place the map with the page links and the
    # demonstration admin entry beside the store address as requested.
    page = page.replace('<a href="/admin/">Área administrativa</a>', '<a href="https://www.google.com/maps/search/?api=1&query=Rua+Doutor+Alvaro+Botelho+188+Lavras+MG">Abrir mapa</a>')
    page = page.replace('<p>Rua Doutor Álvaro Botelho, 188<br>Centro · Lavras, MG</p><a href="https://www.google.com/maps/search/?api=1&query=Rua+Doutor+Alvaro+Botelho+188+Lavras+MG">Abrir mapa</a>', '<p>Rua Doutor Álvaro Botelho, 188<br>Centro · Lavras, MG</p><a href="/admin/">Área administrativa</a>')
    prefix = "./" if route == "" else "../"
    page = page.replace('href="/', 'href="' + prefix).replace('src="/', 'src="' + prefix)
    file.write_text(page, encoding="utf-8")

# GitHub Pages will use the same relative links at /outlet-premium-lavras/.
