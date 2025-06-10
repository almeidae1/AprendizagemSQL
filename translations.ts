import { Language, Translations } from './types';
import { MAX_DAILY_PROBLEMS, HINT_COST } from './constants';

export const translations: Translations = {
  // Header
  appTitle: {
    [Language.EN]: 'SQL Practice Pad',
    [Language.PT]: 'Painel de Prática SQL',
  },
  pointsLabel: {
    [Language.EN]: 'Points',
    [Language.PT]: 'Pontos',
  },
  // API Key Error
  apiKeyErrorTitle: {
    [Language.EN]: 'Configuration Error',
    [Language.PT]: 'Erro de Configuração',
  },
  apiKeyErrorMessage: {
    [Language.EN]: 'Gemini API Key not found. Please set the API_KEY environment variable to use this application.',
    [Language.PT]: 'Chave da API Gemini não encontrada. Defina a variável de ambiente API_KEY para usar esta aplicação.',
  },
  apiKeyErrorGuidance: {
    [Language.EN]: 'Refer to the Gemini API documentation for instructions on obtaining and setting up your API key.',
    [Language.PT]: 'Consulte a documentação da API Gemini para obter instruções sobre como obter e configurar sua chave de API.',
  },
  checkingApiKey: {
    [Language.EN]: 'Checking API Key configuration...',
    [Language.PT]: 'Verificando a configuração da Chave da API...',
  },
  // Difficulty Selector
  difficultyLabel: {
    [Language.EN]: 'Difficulty:',
    [Language.PT]: 'Dificuldade:',
  },
  difficultyEasy: {
    [Language.EN]: 'Easy',
    [Language.PT]: 'Fácil',
  },
  difficultyMedium: {
    [Language.EN]: 'Medium',
    [Language.PT]: 'Médio',
  },
  difficultyAdvanced: {
    [Language.EN]: 'Advanced',
    [Language.PT]: 'Avançado',
  },
  // Problem Generation
  generateProblemButton: {
    [Language.EN]: 'Generate New Problem',
    [Language.PT]: 'Gerar Novo Problema',
  },
  generatingProblemButton: {
    [Language.EN]: 'Generating...',
    [Language.PT]: 'Gerando...',
  },
  dailyLimitReachedError: {
    [Language.EN]: `You've reached your daily limit of {maxProblems} free problems.`,
    [Language.PT]: `Você atingiu seu limite diário de {maxProblems} problemas gratuitos.`,
  },
  comeBackTomorrowError: {
    [Language.EN]: 'Daily free limit reached. Come back tomorrow for more!',
    [Language.PT]: 'Limite diário gratuito atingido. Volte amanhã para mais!',
  },
  problemsAttemptedLabel: {
    [Language.EN]: 'Problems generated today:',
    [Language.PT]: 'Problemas gerados hoje:',
  },
  generatingChallengeMessage: {
    [Language.EN]: 'Generating your SQL challenge...',
    [Language.PT]: 'Gerando seu desafio SQL...',
  },
  // Problem Display
  problemDisplayTitle: {
    [Language.EN]: 'SQL Challenge:',
    [Language.PT]: 'Desafio SQL:',
  },
  tableLabel: {
    [Language.EN]: 'Table:',
    [Language.PT]: 'Tabela:',
  },
  schemaLabel: {
    [Language.EN]: 'Schema:',
    [Language.PT]: 'Esquema:',
  },
  sampleDataLabel: {
    [Language.EN]: 'Sample Data:',
    [Language.PT]: 'Dados de Exemplo:',
  },
  // Solution Input
  solutionInputLabel: {
    [Language.EN]: 'Your SQL Query:',
    [Language.PT]: 'Sua Consulta SQL:',
  },
  solutionInputPlaceholder: {
    [Language.EN]: 'SELECT * FROM ...',
    [Language.PT]: 'SELECT * FROM ...',
  },
  solutionInputProTip: {
    [Language.EN]: 'Pro-tip: Use Ctrl+Enter (or Cmd+Enter on Mac) to submit.',
    [Language.PT]: 'Dica: Use Ctrl+Enter (ou Cmd+Enter no Mac) para enviar.',
  },
  submitSolutionButton: {
    [Language.EN]: 'Submit Solution',
    [Language.PT]: 'Enviar Solução',
  },
  // Feedback Messages
  feedbackCorrectTitle: {
    [Language.EN]: 'Correct!',
    [Language.PT]: 'Correto!',
  },
  feedbackCorrectMessage: {
    [Language.EN]: 'You earned {pointsEarned} points. Well done!',
    [Language.PT]: 'Você ganhou {pointsEarned} pontos. Muito bem!',
  },
  feedbackIncorrectMessage: {
    [Language.EN]: 'Incorrect solution. Take another look at the problem and your query. Remember to check syntax and logic!',
    [Language.PT]: 'Solução incorreta. Revise o problema e sua consulta. Lembre-se de verificar a sintaxe e a lógica!',
  },
  feedbackApiError: {
    [Language.EN]: 'Failed to generate problem.',
    [Language.PT]: 'Falha ao gerar o problema.',
  },
  // General Error
  generalErrorPrefix: {
    [Language.EN]: 'Error:',
    [Language.PT]: 'Erro:',
  },
  // Footer
  footerText: {
    [Language.EN]: 'SQL Practice Pad &copy; {year}. Learn and conquer SQL!',
    [Language.PT]: 'Painel de Prática SQL &copy; {year}. Aprenda e conquiste o SQL!',
  },
  // Language Switcher
  languageSwitcherLabel: {
    [Language.EN]: 'Language:',
    [Language.PT]: 'Idioma:',
  },
  // User Progress Service
  loadingUserData: {
    [Language.EN]: 'Loading your progress...',
    [Language.PT]: 'Carregando seu progresso...',
  },
  errorLoadingUserData: {
    [Language.EN]: 'Could not load your progress. Starting fresh or login to sync.',
    [Language.PT]: 'Não foi possível carregar seu progresso. Começando do zero ou faça login para sincronizar.',
  },
  errorSavingUserData: {
    [Language.EN]: 'Could not save your progress. Changes may not persist. Please ensure you are logged in.',
    [Language.PT]: 'Não foi possível salvar seu progresso. As alterações podem não persistir. Verifique se você está logado.',
  },
  // Hint System
  getHintButton: {
    [Language.EN]: 'Get Hint ({hintCost} pts)',
    [Language.PT]: 'Obter Dica ({hintCost} pts)',
  },
  gettingHintButton: {
    [Language.EN]: 'Getting Hint...',
    [Language.PT]: 'Obtendo Dica...',
  },
  hintAvailableButton: {
    [Language.EN]: 'Show Hint',
    [Language.PT]: 'Mostrar Dica',
  },
  insufficientPointsForHint: {
    [Language.EN]: 'Not enough points to get a hint.',
    [Language.PT]: 'Pontos insuficientes para obter uma dica.',
  },
  hintDisplayTitle: {
    [Language.EN]: 'Hint:',
    [Language.PT]: 'Dica:',
  },
  errorGeneratingHint: {
    [Language.EN]: 'Could not generate a hint for this problem.',
    [Language.PT]: 'Não foi possível gerar uma dica para este problema.',
  },
  // Authentication
  loginTitle: {
    [Language.EN]: 'Login to SQL Practice Pad',
    [Language.PT]: 'Entrar no Painel de Prática SQL',
  },
  registerTitle: {
    [Language.EN]: 'Create Account',
    [Language.PT]: 'Criar Conta',
  },
  emailLabel: {
    [Language.EN]: 'Email Address',
    [Language.PT]: 'Endereço de Email',
  },
  passwordLabel: {
    [Language.EN]: 'Password',
    [Language.PT]: 'Senha',
  },
  nameLabel: {
    [Language.EN]: 'Full Name (Optional)',
    [Language.PT]: 'Nome Completo (Opcional)',
  },
  loginButton: {
    [Language.EN]: 'Login',
    [Language.PT]: 'Entrar',
  },
  registerButton: {
    [Language.EN]: 'Register',
    [Language.PT]: 'Registrar',
  },
  logoutButton: {
    [Language.EN]: 'Logout',
    [Language.PT]: 'Sair',
  },
  loginWithGoogleButton: {
    [Language.EN]: 'Sign in with Google',
    [Language.PT]: 'Entrar com Google',
  },
  orSeparator: {
    [Language.EN]: 'OR',
    [Language.PT]: 'OU',
  },
  noAccountPrompt: {
    [Language.EN]: "Don't have an account?",
    [Language.PT]: 'Não tem uma conta?',
  },
  alreadyHaveAccountPrompt: {
    [Language.EN]: 'Already have an account?',
    [Language.PT]: 'Já tem uma conta?',
  },
  signUpLink: {
    [Language.EN]: 'Sign up',
    [Language.PT]: 'Cadastre-se',
  },
  signInLink: {
    [Language.EN]: 'Sign in',
    [Language.PT]: 'Entrar',
  },
  loggingInStatus: {
    [Language.EN]: 'Logging in...',
    [Language.PT]: 'Entrando...',
  },
  registeringStatus: {
    [Language.EN]: 'Registering...',
    [Language.PT]: 'Registrando...',
  },
  authErrorInvalidCredentials: {
    [Language.EN]: 'Invalid email or password.',
    [Language.PT]: 'Email ou senha inválidos.',
  },
  authErrorEmailExists: {
    [Language.EN]: 'An account with this email already exists.',
    [Language.PT]: 'Já existe uma conta com este email.',
  },
  authErrorRegistrationFailed: {
    [Language.EN]: 'Registration failed. Please try again.',
    [Language.PT]: 'Falha no registro. Por favor, tente novamente.',
  },
  authErrorGoogleSignInFailed: {
    [Language.EN]: 'Google Sign-In failed. Please try again.',
    [Language.PT]: 'Falha ao entrar com Google. Por favor, tente novamente.',
  },
  authErrorGeneric: {
    [Language.EN]: 'An authentication error occurred. Please try again.',
    [Language.PT]: 'Ocorreu um erro de autenticação. Por favor, tente novamente.',
  },
  welcomeUser: {
    [Language.EN]: 'Welcome, {userName}!',
    [Language.PT]: 'Bem-vindo(a), {userName}!',
  },
  authenticationRequired: {
    [Language.EN]: 'Please log in or register to save your progress and access all features.',
    [Language.PT]: 'Por favor, faça login ou registre-se para salvar seu progresso e acessar todas as funcionalidades.',
  },
   checkingAuthStatus: {
    [Language.EN]: 'Checking authentication status...',
    [Language.PT]: 'Verificando status da autenticação...',
  },
};