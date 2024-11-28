const celulas = document.querySelectorAll('[data-cell]'); // Seleciona todas as células do jogo
const textoStatus = document.querySelector('.game-status'); // Seleciona o elemento de texto de status do jogo
const botaoReiniciar = document.getElementById('restartButton'); // Seleciona o botão de reiniciar jogo
const caminhoSasuke = 'sasuke.png';  // Caminho da imagem do Sasuke
const caminhoNaruto = 'naruto.png';  // Caminho da imagem do Naruto

let vezSasuke = false; // Indica se é a vez do Sasuke
let combinacaoVencedora = null; // Armazena a combinação vencedora
let jogoAtivo = true; // Indica se o jogo está ativo

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
    if (!jogoAtivo || vezSasuke) return; // Verifica se o jogo está ativo e se não é a vez do Sasuke
    const celula = e.target;
    if (celula.children.length > 0) return;  // Previne clicar em uma célula preenchida
    colocarMarca(celula, caminhoNaruto);  // Humano joga como Naruto
    if (verificarVitoria(caminhoNaruto)) {
        finalizarJogo(false);
        desenharLinhaVitoria();
    } else if (verificarEmpate()) {
        finalizarJogo(true);
    } else {
        vezSasuke = true; // Alterna a vez
        textoStatus.textContent = "Vez de Sasuke!";
        setTimeout(jogadaBot, 500);  // Máquina joga após 0,5 segundo
    }
}

// Função para colocar a marca (imagem) na célula clicada
function colocarMarca(celula, imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    celula.appendChild(img);
}

// Função para a máquina fazer seu movimento
function jogadaBot() {
    if (!jogoAtivo) return; // Verifica se o jogo está ativo
    const celulasVazias = [...celulas].filter(celula => celula.children.length === 0);

    // Tentativa de vitória da máquina
    for (let combo of combinacoesVitoria) {
        let conta = combo.filter(index => celulas[index].querySelector('img')?.src.includes(caminhoSasuke)).length;
        let vazio = combo.filter(index => celulas[index].children.length === 0);
        if (conta === 2 && vazio.length === 1) {
            colocarMarca(celulas[vazio[0]], caminhoSasuke);
            if (verificarVitoria(caminhoSasuke)) {
                finalizarJogo(false);
                desenharLinhaVitoria();
            } else {
                vezSasuke = false;
                textoStatus.textContent = "Vez de Naruto!";
            }
            return;
        }
    }

    // Bloqueio de possível vitória do jogador
    for (let combo of combinacoesVitoria) {
        let conta = combo.filter(index => celulas[index].querySelector('img')?.src.includes(caminhoNaruto)).length;
        let vazio = combo.filter(index => celulas[index].children.length === 0);
        if (conta === 2 && vazio.length === 1) {
            colocarMarca(celulas[vazio[0]], caminhoSasuke);
            if (verificarVitoria(caminhoSasuke)) {
                finalizarJogo(false);
                desenharLinhaVitoria();
            } else {
                vezSasuke = false;
                textoStatus.textContent = "Vez de Naruto!";
            }
            return;
        }
    }

    // Movimento aleatório se não houver vitória ou bloqueio
    const indiceAleatorio = Math.floor(Math.random() * celulasVazias.length);
    const celula = celulasVazias[indiceAleatorio];
    colocarMarca(celula, caminhoSasuke);
    if (verificarVitoria(caminhoSasuke)) {
        finalizarJogo(false);
        desenharLinhaVitoria();
    } else if (verificarEmpate()) {
        finalizarJogo(true);
    } else {
        vezSasuke = false;
        textoStatus.textContent = "Vez de Naruto!";
    }
}

// Função para verificar se houve vitória
function verificarVitoria(imgSrc) {
    return combinacoesVitoria.some(combinacao => {
        const vitoria = combinacao.every(index => {
            const img = celulas[index].querySelector('img');
            return img && img.src.includes(imgSrc);
        });
        if (vitoria) {
            combinacaoVencedora = combinacao; // Armazena a combinação vencedora
        }
        return vitoria;
    });
}

// Função para verificar se houve empate
function verificarEmpate() {
    return [...celulas].every(celula => celula.children.length > 0);
}

// Função para finalizar o jogo
function finalizarJogo(empate) {
    jogoAtivo = false; // Desativa o jogo
    if (empate) {
        textoStatus.innerHTML = 'Empate! <img src="empate.gif" alt="Empate">';
    } else {
        if (vezSasuke) {
            textoStatus.innerHTML = 'Sasuke Venceu! <img src="sasuke.gif" alt="Sasuke">';
        } else {
            textoStatus.innerHTML = 'Naruto Venceu! <img src="naruto.gif" alt="Naruto">';
        }
    }
    celulas.forEach(celula => celula.removeEventListener('click', tratarClique));
}

// Função para iniciar o jogo
function iniciarJogo() {
    vezSasuke = false;
    combinacaoVencedora = null;
    jogoAtivo = true; // Ativa o jogo
    document.querySelectorAll('.linha-vitoria').forEach(linha => linha.remove());
    celulas.forEach(celula => {
        celula.innerHTML = '';
        celula.addEventListener('click', tratarClique, { once: true });
    });
    textoStatus.textContent = 'Vez de Naruto!';
}

// Adiciona evento de clique no botão de reiniciar jogo
botaoReiniciar.addEventListener('click', iniciarJogo);

// Inicia o jogo
iniciarJogo();
