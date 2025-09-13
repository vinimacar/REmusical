// A configuração do Firebase será carregada do arquivo firebase-config.js
// Certifique-se de que o arquivo firebase-config.js está configurado corretamente

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variáveis globais
let instrumentos = [];
let frequencias = [];
let chartPresencaMusicos = null;
let chartPresencaMinisterio = null;

// Dados iniciais baseados na imagem
const instrumentosIniciais = [
    { nome: 'Baritono', familia: 'Metais', presente: 4, total: 4 },
    { nome: 'Cornet', familia: 'Metais', presente: 5, total: 5 },
    { nome: 'Euphonium', familia: 'Metais', presente: 3, total: 3 },
    { nome: 'Flugelhorn', familia: 'Metais', presente: 1, total: 1 },
    { nome: 'Pocket', familia: 'Metais', presente: 4, total: 4 },
    { nome: 'Trombone', familia: 'Metais', presente: 18, total: 18 },
    { nome: 'Trombone', familia: 'Metais', presente: 3, total: 3 },
    { nome: 'Trompa', familia: 'Metais', presente: 3, total: 3 },
    { nome: 'Trompete', familia: 'Metais', presente: 20, total: 20 },
    { nome: 'Tuba', familia: 'Metais', presente: 8, total: 8 },
    { nome: 'Violino', familia: 'Cordas', presente: 12, total: 15 },
    { nome: 'Viola', familia: 'Cordas', presente: 8, total: 10 },
    { nome: 'Violoncelo', familia: 'Cordas', presente: 6, total: 8 },
    { nome: 'Contrabaixo', familia: 'Cordas', presente: 4, total: 5 },
    { nome: 'Flauta', familia: 'Madeiras', presente: 3, total: 4 },
    { nome: 'Clarinete', familia: 'Madeiras', presente: 5, total: 6 },
    { nome: 'Oboé', familia: 'Madeiras', presente: 2, total: 3 },
    { nome: 'Fagote', familia: 'Madeiras', presente: 1, total: 2 }
];

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
    carregarDados();
    configurarEventos();
    atualizarDataRelatorio();
});

// Função para inicializar a aplicação
function inicializarApp() {
    // Carregar instrumentos iniciais se não existirem no Firebase
    carregarInstrumentosIniciais();
    
    // Mostrar seção dashboard por padrão
    showSection('dashboard');
    
    // Atualizar dashboard
    atualizarDashboard();
}

