const SYNC_API_URL = 'https://script.google.com/macros/library/d/1NXbV3uUvPZlXvND_WTDuiKFzPvQ5zQtAi2XyKNQGn68v2qcaStoC6KwF/7';

// Carregar dados da nuvem
async function loadFromCloud() {
    try {
        const response = await fetch(SYNC_API_URL);
        const cloudMemories = await response.json();
        
        if (Array.isArray(cloudMemories) && cloudMemories.length > 0) {
            localStorage.setItem('bruvan-memories', JSON.stringify(cloudMemories));
            console.log('✅ Memórias carregadas da nuvem!');
            if (typeof displayHistoriaTimeline === 'function') {
                displayHistoriaTimeline();
            }
        }
    } catch (error) {
        console.log('⚠️ Erro ao carregar da nuvem:', error);
    }
}

// Salvar na nuvem
async function saveToCloud() {
    const memories = JSON.parse(localStorage.getItem('bruvan-memories') || '[]');
    
    try {
        for (const memory of memories) {
            await fetch(SYNC_API_URL, {
                method: 'POST',
                body: JSON.stringify(memory)
            });
        }
        console.log('✅ Memórias salvas na nuvem!');
    } catch (error) {
        console.log('⚠️ Erro ao salvar na nuvem:', error);
    }
}

// ===== INTERCEPTA AS FUNÇÕES ORIGINAIS =====
const originalSaveMemory = window.saveMemory;
const originalDeleteMemory = window.deleteMemory;

window.saveMemory = function() {
    if (originalSaveMemory) originalSaveMemory();
    setTimeout(saveToCloud, 500);
};

window.deleteMemory = function(id) {
    if (originalDeleteMemory) originalDeleteMemory(id);
    setTimeout(saveToCloud, 500);
};

// Carrega da nuvem quando a página inicia
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('cofre-logado');
    if (isLoggedIn === 'true') {
        setTimeout(loadFromCloud, 1500);
    }
});

console.log('✅ Sync.js carregado');