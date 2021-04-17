//const proxy = 'https://cors-anywhere.herokuapp.com/';
const buttonJogar = document.querySelector('.jogar');
const buttonPular = document.querySelector('.pular');
const buttonResponder = document.querySelector('.responder')
const buttonContinuar = document.querySelector('.continuar');
const buttonResponderTarde = document.querySelector('.responder-tarde');
const buttonReiniciar = document.querySelector('.reiniciar');

const telaInicial= document.querySelector('.inicio');
const telaJogo= document.querySelector('.jogo');
const telaOpcoes= document.querySelector('.tela-opcoes');
const telaFinalizacao = document.querySelector('.finalizacao');
const tabela = document.querySelector('.tabela')

const listaCategoria = document.querySelector('#categoria');
const perguntas = document.querySelector('.pergunta');
const divRespostas = document.querySelector('.respostas');
const mostrarPontuacao = document.querySelector('.pontos')

let listaPergunta;
let perguntaGuardada;
let i;
let resp = [];
let pontos =0;
let erro =0;
let qtdeRespostas =0;

let categoria = '';
let dificuldade = '';
mostrarCategorias();

buttonJogar.addEventListener('click', () => {
    telaInicial.style.display = 'none';
    telaOpcoes.style.display = 'none';
    telaJogo.style.display = 'flex';

    const difi = document.querySelector('#dificuldades');
    const cat = document.querySelector('#categoria');

    const selectedIndex2 = cat.selectedIndex;
    categoria = cat.options[selectedIndex2].value;
    console.log(categoria);

    const selectedIndex = difi.selectedIndex;
    dificuldade = difi.options[selectedIndex].value;
    console.log(dificuldade);

    linkCategoria = `&category=${categoria}`
    linkDificuldade = `&difficulty=${dificuldade}`

    let link = 'https://opentdb.com/api.php?amount=10';
    
    if(categoria === 'any' && dificuldade !== 'any'){
        console.log('dificuldade escolhida');
        link = `${link}${linkDificuldade}`;
    }
    else if(categoria !== 'any' && dificuldade === 'any'){
        console.log('categoria escolhida');
        link = `${link}${linkCategoria}`;
    }
    else if(categoria !== 'any' && dificuldade !== 'any'){
        console.log('os 2 escolhidos');
        link = `${link}${linkCategoria}${linkDificuldade}`;
    }

   console.log(`----------------${link}`);
   
    axios.get(`${link}`,{
        params: {
          per_page: 1,
        }
    }).then((response) => {
        const aux = JSON.stringify(response.data.results);
        listaPergunta = JSON.parse(aux);
        console.log(listaPergunta);    
        
        mostrarPergunta();
        buttonPular.addEventListener('click', () => guardarPergunta());
        buttonResponder.addEventListener('click', () => responder());
   }); 
    
});

const guardarPergunta = ()=>{
    
    if (perguntaGuardada == null) {
        perguntaGuardada = listaPergunta[i];
        listaPergunta.splice(i, 1);
        // remove pegunta na posição do índice i
        mostrarPergunta();
    }
    else{
        alert('Você já possui uma pergunta guardada');
    }
}

const responderTarde = () => {
    if (perguntaGuardada != null) {
        listaPergunta.push(perguntaGuardada);
        i = listaPergunta.length-1;
        renderizarPergunta(perguntaGuardada);

    }else{
        alert('Você ainda não possui uma pergunta guardada');
    }
}

function telaOp() {  
    telaInicial.style.display = 'none';
    telaOpcoes.style.display = 'flex';
    telaJogo.style.display = 'none';

    buttonResponderTarde.addEventListener('click', () => responderTarde());
    buttonContinuar.addEventListener('click', () => mostrarPergunta());
}

