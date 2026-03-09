
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('popupOverlay');
    const closeButtons = document.querySelectorAll('.popup-close, .close-btn');
    
    // 1. ITENS DO MENU (todos com data-popup)
    const menuItems = document.querySelectorAll('[data-popup]');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // ← IMPEDE IR PARA #
            
            const popupType = this.getAttribute('data-popup');
            const popupId = 'popup' + popupType.charAt(0).toUpperCase() + popupType.slice(1);
            const popup = document.getElementById(popupId);
            
            if (popup) {
                // Fecha qualquer aberto
                document.querySelectorAll('.popup').forEach(p => {
                    p.classList.remove('active');
                });
                
                // Abre o novo
                overlay.classList.add('active');
                popup.classList.add('active');
                
                // Atualiza menu ativo (só para links)
                if (this.classList.contains('nav-link') || this.classList.contains('logo')) {
                    menuItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // 2. CARDS (também com data-popup)
    const cards = document.querySelectorAll('.card-item[data-popup]');
    
    cards.forEach(card => {
        card.style.cursor = 'pointer'; // Mostra que é clicável
        
        card.addEventListener('click', function() {
            const popupType = this.getAttribute('data-popup');
            const popupId = 'popup' + popupType.charAt(0).toUpperCase() + popupType.slice(1);
            const popup = document.getElementById(popupId);
            
            if (popup) {
                // Fecha qualquer aberto
                document.querySelectorAll('.popup').forEach(p => {
                    p.classList.remove('active');
                });
                
                // Abre o novo
                overlay.classList.add('active');
                popup.classList.add('active');
            }
        });
    });
    
    // 3. FECHAR POP-UPS
    function closeAllPopups() {
        overlay.classList.remove('active');
        document.querySelectorAll('.popup').forEach(popup => {
            popup.classList.remove('active');
        });
    }
    
    // Botões de fechar
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllPopups);
    });
    
    // Clicar no overlay
    overlay.addEventListener('click', closeAllPopups);
    
    // Tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllPopups();
        }
    });
    
    // Impedir fechar ao clicar dentro do pop-up
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    console.log('✅ Sistema de pop-ups carregado!');
    console.log('Total de itens clicáveis:', menuItems.length + cards.length);
});

// ARRAY COM TODOS OS SEGREDOS (você pode adicionar quantos quiser!)
const segredos = [
    "Vai pesesar ou não? PESOU: fiquei 13 anos de luto",
    "Já operei o dedinho da mão (e o cara do mcdonalds riu do meu dedo enfaixado)",
    "Já fingi que gostava de series que na vdd eu só li o wiki de personagens para ter assunto com a galera",
    "Amo ursinhos de pelúcia...",
    "AMO ser sua amiga vc é meu baby",
    "Já chorei (muito) por causa de aranhas",
    "Uma vez fingi que eu era A do PLL e sai ameaçando pessoas online... e a escola",
    "Aprendi a cozinhar só porque ninguém acerta a quantidade exorbitante de alho que eu gosto",
    "Já dei ghosting e me arrependi depois",
    "Toda vez que eu to MUITO triste, eu escuto The Pretty Reckless, só quando to triste",
    "Eu acordo muito simpática de endoscopias então todo mundo acha que eu sou legal pois saio conversando com todos",
    "Sou medrosa a respeito de homens e de ficar sozinha fora de casa",
    "Tenho um crush secreto em um personagem de desenho... Madara Uchiha...",
    "Não sei porque mas ser sua amiga me ajudou a superar a Mc Catra, acho que vc é tipo um anjo (com nada angelical)",
    "Amo cuidar de plantas mas sou péssima nisso e todas elas morrem...",
    "Acho que sou meio controladora com as coisas que gosto",
    "Sei tocar teclado... mas ninguem sabe",
    "JOGUEI THE SIMS POR 20 HORAS DIRETAS UMA VEZ",
    "Já stalkeei até a tia-avó de alguém no Instagram...",
    "Explodi o microondas uma vez",
    "Eu roubava bastante quando era criança",
    "Eu amo e odeio o natal",
    "Európio, Telúrio, Amerício, Oxigênio (olha a burra indo procurar no Google kkkkkk",
    "Eu gosto de matemática, mas eu não sei fazer conta de cabeça",
    "Tenho exatamente 801 mensagens favoritas na nossa conversa",
    "Tem 25 segredos aqui, mas só vou te contar 24 por enquanto...",
];

