// Sistema de Pop-ups para TODOS os itens
if (!localStorage.getItem('cookieAlertShown')) {
    setTimeout(() => {
        if (Math.random() > 0.5) {
            alert("🍪 ALERTA DE COOKIES!\nVocê foi infectada com: AMIZADE HOMOAFETIVA 💖");
        } else {
            alert("⚠️ ATENÇÃO ⚠️\nDetectamos falta de cookies de amizade!\nSolução: tomar no seu cu, sua vagabunda");
        }
        
        // Marca que já mostrou
        localStorage.setItem('cookieAlertShown', 'true');
        
        // Opcional: fazer sumir depois de 1 dia
        // setTimeout(() => {
        //     localStorage.removeItem('cookieAlertShown');
        // }, 24 * 60 * 60 * 1000); // 24 horas
    }, 1500);
}


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

setTimeout(() => {
    if (Math.random() > 0.5) {
        alert("🍪 ALERTA DE COOKIES!\nVocê foi infectada com: AMIZADE HOMOAFETIVA 💖");
    } else {
        alert("⚠️ ATENÇÃO ⚠️\nDetectamos falta de cookies de amizade!\nSolução: tomar no seu cu, sua vagabunda");
    }
}, 1500);