const responder = () => {
    const selecionado = document.querySelector('input[name="resposta"]:checked');
    let contagem = 0;

    if (selecionado != null) {
        selecionado.value;
        console.log(selecionado);
        

       pontuacao(selecionado.value);

        divRespostas.innerHTML='';
        for (const alternativa of resp) {
            if (alternativa === listaPergunta[i].correct_answer) {
                divRespostas.innerHTML +=` 
                <div class="acerto"><input type="radio" name="resposta" value="${alternativa}"></input>
                <label for="${alternativa}">${alternativa}</label></div>`;
            } else {
                divRespostas.innerHTML +=` 
                <div class="erro"><input type="radio" name="resposta" value="${alternativa}"></input>
                <label for="${alternativa}">${alternativa}</label></div>`;
            }
           
        }
        const interval = setInterval(() => {
            contagem++;
            if (contagem >= 3) {
                clearInterval(interval);
                
                qtdeRespostas++;
                listaPergunta.splice(i, 1);
                // Começando na posição do índice i, remova um elemento
                telaOp();  
            }
        }, 1000);       
    }

}

function pontuacao(selecionado) {
    mostrarPontuacao.innerHTML ='';
    let aux ='';

    if (selecionado === listaPergunta[i].correct_answer) {
        if (listaPergunta[i].difficulty === 'easy') {
            pontos += 5;
            aux = '+5';
        }else if (listaPergunta[i].difficulty === 'medium') {
            pontos += 8;
            aux = '+8';
        }else{
            pontos += 10;
            aux = '+10';
        }
        console.log(`PARABENS ACERTOU ${pontos}`); 
    } else {
        erro++;
        if (listaPergunta[i].difficulty === 'easy') {
            pontos -= 5;
            aux = '-5';
        }else if (listaPergunta[i].difficulty === 'medium') {
            pontos -= 8;
            aux = '-8';
        }else{
            pontos -= 10;
            aux = '-10';
        }
        console.log(`ERROU ${pontos}`);
    }

    mostrarPontuacao.innerHTML = `<p>Pontuacao desta Jogada:${aux} Total:${pontos}</p>`;
    aux = '';
}

const mostrarPergunta = ()=>{
    i = Math.floor(Math.random() * listaPergunta.length);
    console.log(`pergunta atual ${i}`);
    
    if(listaPergunta.length > 0 && erro < 3){
        console.log('entrou');
        
       renderizarPergunta(listaPergunta[i]);
    }
    else{
        finalizacao();
    }
}

const renderizarPergunta = (listaPergunta) =>{
    telaInicial.style.display = 'none';
    telaOpcoes.style.display = 'none';
    telaJogo.style.display = 'flex';

    resp = [];
    perguntas.innerHTML ='';
    divRespostas.innerHTML='';

    perguntas.innerHTML = `<p>${listaPergunta.question}</p>`;

    resp.push(listaPergunta.correct_answer);
    for (const alternativa of listaPergunta.incorrect_answers) {
        resp.push(alternativa);
    }

    resp = resp.sort(() => Math.random()-0.5);
    for (const alternativa of resp) {
        divRespostas.innerHTML +=` 
        <div><input type="radio" name="resposta" value="${alternativa}"></input>
        <label for="${alternativa}">${alternativa}</label></div>`;
    }
}

function mostrarCategorias() {
    axios.get(`https://opentdb.com/api_category.php`)
    .then((response) => {
        listaCategoria.innerHTML ='';
        for (const categoria of response.data.trivia_categories) {
            listaCategoria.innerHTML += renderizarCategoria(categoria);
        }
    });
}

const renderizarCategoria = (categoria)=>`<option value="${categoria.id}">${categoria.name}</option>`
  
const zerar = () =>{
    telaInicial.style.display = 'flex';
    telaJogo.style.display = 'none';
    telaOpcoes.style.display = 'none';
    telaFinalizacao.style.display = 'none';

    mostrarPontuacao.innerHTML ='';
    listaPergunta = [];
    resp = [];
    pontos = 0;
    erro = 0; 
}

function finalizacao() {
    telaInicial.style.display = 'none';
    telaOpcoes.style.display = 'none';
    telaJogo.style.display = 'none';
    telaFinalizacao.style.display = 'flex';

    tabela.innerHTML='';

    tabela.innerHTML +=` 
        <p>Pontuação: ${pontos}</p>
        <p>Quantidade de Perguntas Respondidas: ${qtdeRespostas}</p>
        <p>Dificuldade Selecionada: ${dificuldade}</p>
        <p>Categoria Selecionada: ${categoria}</p>`;
    buttonReiniciar.addEventListener('click', () => zerar());
}