// VARIÁVEIS PARA CONTROLAR
let segredosRevelados = [];
let segredosMostrados = [];
let clickCount = 0;

// ELEMENTOS DO DOM
const revealBtn = document.getElementById('revealSecretBtn');
const secretsList = document.getElementById('secretsList');
const clickCountEl = document.getElementById('clickCount');
const uniqueSecretsEl = document.getElementById('uniqueSecrets');
const clearBtn = document.getElementById('clearSecretsBtn');

// FUNÇÃO PARA GERAR SEGREDO ALEATÓRIO
function gerarSegredo() {
    clickCount++;
    clickCountEl.textContent = clickCount;
    
    // Se já mostrou todos os segredos, começa de novo
    if (segredosMostrados.length === segredos.length) {
        segredosMostrados = [];
    }
    
    // Encontra um segredo que ainda não foi mostrado
    let segredoAleatorio;
    let tentativas = 0;
    
    do {
        segredoAleatorio = segredos[Math.floor(Math.random() * segredos.length)];
        tentativas++;
        
        // Se tentou muitas vezes e não achou um novo, reseta
        if (tentativas > segredos.length * 2) {
            segredosMostrados = [];
            break;
        }
    } while (segredosMostrados.includes(segredoAleatorio));
    
    // Adiciona à lista de mostrados
    segredosMostrados.push(segredoAleatorio);
    
    // Adiciona à lista de revelados (se for único)
    if (!segredosRevelados.includes(segredoAleatorio)) {
        segredosRevelados.push(segredoAleatorio);
        uniqueSecretsEl.textContent = segredosRevelados.length;
    }
    
    // Cria o elemento do segredo
    const secretElement = document.createElement('div');
    secretElement.className = 'secret-item';
    secretElement.innerHTML = `
        <div class="secret-number">#${segredosRevelados.length}</div>
        <div class="secret-text">${segredoAleatorio}</div>
        <div class="secret-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    `;
    
    // Remove o estado vazio se existir
    const emptyState = secretsList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    // Adiciona no topo da lista
    secretsList.insertBefore(secretElement, secretsList.firstChild);
    
    // Efeito visual
    secretElement.style.animation = 'fadeIn 0.5s ease';
    
    // Limita a lista a 10 itens
    if (secretsList.children.length > 10) {
        secretsList.removeChild(secretsList.lastChild);
    }
    
    // Efeito no botão
    revealBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        revealBtn.style.transform = 'scale(1)';
    }, 150);
}

// FUNÇÃO PARA LIMPAR TUDO
function limparSegredos() {
    segredosRevelados = [];
    segredosMostrados = [];
    clickCount = 0;
    
    clickCountEl.textContent = '0';
    uniqueSecretsEl.textContent = '0';
    
    secretsList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-lock"></i>
            <p>Ainda nenhum segredo revelado... vai clicar na caixa, medrosa!</p>
        </div>
    `;
}

// EVENT LISTENERS
revealBtn.addEventListener('click', gerarSegredo);
clearBtn.addEventListener('click', limparSegredos);

// Efeito de hover na caixa
const secretBox = document.querySelector('.secret-box');
secretBox.addEventListener('mouseenter', () => {
    secretBox.style.transform = 'translateY(-5px)';
});

secretBox.addEventListener('mouseleave', () => {
    secretBox.style.transform = 'translateY(0)';
});