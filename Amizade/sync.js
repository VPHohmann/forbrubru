// ===== FUNÇÃO PARA CARREGAR DA NUVEM =====
async function loadFromCloud() {
    console.log('🔄 Carregando da nuvem...');
    
    try {
        const url = SYNC_API_URL + '?t=' + Date.now();
        const response = await fetch(url);
        
        if (response.ok) {
            const cloudMemories = await response.json();
            
            if (cloudMemories && cloudMemories.length > 0) {
                localStorage.setItem('bruvan-memories', JSON.stringify(cloudMemories));
                console.log('✅ Dados sincronizados');
                
                if (typeof displayHistoriaTimeline === 'function') {
                    displayHistoriaTimeline();
                }
            }
        }
    } catch (error) {
        console.log('❌ Erro ao carregar:', error);
    }
}

// ===== FUNÇÃO PARA SALVAR NA NUVEM =====
async function saveToCloud() {
    const memories = JSON.parse(localStorage.getItem('bruvan-memories') || '[]');
    if (memories.length === 0) return;
    
    try {
        const lastMemory = memories[memories.length - 1];
        
        await fetch(SYNC_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(lastMemory)
        });
        
        console.log('✅ Memória salva na nuvem');
    } catch (error) {
        console.log('⚠️ Erro ao salvar');
    }
}

// ===== INTERCEPTA AS FUNÇÕES ORIGINAIS =====
const originalSaveMemory = window.saveMemory;
const originalDeleteMemory = window.deleteMemory;

window.saveMemory = function() {
    if (originalSaveMemory) originalSaveMemory();
    setTimeout(saveToCloud, 500);
    setTimeout(loadFromCloud, 2000);
};

window.deleteMemory = function(id) {
    if (originalDeleteMemory) originalDeleteMemory(id);
    setTimeout(loadFromCloud, 1000);
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('cofre-logado') === 'true') {
        console.log('🚀 Sincronização inicial');
        loadFromCloud();
    }
});

console.log('✅ Sync.js carregado');