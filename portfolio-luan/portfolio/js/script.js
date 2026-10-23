/* =========================================================
   Portfólio - Luan Albuquerque
   Funcionalidades:
   1) Ano automático no rodapé
   2) Saudação dinâmica
   3) Menu hambúrguer
   4) Modo claro/escuro
   5) Validação do formulário de contato
   ========================================================= */

/* ---------- 1) ANO AUTOMÁTICO ---------- */
const spanAno = document.getElementById("ano");
spanAno.textContent = new Date().getFullYear();

/* ---------- 2) SAUDAÇÃO DINÂMICA ---------- */
const saudacao = document.getElementById("saudacao");

function obterSaudacao() {
  const hora = new Date().getHours();

  if (hora >= 5 && hora < 12) {
    return "Bom dia! 👋";
  } else if (hora >= 12 && hora < 18) {
    return "Boa tarde! 👋";
  } else {
    return "Boa noite! 👋";
  }
}

saudacao.textContent = obterSaudacao();

/* ---------- 3) MENU HAMBÚRGUER ---------- */
const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu-principal");

function abrirMenu() {
  menu.classList.add("aberto");
  btnMenu.setAttribute("aria-expanded", "true");
  btnMenu.setAttribute("aria-label", "Fechar menu de navegação");
}

function fecharMenu() {
  menu.classList.remove("aberto");
  btnMenu.setAttribute("aria-expanded", "false");
  btnMenu.setAttribute("aria-label", "Abrir menu de navegação");
}

btnMenu.addEventListener("click", function () {
  const estaAberto = btnMenu.getAttribute("aria-expanded") === "true";
  if (estaAberto) {
    fecharMenu();
  } else {
    abrirMenu();
  }
});

// Fecha o menu ao clicar em um link (útil no celular)
menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", fecharMenu);
});

// Fecha o menu com a tecla Esc e devolve o foco ao botão
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && menu.classList.contains("aberto")) {
    fecharMenu();
    btnMenu.focus();
  }
});

/* ---------- 4) MODO CLARO / ESCURO ---------- */
const btnTema = document.getElementById("btn-tema");
const iconeTema = document.getElementById("icone-tema");
const CHAVE_TEMA = "tema-portfolio";

function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);

  const escuro = tema === "dark";
  btnTema.setAttribute("aria-pressed", String(escuro));
  btnTema.setAttribute(
    "aria-label",
    escuro ? "Ativar modo claro" : "Ativar modo escuro"
  );
  iconeTema.textContent = escuro ? "☀️" : "🌙";
}

function temaInicial() {
  // 1º: o que a pessoa escolheu antes (se o navegador permitir salvar)
  try {
    const salvo = localStorage.getItem(CHAVE_TEMA);
    if (salvo === "light" || salvo === "dark") {
      return salvo;
    }
  } catch (erro) {
    // localStorage indisponível: segue para a próxima opção
  }

  // 2º: a preferência do sistema operacional
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

aplicarTema(temaInicial());

btnTema.addEventListener("click", function () {
  const atual = document.documentElement.getAttribute("data-theme");
  const novo = atual === "dark" ? "light" : "dark";
  aplicarTema(novo);

  try {
    localStorage.setItem(CHAVE_TEMA, novo);
  } catch (erro) {
    // Sem problema: o tema só não será lembrado na próxima visita
  }
});

/* ---------- 5) VALIDAÇÃO DO FORMULÁRIO ---------- */
const form = document.getElementById("form-contato");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoMensagem = document.getElementById("mensagem");
const campoConsentimento = document.getElementById("consentimento");
const statusForm = document.getElementById("status-form");

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function mostrarErro(campo, mensagem) {
  const erro = document.getElementById("erro-" + campo.id);
  erro.textContent = mensagem;
  campo.setAttribute("aria-invalid", "true");
}

function limparErro(campo) {
  const erro = document.getElementById("erro-" + campo.id);
  erro.textContent = "";
  campo.removeAttribute("aria-invalid");
}

// Cada função devolve true (válido) ou false (inválido)
function validarNome() {
  if (campoNome.value.trim().length < 3) {
    mostrarErro(campoNome, "Digite seu nome com pelo menos 3 letras.");
    return false;
  }
  limparErro(campoNome);
  return true;
}

function validarEmail() {
  const email = campoEmail.value.trim();
  if (email === "") {
    mostrarErro(campoEmail, "Digite seu e-mail.");
    return false;
  }
  if (!REGEX_EMAIL.test(email)) {
    mostrarErro(campoEmail, "Digite um e-mail válido, como nome@exemplo.com.");
    return false;
  }
  limparErro(campoEmail);
  return true;
}

function validarMensagem() {
  if (campoMensagem.value.trim().length < 10) {
    mostrarErro(campoMensagem, "Escreva uma mensagem com pelo menos 10 caracteres.");
    return false;
  }
  limparErro(campoMensagem);
  return true;
}

function validarConsentimento() {
  if (!campoConsentimento.checked) {
    mostrarErro(campoConsentimento, "Você precisa concordar para enviar a mensagem.");
    return false;
  }
  limparErro(campoConsentimento);
  return true;
}

// Valida cada campo ao sair dele (blur) e limpa o erro quando a pessoa corrige
campoNome.addEventListener("blur", validarNome);
campoEmail.addEventListener("blur", validarEmail);
campoMensagem.addEventListener("blur", validarMensagem);
campoConsentimento.addEventListener("change", validarConsentimento);

form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  statusForm.textContent = "";

  // Roda todas as validações (sem parar na primeira que falhar)
  const resultados = [
    validarNome(),
    validarEmail(),
    validarMensagem(),
    validarConsentimento(),
  ];
  const tudoValido = resultados.every(Boolean);

  if (!tudoValido) {
    // Leva o foco para o primeiro campo com problema
    const primeiroInvalido = form.querySelector('[aria-invalid="true"]');
    if (primeiroInvalido) {
      primeiroInvalido.focus();
    }
    return;
  }

  // Demonstração: nenhum dado é enviado nem guardado
  statusForm.textContent =
    "Mensagem validada com sucesso! Esta é uma demonstração, então nada foi enviado. Para falar comigo, use o e-mail ao lado.";
  form.reset();
});
