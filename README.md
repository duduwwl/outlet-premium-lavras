# Outlet Premium Lavras

Site estático de demonstração da Outlet Premium Lavras, com páginas de início, catálogo, sacola/checkout e administração.

**GitHub Pages:** a publicação usa a branch `main`, pasta `/docs`. As quatro páginas abaixo pertencem ao mesmo site e têm endereços próprios.

## Páginas

- [Início](https://duduwwl.github.io/outlet-premium-lavras/)
- [Catálogo](https://duduwwl.github.io/outlet-premium-lavras/catalogo/)
- [Sacola e checkout](https://duduwwl.github.io/outlet-premium-lavras/checkout/)
- [Painel administrativo demonstrativo](https://duduwwl.github.io/outlet-premium-lavras/admin/)

O catálogo e a sacola estão no cabeçalho. O painel também pode ser aberto pelo link “Área administrativa” no rodapé de qualquer página. O checkout e o painel são páginas públicas, mas têm `noindex` para não aparecerem em resultados de busca; isso não impede o acesso pelos links acima.

## Estrutura

- `dist/`: versão publicada no endereço original do site.
- `docs/`: versão publicada pelo GitHub Pages, com URLs relativas ao caminho `/outlet-premium-lavras/`.
- `build-v4.py`: gera as quatro páginas em `dist/`.
- `build-github-pages.py`: copia `dist/` para `docs/` e ajusta `robots.txt` e `sitemap.xml` para o domínio do GitHub Pages.

## Executar localmente

```powershell
python build-v4.py
python build-github-pages.py
python -m http.server 8000 --directory docs
```

Abra `http://localhost:8000/`.

## Limites da demonstração

Os preços, o estoque, o frete e os pedidos são **fictícios**. Sacola, pedidos e painel são salvos apenas no `localStorage` do navegador. A senha exibida no painel é ilustrativa. O site não cobra Pix ou cartão e não envia dados de pagamento. Para operar vendas reais em diferentes dispositivos, é preciso integrar um serviço de pedidos, autenticação, controle de estoque e provedor de pagamentos.

As fotos fornecidas pela loja foram usadas como referência. Algumas imagens adicionais do catálogo vêm do Unsplash e são sinalizadas como ilustrativas. Antes de usar comercialmente, confirme os direitos de uso e substitua imagens ilustrativas pelos produtos reais.
