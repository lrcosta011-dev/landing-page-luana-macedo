const fs = require('fs');

const projects = [
  {
    id: 'residencial',
    title: 'Residência D.E',
    local: 'Brasília, DF',
    desc: 'O presente portfólio contém apenas algumas páginas do material desenvolvido para o Executivo Arquitetônico. Este memorial descritivo sintetiza o projeto executivo de uma residência com 283,21 m² de área construída em um lote de 867,64 m², detalhando minuciosamente dois pavimentos que integram áreas sociais no térreo — como salas de estar e jantar, cozinha, área de lazer com piscina e SPA, e um orquidário exclusivo — a uma zona íntima no pavimento superior composta por sala de TV e suítes. O arquivo estabelece padrões rigorosos de acabamento, especificando revestimentos de marcas como Portobello e Biancogres, sistemas de iluminação com fitas de LED e sancas, além de um detalhamento minucioso de marcenaria em MDF (tonalidades como Louro Freijó e Azul Secreto), bancadas em Silestone Branco e esquadrias de alumínio e vidro, como o guia definitivo para a execução fiel dos elementos estruturais, elétricos, hidrossanitários e de mobiliário planejado.',
    folder: 'residencial D.E 1',
    prefix: 'Portfólio Residencial 1 - Luana Macedo - (',
    count: 19
  },
  {
    id: 'auditorio',
    title: 'Auditório Dois Candangos',
    local: 'Campus Darcy Ribeiro — UnB',
    desc: 'Projeto de reforma para o Auditório Dois Candangos, localizado no Campus Darcy Ribeiro — UnB. A demanda buscava o restauro de um auditório ícone da universidade que estava desativado por falta de infraestrutura. Foram utilizadas novas técnicas de obra para uma identidade visual moderna mas ainda assim, valorizando o clássico.',
    folder: 'Auditorio Dois Candangos',
    prefix: 'Comercial Auditório Dois Candangos (',
    count: 11
  },
  {
    id: 'mesp',
    title: 'Vestiário MESP',
    local: 'Campus FCTE UnB Gama',
    desc: 'Projeto de extensão de quadra esportiva, localizado no Campus FCTE UnB Gama. O objetivo era atender à alta demanda de vestiários femininos e masculinos em uma região razoavelmente distante dos sanitários existentes, além da criação de um depósito de materiais esportivos e uma área de administração para funcionários do campus.',
    folder: 'Vestiário MESP',
    prefix: 'comercial -Vestiário MESP (',
    count: 8
  },
  {
    id: 'maker',
    title: 'Espaço Maker',
    local: 'ICC Sul, UnB',
    desc: 'Projeto de reforma do Laboratório de Física, localizado no ICC Sul, para a demanda de criação de sala de aula integrada com os espaços práticos, com auxílio de novos pontos hidráulicos e elétricos.',
    folder: 'Espaço Maker',
    prefix: 'Comercial Espaço Maker (',
    count: 6
  }
];

let html = '';

projects.forEach(p => {
  html += `
    <!-- View: Projeto ${p.title} -->
    <section id="view-projeto-${p.id}" class="view-section" style="display: none;">
      <div class="container project-layout pt-xl pb-large">
        <aside class="project-sidebar fade-element">
          <h1 class="project-title">${p.title}</h1>
          <nav class="project-nav">
            <a href="#desc-${p.id}">Descrição</a>
            <a href="#galeria-${p.id}">Galeria</a>
          </nav>
          <a href="#" data-view="projetos" class="btn-voltar">← VOLTAR</a>
        </aside>
        
        <main class="project-content fade-element">
          <div class="project-hero">
            <img src="../portfolio/imagens/${p.folder}/${p.prefix}1).png" alt="${p.title} Capa">
          </div>
          
          <div id="desc-${p.id}" class="project-metadata mt-medium">
            <div class="meta-item">
              <span class="meta-label">Local</span>
              <span class="meta-value">${p.local}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Ano</span>
              <span class="meta-value">2024-2026</span>
            </div>
          </div>
          
          <div class="project-description mt-medium">
            <p>${p.desc}</p>
          </div>
          
          <div id="galeria-${p.id}" class="project-gallery mt-large">
            <div class="arquea-gallery">
              <div class="container-fluid">`;
              
  for(let i=1; i<=p.count; i++) {
    const imgSrc = `../portfolio/imagens/${p.folder}/${p.prefix}${i}).png`;
    html += `
                <article class="gallery-item" onclick="openLightbox('${imgSrc}')">
                  <div class="gallery-img">
                    <img src="${imgSrc}" alt="${p.title} ${i}" loading="lazy">
                  </div>
                </article>`;
  }
              
  html += `
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  `;
});

const indexPath = 'c:/Users/costa/Downloads/lulua/portfolio-minimalist/index.html';
let indexContent = fs.readFileSync(indexPath, 'utf-8');

// We will insert this HTML right before the "View: Sobre"
const splitMarker = '<!-- ==============================================';
const sections = indexContent.split('<!-- ==============================================');

// Find the index of the SOBRE section
let sobreIndex = -1;
for(let i=0; i<sections.length; i++) {
  if (sections[i].includes('VIEW: SOBRE')) {
    sobreIndex = i;
    break;
  }
}

if (sobreIndex !== -1) {
  sections.splice(sobreIndex, 0, '\n    ' + html + '\n    ');
  fs.writeFileSync(indexPath, sections.join('<!-- =============================================='));
  console.log('Projetos adicionados com sucesso ao index.html');
} else {
  console.log('Não foi possível encontrar a seção SOBRE no index.html');
}
