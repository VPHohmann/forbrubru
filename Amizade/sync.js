// ===== SINCRONIZAÇÃO COM GOOGLE SHEETS =====
// Este arquivo trabalha JUNTO com seu cofre-memorias.js original

const SYNC_API_URL = 'https://script.google.com/macros/s/AKfycbzB7DC5uaL74_uelben1wwswa915fRzWntXeE43_dH_ZD_v7k0FVhVA-jem933m_Ic/exec';

// Função para carregar dados da nuvem
async function loadFromCloud() {
    try {
        const response = await fetch(SYNC_API_URL);
        const cloudMemories = await response.json();
        
        if (Array.isArray(cloudMemories) && cloudMemories.length > 0) {
            // Salva no localStorage para seu JS original usar
            localStorage.setItem('bruvan-memories', JSON.stringify(cloudMemories));
            console.log('✅ Memórias carregadas da nuvem!');
            
            // Atualiza a tela se a função existir
            if (typeof displayHistoriaTimeline === 'function') {
                displayHistoriaTimeline();
            }
        }
    } catch (error) {
        console.log('⚠️ Usando dados locais (offline)');
    }
}

// Função para salvar na nuvem
async function saveToCloud() {
    const memories = JSON.parse(localStorage.getItem('bruvan-memories') || '[]');
    
    try {
        // Salva cada memória individualmente (simplificado)
        for (const memory of memories) {
            await fetch(SYNC_API_URL, {
                method: 'POST',
                body: JSON.stringify(memory)
            });
        }
        console.log('✅ Memórias salvas na nuvem!');
    } catch (error) {
        console.log('⚠️ Erro ao salvar na nuvem');
    }
}

// Função para sincronizar (carregar + salvar)
async function syncWithCloud() {
    await loadFromCloud();  // Primeiro carrega da nuvem
    await saveToCloud();    // Depois salva locais na nuvem
}

// ===== INTERCEPTA AS FUNÇÕES ORIGINAIS =====

// Guarda a função original
const originalSaveMemory = window.saveMemory;
const originalDeleteMemory = window.deleteMemory;
const originalLoadMemories = window.loadMemories;

// Sobrescreve loadMemories
window.loadMemories = function() {
    // Tenta carregar da nuvem primeiro
    loadFromCloud().then(() => {
        // Depois chama a original (que carrega do localStorage)
        if (originalLoadMemories) originalLoadMemories();
    });
};

// Sobrescreve saveMemory
window.saveMemory = function() {
    // Chama a função original primeiro
    if (originalSaveMemory) originalSaveMemory();
    
    // Depois sincroniza com a nuvem
    setTimeout(saveToCloud, 500);
};

// Sobrescreve deleteMemory
window.deleteMemory = function(id) {
    // Chama a função original primeiro
    if (originalDeleteMemory) originalDeleteMemory(id);
    
    // Depois sincroniza com a nuvem
    setTimeout(saveToCloud, 500);
};

// Inicia a sincronização quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Se já estiver logado, sincroniza
    const isLoggedIn = localStorage.getItem('cofre-logado');
    if (isLoggedIn === 'true') {
        setTimeout(syncWithCloud, 1000);
    }
});