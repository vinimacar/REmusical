// Configuração do Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variáveis globais
let ensaios = [];
let instrumentos = [];
let musicos = [];
let frequencias = [];
let chartPresencaMusicos = null;
let chartPresencaMinisterio = null;

// Dados serão carregados exclusivamente do Firebase

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    configurarEventos();
    carregarDados();
}

async function carregarDados() {
    try {
        // Carregar ensaios
        const ensaiosSnapshot = await db.collection('ensaios').get();
        ensaios = [];
        ensaiosSnapshot.forEach(doc => {
            ensaios.push({ id: doc.id, ...doc.data() });
        });
        
        // Carregar instrumentos
        const instrumentosSnapshot = await db.collection('instrumentos').get();
        instrumentos = [];
        instrumentosSnapshot.forEach(doc => {
            instrumentos.push({ id: doc.id, ...doc.data() });
        });
        
        // Carregar músicos
        const musicosSnapshot = await db.collection('musicos').get();
        musicos = [];
        musicosSnapshot.forEach(doc => {
            musicos.push({ id: doc.id, ...doc.data() });
        });
        
        // Carregar frequências
        const frequenciasSnapshot = await db.collection('frequencias').get();
        frequencias = [];
        frequenciasSnapshot.forEach(doc => {
            frequencias.push({ id: doc.id, ...doc.data() });
        });
        
        // Atualizar interface
        atualizarDashboard();
        if (document.getElementById('corpoTabelaInstrumentos')) {
            atualizarTabelaRelatorio();
        }
        atualizarSelectInstrumentos();
        atualizarListaEnsaios();
        atualizarListaInstrumentos();
        atualizarListaMusicos();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarMensagem('Erro ao carregar dados do banco de dados.', 'error');
    }
}

function configurarEventos() {
    // Formulário de ensaios
    const formEnsaio = document.getElementById('formEnsaio');
    if (formEnsaio) {
        formEnsaio.addEventListener('submit', cadastrarEnsaio);
    }
    
    // Formulário de instrumentos
    const formInstrumento = document.getElementById('formInstrumento');
    if (formInstrumento) {
        formInstrumento.addEventListener('submit', cadastrarInstrumento);
    }
    
    // Formulário de músicos
    const formMusico = document.getElementById('formMusico');
    if (formMusico) {
        formMusico.addEventListener('submit', cadastrarMusico);
    }
    
    // Formulário de frequência
    const formFrequencia = document.getElementById('formFrequencia');
    if (formFrequencia) {
        formFrequencia.addEventListener('submit', registrarFrequencia);
    }
    
    // Evento para atualizar família automaticamente
    const selectInstrumento = document.getElementById('instrumentoMusico');
    if (selectInstrumento) {
        selectInstrumento.addEventListener('change', atualizarFamiliaMusico);
    }
}

// Função para mostrar seções
function showSection(sectionName) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Atualizar gráficos se for dashboard
    if (sectionName === 'dashboard') {
        setTimeout(() => {
            criarGraficos();
        }, 100);
    }
}

// Função para mostrar abas
function showTab(tabName) {
    // Remover classe active de todas as abas
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));
    
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Ativar aba selecionada
    const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (activeButton) activeButton.classList.add('active');
    
    const activeContent = document.getElementById(`${tabName}-tab`);
    if (activeContent) activeContent.classList.add('active');
}

