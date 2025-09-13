// Configuração do Firebase
// INSTRUÇÕES PARA CONFIGURAÇÃO:
// 1. Acesse https://console.firebase.google.com/
// 2. Crie um novo projeto ou selecione um existente
// 3. Vá em "Configurações do projeto" > "Geral" > "Seus aplicativos"
// 4. Clique em "Adicionar app" e selecione "Web"
// 5. Registre seu app e copie as configurações abaixo
// 6. No console do Firebase, vá em "Firestore Database" e crie um banco de dados
// 7. Configure as regras de segurança conforme necessário

const firebaseConfig = {
    apiKey: "AIzaSyA9Epw-NPWfjmE3zmfzZbG7Xf9gsjQ-AZs",
    authDomain: "remusical-3702b.firebaseapp.com",
    projectId: "remusical-3702b",
    storageBucket: "remusical-3702b.firebasestorage.app",
    messagingSenderId: "448325767434",
    appId: "1:448325767434:web:5cbf682574e266cb256af3",
    measurementId: "G-NG4W936ZM4"
};

// Regras de segurança sugeridas para o Firestore:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para instrumentos
    match /instrumentos/{document} {
      allow read, write: if true;
    }
    
    // Permitir leitura e escrita para frequências
    match /frequencias/{document} {
      allow read, write: if true;
    }
  }
}
*/

// Estrutura das coleções no Firestore:
/*
Coleção: ensaios
{
  nome: string,
  tipo: string, // Local, GEM, Regional, Geral por Famílias, Geral por Tipos, Outros
  descricao: string,
  data: string,
  duracao: number, // em minutos
  responsavel: string,
  local: string,
  createdAt: timestamp
}

Coleção: instrumentos
{
  nome: string,
  familia: string, // Cordas, Madeiras, Metal
  descricao: string,
  createdAt: timestamp
}

Coleção: musicos
{
  nome: string,
  telefone: string,
  cidade: string,
  congregacao: string,
  instrumentoId: string, // referência ao instrumento
  familia: string, // preenchido automaticamente baseado no instrumento
  ativo: boolean,
  createdAt: timestamp
}

Coleção: frequencias
{
  data: string,
  ensaioId: string,
  musicoId: string,
  presente: boolean,
  observacoes: string,
  createdAt: timestamp
}
*/

// A variável firebaseConfig estará disponível globalmente
// para ser usada pelo script.js