// Função para carregar instrumentos iniciais
async function carregarInstrumentosIniciais() {
    try {
        const snapshot = await db.collection('instrumentos').get();
        if (snapshot.empty) {
            // Se não há instrumentos, carregar dados iniciais
            for (const instrumento of instrumentosIniciais) {
                await db.collection('instrumentos').add({
                    ...instrumento,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            console.log('Instrumentos iniciais carregados!');
        }
    } catch (error) {
        console.error('Erro ao carregar instrumentos iniciais:', error);
        // Fallback para dados locais
        instrumentos = [...instrumentosIniciais];
    }
}

// Função para carregar dados do Firebase
async function carregarDados() {
    try {
        // Carregar instrumentos
        const instrumentosSnapshot = await db.collection('instrumentos').get();
        instrumentos = [];
        instrumentosSnapshot.forEach(doc => {
            instrumentos.push({ id: doc.id, ...doc.data() });
        });
        
        // Carregar frequências
        const frequenciasSnapshot = await db.collection('frequencias').get();
        frequencias = [];
        frequenciasSnapshot.forEach(doc => {
            frequencias.push({ id: doc.id, ...doc.data() });
        });
        
        // Atualizar interface
        atualizarDashboard();
        atualizarTabelaRelatorio();
        atualizarSelectInstrumentos();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarMensagem('Erro ao carregar dados. Usando dados locais.', 'error');
        // Usar dados locais como fallback
        instrumentos = [...instrumentosIniciais];
        atualizarDashboard();
        atualizarTabelaRelatorio();
    }
}

// Função para configurar eventos
function configurarEventos() {
    // Formulário de cadastro de instrumento
    const formInstrumento = document.getElementById('formInstrumento');
    if (formInstrumento) {
        formInstrumento.addEventListener('submit', cadastrarInstrumento);
    }
    
    // Formulário de frequência
    const formFrequencia = document.getElementById('formFrequencia');
    if (formFrequencia) {
        formFrequencia.addEventListener('submit', registrarFrequencia);
    }
    
    // Formulário de tipos de ensaios
    const formTipoEnsaio = document.getElementById('formTipoEnsaio');
    if (formTipoEnsaio) {
        formTipoEnsaio.addEventListener('submit', cadastrarTipoEnsaio);
    }
    
    // Carregar tipos de ensaios ao inicializar
    carregarTiposEnsaios();
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

// Função para cadastrar instrumento
async function cadastrarInstrumento(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nomeInstrumento').value;
    const familia = document.getElementById('familiaInstrumento').value;
    const presente = parseInt(document.getElementById('quantidadePresente').value);
    const total = parseInt(document.getElementById('quantidadeTotal').value);
    
    if (presente > total) {
        mostrarMensagem('A quantidade presente não pode ser maior que o total!', 'error');
        return;
    }
    
    const novoInstrumento = {
        nome,
        familia,
        presente,
        total,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection('instrumentos').add(novoInstrumento);
        mostrarMensagem('Instrumento cadastrado com sucesso!', 'success');
        document.getElementById('formInstrumento').reset();
        carregarDados();
    } catch (error) {
        console.error('Erro ao cadastrar instrumento:', error);
        mostrarMensagem('Erro ao cadastrar instrumento!', 'error');
    }
}

// Função para registrar frequência
async function registrarFrequencia(e) {
    e.preventDefault();
    
    const data = document.getElementById('dataEnsaio').value;
    const instrumentoId = document.getElementById('instrumentoFreq').value;
    const presenca = parseInt(document.getElementById('presencaFreq').value);
    
    const novaFrequencia = {
        data,
        instrumentoId,
        presenca,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection('frequencias').add(novaFrequencia);
        mostrarMensagem('Frequência registrada com sucesso!', 'success');
        document.getElementById('formFrequencia').reset();
        carregarDados();
    } catch (error) {
        console.error('Erro ao registrar frequência:', error);
        mostrarMensagem('Erro ao registrar frequência!', 'error');
    }
}

// Função para atualizar dashboard
function atualizarDashboard() {
    const totalMusicos = instrumentos.reduce((sum, inst) => sum + inst.presente, 0);
    const totalOrganistas = instrumentos.filter(inst => inst.familia === 'Organistas').length;
    const presencaMedia = instrumentos.length > 0 ? 
        Math.round((instrumentos.reduce((sum, inst) => sum + (inst.presente / inst.total * 100), 0) / instrumentos.length)) : 0;
    
    const elemTotalMusicos = document.getElementById('totalMusicos');
    const elemTotalOrganistas = document.getElementById('totalOrganistas');
    const elemPresencaMedia = document.getElementById('presencaMedia');
    
    if (elemTotalMusicos) elemTotalMusicos.textContent = totalMusicos;
    if (elemTotalOrganistas) elemTotalOrganistas.textContent = totalOrganistas;
    if (elemPresencaMedia) elemPresencaMedia.textContent = presencaMedia + '%';
}

// Função para criar gráficos
function criarGraficos() {
    criarGraficoPresencaMusicos();
    criarGraficoPresencaMinisterio();
}

// Função para criar gráfico de presença de músicos
function criarGraficoPresencaMusicos() {
    const canvas = document.getElementById('chartPresencaMusicos');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (chartPresencaMusicos) {
        chartPresencaMusicos.destroy();
    }
    
    const familias = {};
    instrumentos.forEach(inst => {
        if (!familias[inst.familia]) {
            familias[inst.familia] = { presente: 0, total: 0 };
        }
        familias[inst.familia].presente += inst.presente;
        familias[inst.familia].total += inst.total;
    });
    
    const labels = Object.keys(familias);
    const data = labels.map(familia => familias[familia].presente);
    const backgroundColors = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6'];
    
    chartPresencaMusicos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Função para criar gráfico de presença do ministério
function criarGraficoPresencaMinisterio() {
    const canvas = document.getElementById('chartPresencaMinisterio');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (chartPresencaMinisterio) {
        chartPresencaMinisterio.destroy();
    }
    
    const totalPresente = instrumentos.reduce((sum, inst) => sum + inst.presente, 0);
    const totalGeral = instrumentos.reduce((sum, inst) => sum + inst.total, 0);
    const ausentes = totalGeral - totalPresente;
    
    chartPresencaMinisterio = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Presentes', 'Ausentes'],
            datasets: [{
                data: [totalPresente, ausentes],
                backgroundColor: ['#2ecc71', '#e74c3c'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Função para atualizar tabela do relatório
function atualizarTabelaRelatorio() {
    const tbody = document.getElementById('corpoTabelaInstrumentos');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    instrumentos.forEach((instrumento, index) => {
        const frequencia = ((instrumento.presente / instrumento.total) * 100).toFixed(1);
        const ausente = instrumento.total - instrumento.presente;
        
        const row = tbody.insertRow();
        if (row) {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${instrumento.nome}</td>
                <td>${instrumento.presente}</td>
                <td>${ausente}</td>
                <td>${frequencia}%</td>
            `;
        }
    });
}

// Função para atualizar select de instrumentos
function atualizarSelectInstrumentos() {
    const select = document.getElementById('instrumentoFreq');
    select.innerHTML = '<option value="">Selecione um instrumento</option>';
    
    instrumentos.forEach(instrumento => {
        const option = document.createElement('option');
        option.value = instrumento.id;
        option.textContent = `${instrumento.nome} (${instrumento.familia})`;
        select.appendChild(option);
    });
}

// Função para atualizar data do relatório
function atualizarDataRelatorio() {
    const elementoData = document.getElementById('dataRelatorio');
    if (elementoData) {
        const hoje = new Date();
        const dataFormatada = hoje.toLocaleDateString('pt-BR');
        elementoData.textContent = dataFormatada;
    }
}

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo) {
    // Remove mensagens existentes
    const mensagensExistentes = document.querySelectorAll('.message');
    mensagensExistentes.forEach(msg => msg.remove());
    
    // Cria nova mensagem
    const mensagem = document.createElement('div');
    mensagem.className = `message ${tipo}`;
    mensagem.textContent = texto;
    
    // Adiciona ao início do main
    const main = document.querySelector('main');
    main.insertBefore(mensagem, main.firstChild);
    
    // Remove após 5 segundos
    setTimeout(() => {
        mensagem.remove();
    }, 5000);
}

// Função para exportar dados (funcionalidade extra)
function exportarDados() {
    const dados = {
        instrumentos: instrumentos,
        frequencias: frequencias,
        dataExportacao: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dados, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'dados_instrumentos.json';
    link.click();
}

// Função para imprimir relatório
function imprimirRelatorio() {
    window.print();
}

// Adicionar estilos para impressão
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

// Função para alternar entre abas
function showTab(tabName) {
    // Remover classe active de todos os botões e conteúdos
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Adicionar classe active ao botão clicado
    event.target.classList.add('active');
    
    // Mostrar o conteúdo correspondente
    document.getElementById(tabName + '-tab').classList.add('active');
}

// Função para cadastrar tipo de ensaio
function cadastrarTipoEnsaio(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nomeTipoEnsaio').value;
    const descricao = document.getElementById('descricaoEnsaio').value;
    const duracao = document.getElementById('duracaoEnsaio').value;
    const frequencia = document.getElementById('frequenciaEnsaio').value;
    const responsavel = document.getElementById('responsavelEnsaio').value;
    
    const tipoEnsaio = {
        id: Date.now().toString(),
        nome: nome,
        descricao: descricao,
        duracao: duracao ? parseInt(duracao) : null,
        frequencia: frequencia,
        responsavel: responsavel,
        dataCriacao: new Date().toISOString()
    };
    
    // Salvar no localStorage
    let tiposEnsaios = JSON.parse(localStorage.getItem('tiposEnsaios')) || [];
    tiposEnsaios.push(tipoEnsaio);
    localStorage.setItem('tiposEnsaios', JSON.stringify(tiposEnsaios));
    
    // Limpar formulário
    document.getElementById('formTipoEnsaio').reset();
    
    // Recarregar lista
    carregarTiposEnsaios();
    
    alert('Tipo de ensaio cadastrado com sucesso!');
}

// Função para carregar tipos de ensaios
function carregarTiposEnsaios() {
    const lista = document.getElementById('listaTiposEnsaios');
    if (!lista) return;
    
    const tiposEnsaios = JSON.parse(localStorage.getItem('tiposEnsaios')) || [];
    
    if (tiposEnsaios.length === 0) {
        lista.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Nenhum tipo de ensaio cadastrado ainda.</p>';
        return;
    }
    
    lista.innerHTML = tiposEnsaios.map(tipo => `
        <div class="item-ensaio">
            <h4>${tipo.nome}</h4>
            ${tipo.descricao ? `<p><strong>Descrição:</strong> ${tipo.descricao}</p>` : ''}
            <div class="item-meta">
                ${tipo.duracao ? `<span class="meta-tag">⏱️ ${tipo.duracao} min</span>` : ''}
                ${tipo.frequencia ? `<span class="meta-tag">📅 ${tipo.frequencia}</span>` : ''}
                ${tipo.responsavel ? `<span class="meta-tag">👤 ${tipo.responsavel}</span>` : ''}
            </div>
        </div>
    `).join('');
}

// Função para backup automático (executar a cada 30 minutos)
setInterval(() => {
    if (instrumentos.length > 0) {
        localStorage.setItem('backup_instrumentos', JSON.stringify(instrumentos));
        localStorage.setItem('backup_frequencias', JSON.stringify(frequencias));
        console.log('Backup automático realizado');
    }
}, 30 * 60 * 1000); // 30 minutos
