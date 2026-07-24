# Suplavia — Site Institucional

Site institucional single-page da **Suplavia — Smart Supply Technology**, construído a
partir da apresentação institucional corporativa (2026).

Tecnologia estática: **HTML + CSS + JavaScript puro**, sem build, sem dependências.

## Estrutura

```
suplavia-site/
├── index.html            # landing (single-page) com todas as seções
├── compras-digital.html  # subpágina do produto Compras Digital
├── styles.css            # design system (tema escuro premium, tokens em :root)
├── script.js             # header, menu mobile, reveal, canvas do hero, scroll-spy, form
├── robots.txt         # SEO — indexação
├── sitemap.xml        # SEO — mapa do site
├── site.webmanifest   # PWA / ícone
├── assets/
│   ├── suplavia-symbol.png     # símbolo "S" (transparente) — nav e rodapé
│   ├── suplavia-logo.png       # lockup Suplavia (favicon / apple-touch / JSON-LD)
│   ├── xconecta-logo.png       # logo do produto XConecta (placa clara)
│   ├── compras-digital-logo.png# logo do produto Compras Digital (placa clara)
│   ├── hero-network.jpg        # fundo do hero (rede sobre porto industrial)
│   └── sectors.jpg             # fundo da seção "Setores"
└── README.md
```

## Marketing & SEO (implementado)

- **Formulário de captação de leads** (seção Contato): nome, empresa, e-mail,
  telefone e mensagem. Sem back-end — ao enviar, abre o app de e-mail com a
  mensagem já formatada para `atendimento@suplavia.com.br`. Validação de nome/e-mail.
- **Botão flutuante (FAB)** "Fale com um especialista" — aparece ao rolar e some
  perto da seção de contato.
- **SEO on-page:** `<title>`/description com palavras-chave (supply, IA, TOTVS,
  fornecedores), Open Graph/Twitter, dados estruturados **JSON-LD (Organization)**,
  `robots.txt` e `sitemap.xml`.
- **Logo oficial (lockup horizontal):** navbar e rodapé usam `assets/suplavia-logo.svg`
  na **versão negativa transparente** (texto branco `#EAF1FB` + **"S" azul da marca
  `#2563EB`** + tagline cinza-claro `#9DACC4`), **sem placa**, para integrar ao fundo
  escuro. Ajustar tamanho = `height` de `.brand-logo` (nav) e `.footer-logo-img`
  (rodapé) no `styles.css`. A versão em cores da marca para **fundo claro** (navy)
  está em `assets/suplavia-logo-light-bg.png` (usada no JSON-LD). Favicon =
  `assets/favicon.png` (símbolo S em placa branca).
- **Logos de produto:** **XConecta** e **Compras Digital** em placas escuras
  integradas, de tamanho uniforme (268×88), na seção Portfólio.
- **Acesso aos produtos (na seção Portfólio):** cada produto tem o **logo clicável**
  + um **botão "Conheça o ..."**.
  - **XConecta** → site exclusivo externo **https://www.xconecta.com.br** (abre em
    nova aba, ícone ↗). Não há página interna do XConecta.
  - **Compras Digital** → subpágina interna **`compras-digital.html`** (herói com
    logo, "o que é", recursos, arquitetura Fluig+ERP, processo e CTA WhatsApp).
  Para dar ao Compras Digital um site próprio no futuro, é só trocar os links
  `compras-digital.html` por a URL externa (como foi feito no XConecta).
- **Portfólio:** a tela do XConecta foi substituída por um **infográfico do
  processo** de 5 passos (Portal de fornecedores → Homologação/monitoramento/avaliação
  → Compras → Contratos → Nota Fiscal), feito em HTML/CSS + ícones SVG. O box do
  processo (`.product-media`/`.process-card`) estica para **alinhar a altura** com a
  coluna dos produtos (`.product { align-items: stretch }`).
- **Performance:** imagens otimizadas, `preload` do hero, `width/height` p/ reduzir CLS.
- **Acessibilidade:** *skip link*, foco visível (`:focus-visible`).
- **UX:** *scroll-spy* (menu destaca a seção atual), `web manifest`.

### WhatsApp (ativo)

- Número **(21) 99692-1453** → `https://wa.me/5521996921453`.
- Presente no **botão flutuante verde**, no card de contato e no rodapé.
- Para trocar o número: procure `5521996921453` no `index.html` (3 ocorrências)
  e no `script.js` (mensagem de erro do form).

### Formulário — para ir ao ar de verdade (Formspree)

1. Crie um formulário grátis em https://formspree.io (associe ao e-mail que deve
   receber os leads).
2. Copie o endpoint gerado (ex.: `https://formspree.io/f/xxxxxxx`).
3. Cole em `FORMSPREE_ENDPOINT` no topo do bloco do formulário em `script.js`.

Enquanto o endpoint estiver vazio, o envio abre o e-mail do visitante (fallback
`mailto`) — o site já funciona, mas os leads chegam melhor via Formspree.

### Outras definições

- **Analytics:** trecho **GA4 comentado** no `<head>` — informe o ID
  `G-XXXXXXXXXX` e descomente.
- **E-mails:** o site usa `atendimento@suplavia.com.br`. Confirmar se deve passar
  para `comercial@` / `privacidade@`.

## Seções (mapeadas 1:1 da apresentação)

Hero · Quem somos · Nossa origem · Propósito · Missão e visão · Cultura ·
Atuação · Portfólio (XConecta, Compras Digital e Inteligência Artificial) ·
Diferenciais · Como trabalhamos · Tecnologia · **Ecossistema TOTVS**
(especialistas — Protheus/RM/Datasul/Fluig) · Estrutura · Suplavia em números ·
Setores · Contato.

## Como visualizar

Basta abrir `index.html` no navegador. Para servir localmente (recomendado, evita
qualquer restrição de `file://`):

```bash
cd suplavia-site
python3 -m http.server 8080
# abra http://localhost:8080
```

## Marca

| Token        | Valor       | Uso                         |
|--------------|-------------|-----------------------------|
| Fundo        | `#060B18`   | base escura                 |
| Fundo alt    | `#0A1428`   | seções alternadas           |
| Superfície   | `#0E1A31`   | cards                       |
| Azul         | `#2E9BFF`   | gradiente / links           |
| Ciano        | `#12E0D4`   | acento / destaque           |

Tipografia: **Space Grotesk** (títulos) + **Inter** (corpo), via Google Fonts.

## Personalização rápida

- **Cores:** edite as variáveis em `:root` no topo de `styles.css`.
- **Textos:** todo o conteúdo está em `index.html`.
- **Contatos/links:** e-mail, LinkedIn, Movidesk e site estão no `index.html`
  (seções Estrutura, Contato e no rodapé).

## Deploy

Por ser 100% estático, publica em qualquer host: Vercel, Netlify, Cloudflare
Pages, GitHub Pages, S3/CloudFront ou o próprio servidor. Basta subir o conteúdo
da pasta.
