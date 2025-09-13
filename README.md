# Sistema de Controle de Instrumentos Musicais
## Congregação Cristã no Brasil

### 📋 Descrição
Sistema web para controle e gerenciamento de instrumentos musicais da Congregação Cristã no Brasil, baseado no relatório de frequência de ensaios. A aplicação permite cadastrar instrumentos, registrar frequências e gerar relatórios com gráficos interativos.

### 🚀 Funcionalidades
- **Dashboard**: Visão geral com estatísticas e gráficos
- **Cadastro de Instrumentos**: Registro de instrumentos por família (Cordas, Madeiras, Metais, Percussão)
- **Controle de Frequência**: Registro de presença em ensaios
- **Relatórios**: Tabelas detalhadas com percentuais de frequência
- **Gráficos Interativos**: Visualização da presença por família e ministério
- **Responsivo**: Interface adaptável para desktop e mobile

### 🛠️ Tecnologias Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Gráficos**: Chart.js
- **Banco de Dados**: Firebase Firestore
- **Hospedagem**: Firebase Hosting (recomendado)

### 📦 Estrutura do Projeto
```
REM/
├── index.html          # Página principal
├── style.css           # Estilos da aplicação
├── script.js           # Lógica da aplicação
├── firebase-config.js  # Configurações do Firebase
└── README.md          # Documentação
```

### ⚙️ Configuração do Firebase

#### 1. Criar Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Digite o nome do projeto (ex: "controle-instrumentos-ccb")
4. Configure o Google Analytics (opcional)
5. Clique em "Criar projeto"

#### 2. Configurar Firestore Database
1. No painel do Firebase, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Selecione a localização (recomendado: southamerica-east1)

#### 3. Configurar Web App
1. No painel do projeto, clique no ícone "</>"
2. Digite um nome para o app (ex: "sistema-instrumentos")
3. Marque "Configurar também o Firebase Hosting"
4. Clique em "Registrar app"
5. Copie as configurações fornecidas

#### 4. Atualizar Configurações
1. Abra o arquivo `firebase-config.js`
2. Substitua os valores de exemplo pelas configurações do seu projeto
3. Salve o arquivo

#### 5. Configurar Regras de Segurança
No Firestore Database > Regras, substitua por:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /instrumentos/{document} {
      allow read, write: if true;
    }
    match /frequencias/{document} {
      allow read, write: if true;
    }
  }
}
```

### 🚀 Como Executar

#### Opção 1: Servidor Local Simples
1. Abra o terminal na pasta do projeto
2. Execute um servidor HTTP local:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (se tiver o http-server instalado)
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```
3. Acesse `http://localhost:8000` no navegador

#### Opção 2: Firebase Hosting
1. Instale o Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Faça login no Firebase:
   ```bash
   firebase login
   ```
3. Inicialize o projeto:
   ```bash
   firebase init hosting
   ```
4. Configure:
   - Selecione o projeto criado
   - Public directory: `.` (pasta atual)
   - Single-page app: `No`
   - Overwrite index.html: `No`
5. Faça o deploy:
   ```bash
   firebase deploy
   ```

### 📊 Dados Iniciais
A aplicação vem com dados pré-configurados baseados no relatório da imagem:
- **Metais**: Baritono, Cornet, Euphonium, Flugelhorn, Pocket, Trombone, Trompa, Trompete, Tuba
- **Cordas**: Violino, Viola, Violoncelo, Contrabaixo
- **Madeiras**: Flauta, Clarinete, Oboé, Fagote

### 🎯 Como Usar

#### Dashboard
- Visualize estatísticas gerais
- Analise gráficos de presença por família
- Monitore a presença geral do ministério

#### Cadastro de Instrumentos
1. Clique na aba "Cadastro"
2. Preencha os campos:
   - Nome do instrumento
   - Família (Cordas, Madeiras, Metais, Percussão)
   - Quantidade presente
   - Quantidade total
3. Clique em "Cadastrar Instrumento"

#### Controle de Frequência
1. Clique na aba "Frequência"
2. Selecione a data do ensaio
3. Escolha o instrumento
4. Informe a quantidade presente
5. Clique em "Registrar Frequência"

#### Relatórios
- Acesse a aba "Relatório" para ver a tabela completa
- Os dados são atualizados automaticamente
- Use Ctrl+P para imprimir o relatório

### 🔧 Personalização

#### Adicionar Novas Famílias
No arquivo `index.html`, linha ~67, adicione novas opções:
```html
<option value="NovaFamilia">Nova Família</option>
```

#### Modificar Cores dos Gráficos
No arquivo `script.js`, procure por `backgroundColors` e modifique as cores:
```javascript
const backgroundColors = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6'];
```

#### Personalizar Estilos
Modifique o arquivo `style.css` para alterar:
- Cores do tema
- Fontes
- Espaçamentos
- Responsividade

### 🐛 Solução de Problemas

#### Erro de CORS
- Use um servidor HTTP local (não abra o arquivo diretamente)
- Configure o Firebase Hosting

#### Dados não carregam
- Verifique as configurações do Firebase
- Confirme se as regras do Firestore estão corretas
- Verifique o console do navegador para erros

#### Gráficos não aparecem
- Verifique se o Chart.js está carregando
- Confirme se há dados para exibir
- Teste em diferentes navegadores

### 📱 Compatibilidade
- **Navegadores**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Dispositivos**: Desktop, Tablet, Mobile
- **Resolução**: Responsivo (320px+)

### 🤝 Contribuição
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### 📄 Licença
Este projeto é de uso livre para a Congregação Cristã no Brasil.

### 📞 Suporte
Para dúvidas ou sugestões, entre em contato com o desenvolvedor.

---

**Desenvolvido com ❤️ para a Congregação Cristã no Brasil**