// FUNÇÕES DE CADASTRO DE ENSAIOS
async function cadastrarEnsaio(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nomeEnsaio').value;
    const tipo = document.getElementById('tipoEnsaio').value;
    const descricao = document.getElementById('descricaoEnsaio').value;
    const data = document.getElementById('dataEnsaio').value;
    const duracao = parseInt(document.getElementById('duracaoEnsaio').value);
    const responsavel = document.getElementById('responsavelEnsaio').value;
    const local = document.getElementById('localEnsaio').value;
    
    try {
        await db.collection('ensaios').add({
            nome,
            tipo,
            descricao,
            data,
            duracao,
            responsavel,
            local,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        mostrarMensagem('Ensaio cadastrado com sucesso!', 'success');
        document.getElementById('formEnsaio').reset();
        carregarDados();
        
    } catch (error) {
        console.error('Erro ao cadastrar ensaio:', error);
        mostrarMensagem('Erro ao cadastrar ensaio.', 'error');
    }
}

function atualizarListaEnsaios() {
    const lista = document.getElementById('listaEnsaios');
    if (!lista) return;
    
    lista.innerHTML = '';
    
    ensaios.forEach(ensaio => {
        const item = document.createElement('div');
        item.className = 'lista-item';
        item.innerHTML = `
            <div class="item-info">
                <h4>${ensaio.nome}</h4>
                <p><strong>Tipo:</strong> ${ensaio.tipo}</p>
                <p><strong>Data:</strong> ${new Date(ensaio.data).toLocaleString('pt-BR')}</p>
                <p><strong>Responsável:</strong> ${ensaio.responsavel}</p>
                <p><strong>Local:</strong> ${ensaio.local}</p>
                <p><strong>Duração:</strong> ${ensaio.duracao} minutos</p>
                ${ensaio.descricao ? `<p><strong>Descrição:</strong> ${ensaio.descricao}</p>` : ''}
            </div>
            <div class="item-actions">
                <button onclick="excluirEnsaio('${ensaio.id}')" class="btn-delete">Excluir</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

async function excluirEnsaio(id) {
    if (confirm('Tem certeza que deseja excluir este ensaio?')) {
        try {
            await db.collection('ensaios').doc(id).delete();
            mostrarMensagem('Ensaio excluído com sucesso!', 'success');
            carregarDados();
        } catch (error) {
            console.error('Erro ao excluir ensaio:', error);
            mostrarMensagem('Erro ao excluir ensaio.', 'error');
        }
    }
}

// FUNÇÕES DE CADASTRO DE INSTRUMENTOS
async function cadastrarInstrumento(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nomeInstrumento').value;
    const familia = document.getElementById('familiaInstrumento').value;
    const descricao = document.getElementById('descricaoInstrumento').value;
    
    try {
        await db.collection('instrumentos').add({
            nome,
            familia,
            descricao,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        mostrarMensagem('Instrumento cadastrado com sucesso!', 'success');
        document.getElementById('formInstrumento').reset();
        carregarDados();
        
    } catch (error) {
        console.error('Erro ao cadastrar instrumento:', error);
        mostrarMensagem('Erro ao cadastrar instrumento.', 'error');
    }
}

function atualizarListaInstrumentos() {
    const lista = document.getElementById('listaInstrumentos');
    if (!lista) return;
    
    lista.innerHTML = '';
    
    instrumentos.forEach(instrumento => {
        const item = document.createElement('div');
        item.className = 'lista-item';
        item.innerHTML = `
            <div class="item-info">
                <h4>${instrumento.nome}</h4>
                <p><strong>Família:</strong> ${instrumento.familia}</p>
                ${instrumento.descricao ? `<p><strong>Descrição:</strong> ${instrumento.descricao}</p>` : ''}
            </div>
            <div class="item-actions">
                <button onclick="excluirInstrumento('${instrumento.id}')" class="btn-delete">Excluir</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

async function excluirInstrumento(id) {
    if (confirm('Tem certeza que deseja excluir este instrumento?')) {
        try {
            await db.collection('instrumentos').doc(id).delete();
            mostrarMensagem('Instrumento excluído com sucesso!', 'success');
            carregarDados();
        } catch (error) {
            console.error('Erro ao excluir instrumento:', error);
            mostrarMensagem('Erro ao excluir instrumento.', 'error');
        }
    }
}

// FUNÇÕES DE CADASTRO DE MÚSICOS
async function cadastrarMusico(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nomeMusico').value;
    const telefone = document.getElementById('telefoneMusico').value;
    const cidade = document.getElementById('cidadeMusico').value;
    const congregacao = document.getElementById('congregacaoMusico').value;
    const instrumentoId = document.getElementById('instrumentoMusico').value;
    const familia = document.getElementById('familiaMusico').value;
    const ativo = document.getElementById('ativoMusico').checked;
    
    try {
        await db.collection('musicos').add({
            nome,
            telefone,
            cidade,
            congregacao,
            instrumentoId,
            familia,
            ativo,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        mostrarMensagem('Músico cadastrado com sucesso!', 'success');
        document.getElementById('formMusico').reset();
        document.getElementById('familiaMusico').value = '';
        carregarDados();
        
    } catch (error) {
        console.error('Erro ao cadastrar músico:', error);
        mostrarMensagem('Erro ao cadastrar músico.', 'error');
    }
}

function atualizarListaMusicos() {
    const lista = document.getElementById('listaMusicos');
    if (!lista) return;
    
    lista.innerHTML = '';
    
    musicos.forEach(musico => {
        const instrumento = instrumentos.find(i => i.id === musico.instrumentoId);
        const nomeInstrumento = instrumento ? instrumento.nome : 'Instrumento não encontrado';
        
        const item = document.createElement('div');
        item.className = 'lista-item';
        item.innerHTML = `
            <div class="item-info">
                <h4>${musico.nome} ${musico.ativo ? '' : '(Inativo)'}</h4>
                <p><strong>Telefone:</strong> ${musico.telefone}</p>
                <p><strong>Cidade:</strong> ${musico.cidade}</p>
                <p><strong>Congregação:</strong> ${musico.congregacao}</p>
                <p><strong>Instrumento:</strong> ${nomeInstrumento}</p>
                <p><strong>Família:</strong> ${musico.familia}</p>
            </div>
            <div class="item-actions">
                <button onclick="toggleAtivoMusico('${musico.id}', ${!musico.ativo})" class="btn-toggle">
                    ${musico.ativo ? 'Desativar' : 'Ativar'}
                </button>
                <button onclick="excluirMusico('${musico.id}')" class="btn-delete">Excluir</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

function atualizarFamiliaMusico() {
    const selectInstrumento = document.getElementById('instrumentoMusico');
    const inputFamilia = document.getElementById('familiaMusico');
    
    if (!selectInstrumento || !inputFamilia) return;
    
    const instrumentoId = selectInstrumento.value;
    const instrumento = instrumentos.find(i => i.id === instrumentoId);
    
    if (instrumento) {
        inputFamilia.value = instrumento.familia;
    } else {
        inputFamilia.value = '';
    }
}

async function toggleAtivoMusico(id, novoStatus) {
    try {
        await db.collection('musicos').doc(id).update({
            ativo: novoStatus
        });
        
        mostrarMensagem(`Músico ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`, 'success');
        carregarDados();
    } catch (error) {
        console.error('Erro ao atualizar status do músico:', error);
        mostrarMensagem('Erro ao atualizar status do músico.', 'error');
    }
}

async function excluirMusico(id) {
    if (confirm('Tem certeza que deseja excluir este músico?')) {
        try {
            await db.collection('musicos').doc(id).delete();
            mostrarMensagem('Músico excluído com sucesso!', 'success');
            carregarDados();
        } catch (error) {
            console.error('Erro ao excluir músico:', error);
            mostrarMensagem('Erro ao excluir músico.', 'error');
        }
    }
}

// FUNÇÕES DE FREQUÊNCIA
async function registrarFrequencia(e) {
    e.preventDefault();
    
    const data = document.getElementById('dataFrequencia').value;
    const ensaioId = document.getElementById('ensaioFrequencia').value;
    const musicoId = document.getElementById('musicoFrequencia').value;
    const presente = document.getElementById('presenteFrequencia').checked;
    const observacoes = document.getElementById('observacoesFrequencia').value;
    
    try {
        await db.collection('frequencias').add({
            data,
            ensaioId,
            musicoId,
            presente,
            observacoes,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        mostrarMensagem('Frequência registrada com sucesso!', 'success');
        document.getElementById('formFrequencia').reset();
        carregarDados();
        
    } catch (error) {
        console.error('Erro ao registrar frequência:', error);
        mostrarMensagem('Erro ao registrar frequência.', 'error');
    }
}

// FUNÇÕES DE ATUALIZAÇÃO DE INTERFACE
function atualizarDashboard() {
    const totalEnsaios = document.getElementById('totalEnsaios');
    const totalInstrumentos = document.getElementById('totalInstrumentos');
    const totalMusicos = document.getElementById('totalMusicos');
    const musicosAtivos = document.getElementById('musicosAtivos');
    
    if (totalEnsaios) totalEnsaios.textContent = ensaios.length;
    if (totalInstrumentos) totalInstrumentos.textContent = instrumentos.length;
    if (totalMusicos) totalMusicos.textContent = musicos.length;
    if (musicosAtivos) {
        const ativos = musicos.filter(m => m.ativo).length;
        musicosAtivos.textContent = ativos;
    }
}

function atualizarSelectInstrumentos() {
    const select = document.getElementById('instrumentoMusico');
    if (!select) return;
    
    // Limpar opções existentes (exceto a primeira)
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    // Adicionar instrumentos
    instrumentos.forEach(instrumento => {
        const option = document.createElement('option');
        option.value = instrumento.id;
        option.textContent = `${instrumento.nome} (${instrumento.familia})`;
        select.appendChild(option);
    });
}

function criarGraficos() {
    criarGraficoPresencaMusicos();
    criarGraficoPresencaMinisterio();
}

function criarGraficoPresencaMusicos() {
    const ctx = document.getElementById('chartPresencaMusicos');
    if (!ctx) return;
    
    if (chartPresencaMusicos) {
        chartPresencaMusicos.destroy();
    }
    
    const familias = ['Cordas', 'Madeiras', 'Metal'];
    const cores = ['#FF6384', '#36A2EB', '#FFCE56'];
    
    const dados = familias.map(familia => {
        return musicos.filter(m => m.familia === familia && m.ativo).length;
    });
    
    chartPresencaMusicos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: familias,
            datasets: [{
                data: dados,
                backgroundColor: cores,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Músicos Ativos por Família'
                }
            }
        }
    });
}

function criarGraficoPresencaMinisterio() {
    const ctx = document.getElementById('chartPresencaMinisterio');
    if (!ctx) return;
    
    if (chartPresencaMinisterio) {
        chartPresencaMinisterio.destroy();
    }
    
    // Dados dos últimos ensaios
    const ultimosEnsaios = ensaios.slice(-6).map(ensaio => {
        const data = new Date(ensaio.data);
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    });
    
    const presencas = ensaios.slice(-6).map(() => {
        return Math.floor(Math.random() * 20) + 10; // Dados simulados
    });
    
    chartPresencaMinisterio = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ultimosEnsaios,
            datasets: [{
                label: 'Presença',
                data: presencas,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Presença nos Últimos Ensaios'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5
                    }
                }
            }
        }
    });
}

function atualizarTabelaRelatorio() {
    const corpoTabela = document.getElementById('corpoTabelaInstrumentos');
    if (!corpoTabela) return;
    
    corpoTabela.innerHTML = '';
    
    instrumentos.forEach(instrumento => {
        const musicosInstrumento = musicos.filter(m => m.instrumentoId === instrumento.id && m.ativo);
        
        const row = document.createElement('tr');
        if (row) {
            row.innerHTML = `
                <td>${instrumento.nome}</td>
                <td>${instrumento.familia}</td>
                <td>${musicosInstrumento.length}</td>
                <td>${musicosInstrumento.length}</td>
                <td>100%</td>
            `;
            corpoTabela.appendChild(row);
        }
    });
}

function atualizarDataRelatorio() {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const elementoData = document.getElementById('dataRelatorio');
    if (elementoData) {
        elementoData.textContent = dataAtual;
    }
}

function mostrarMensagem(texto, tipo) {
    // Remover mensagem anterior se existir
    const mensagemAnterior = document.querySelector('.mensagem');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }
    
    const mensagem = document.createElement('div');
    mensagem.className = `mensagem ${tipo}`;
    mensagem.textContent = texto;
    
    // Adicionar estilos inline para garantir visibilidade
    mensagem.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        max-width: 300px;
        word-wrap: break-word;
        ${tipo === 'success' ? 'background-color: #4CAF50;' : 'background-color: #f44336;'}
    `;
    
    document.body.appendChild(mensagem);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (mensagem.parentNode) {
            mensagem.parentNode.removeChild(mensagem);
        }
    }, 5000);
}

function exportarDados() {
    const dados = {
        ensaios,
        instrumentos,
        musicos,
        frequencias,
        dataExportacao: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dados, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `dados_sistema_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function imprimirRelatorio() {
    window.print();
}

// Estilos para impressão
const style = document.createElement('style');
style.textContent = `
    @media print {
        nav, footer, .section:not(#relatorio) {
            display: none !important;
        }
        #relatorio {
            display: block !important;
        }
        body {
            background: white !important;
        }
        .section {
            box-shadow: none !important;
            border: 1px solid #000;
        }
    }
`;
document.head.appendChild(style);

// Atualizar dados periodicamente
setInterval(() => {
    carregarDados();
}, 30 * 60 * 1000); // 30 minutos
