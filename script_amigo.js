const celulas = document.querySelectorAll('[data-cell]');
const textoStatus = document.querySelector('.game-status');
const botaoReiniciar = document.getElementById('restartButton');
const srcSasuke = 'sasuke.png';
const srcNaruto = 'naruto.png';

let vezSasuke = false; // Inicia a vez do Sasuke como falsa (ou seja, Naruto começa)
let combinacaoVencedora = null;
let personagemEscolhido = null; // Variável para armazenar o personagem escolhido

// Obtém o parâmetro de URL (quem o jogador escolheu)
const urlParams = new URLSearchParams(window.location.search);
personagemEscolhido = urlParams.get('personagem');

// Define todas as combinações possíveis de vitória
const combinacoesVitoria = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Função para tratar o clique em uma célula
function tratarClique(e) {
    const celula = e.target;
    if (celula.children.length > 0) return; // Não permite clicar em uma célula já preenchida
    const classeAtual = vezSasuke ? srcSasuke : srcNaruto; // Escolhe a imagem dependendo de quem é a vez
    colocarMarca(celula, classeAtual);
    if (verificarVitoria(classeAtual)) {
        finalizarJogo(false); // Finaliza o jogo se houver um vencedor
        desenharLinhaVitoria(); // Desenha a linha da combinação vencedora
    } else if (verificarEmpate()) {
        finalizarJogo(true); // Finaliza o jogo se houver um empate
    } else {
        vezSasuke = !vezSasuke; // Alterna a vez entre os jogadores
        textoStatus.textContent = `Vez de ${vezSasuke ? "Sasuke" : "Naruto"}!`;
    }
}

// Função para colocar a marca (imagem) na célula clicada
function colocarMarca(celula, imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    celula.appendChild(img);
}

// Função para verificar se houve vitória
function verificarVitoria(imgSrc) {
    return combinacoesVitoria.some(combinacao => {
        const vitoria = combinacao.every(index => {
            const img = celulas[index].querySelector('img');
            return img && img.src.includes(imgSrc);
        });
        if (vitoria) {
            combinacaoVencedora = combinacao;
        }
        return vitoria;
    });
}

// Função para verificar se houve empate
function verificarEmpate() {
    return [...celulas].every(celula => celula.children.length > 0);
}

// Função para finalizar o jogo
// Função para finalizar o jogo
function finalizarJogo(empate) {
    if (empate) {
        
        textoStatus.innerHTML = 'Empate! <img src="empate.gif" alt="Empate">';
        textoStatus.className = 'game-status empate';  // Adiciona a classe de empate
    } else {
        if (vezSasuke) {
            textoStatus.innerHTML = 'Sasuke Venceu! <img src="sasuke.gif" alt="Sasuke">';
            textoStatus.className = 'game-status sasuke-vitoria';  // Adiciona a classe de vitória do Sasuke
        } else {
            textoStatus.innerHTML = 'Naruto Venceu! <img src="naruto.gif" alt="Naruto">';
            textoStatus.className = 'game-status naruto-vitoria';  // Adiciona a classe de vitória do Naruto
        }
    }
    celulas.forEach(celula => celula.removeEventListener('click', tratarClique));
}


// Função para iniciar o jogo
function iniciarJogo() {
    vezSasuke = personagemEscolhido === 'sasuke'; // Se a escolha foi Sasuke, ele começa
    combinacaoVencedora = null;
    document.querySelectorAll('.linha-vitoria').forEach(linha => linha.remove());
    celulas.forEach(celula => {
        celula.innerHTML = ''; // Limpa as células
        celula.addEventListener('click', tratarClique, { once: true });
    });
    textoStatus.textContent = vezSasuke ? 'Vez de Sasuke!' : 'Vez de Naruto!';
}

// Adiciona evento de clique no botão de reiniciar jogo
botaoReiniciar.addEventListener('click', iniciarJogo);

// Inicia o jogo ao carregar a página
iniciarJogo();
