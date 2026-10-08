const menuBotao = document.querySelector('.menu-botao');
const menu = document.querySelector('#menu');

function alternarMenu() {
  const estaAberto = menu.classList.toggle('aberto');

  menuBotao.setAttribute('aria-expanded', estaAberto);
  menuBotao.setAttribute('aria-label', estaAberto ? 'Fechar menu' : 'Abrir menu');
}

function fecharMenu() {
  menu.classList.remove('aberto');
  menuBotao.setAttribute('aria-expanded', 'false');
  menuBotao.setAttribute('aria-label', 'Abrir menu');
}

menuBotao.addEventListener('click', alternarMenu);

const linksAncora = document.querySelectorAll('a[href^="#"]');

linksAncora.forEach(function (link) {
  link.addEventListener('click', function (evento) {
    const idDestino = link.getAttribute('href');
    const destino = document.querySelector(idDestino);

    if (destino) {
      evento.preventDefault();
      destino.scrollIntoView({ behavior: 'smooth' });
    }

    fecharMenu();
  });
});

const perguntas = document.querySelectorAll('.faq__pergunta');

perguntas.forEach(function (pergunta) {
  pergunta.addEventListener('click', function () {
    const resposta = document.getElementById(pergunta.getAttribute('aria-controls'));
    const estaAberta = pergunta.getAttribute('aria-expanded') === 'true';

    pergunta.setAttribute('aria-expanded', !estaAberta);
    resposta.hidden = estaAberta;
  });
});

const campoTelefone = document.querySelector('#telefone');

// A página de materiais não tem formulário, então só ativa se o campo existir
if (campoTelefone) {
  campoTelefone.addEventListener('input', function () {
    let numeros = campoTelefone.value.replace(/\D/g, '').slice(0, 11);

    if (numeros.length > 10) {
      numeros = numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (numeros.length > 6) {
      numeros = numeros.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (numeros.length > 2) {
      numeros = numeros.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (numeros.length > 0) {
      numeros = numeros.replace(/^(\d{0,2})$/, '($1');
    }

    campoTelefone.value = numeros;
  });
}

const formulario = document.querySelector('#form-orcamento');
const mensagemSucesso = document.querySelector('#mensagem-sucesso');

function mostrarErro(idCampo, mensagem) {
  const campo = document.getElementById(idCampo);
  const areaErro = document.getElementById('erro-' + idCampo);

  areaErro.textContent = mensagem;

  if (mensagem) {
    campo.parentElement.classList.add('campo--invalido');
    campo.setAttribute('aria-invalid', 'true');
  } else {
    campo.parentElement.classList.remove('campo--invalido');
    campo.removeAttribute('aria-invalid');
  }
}

function validarFormulario() {
  let valido = true;

  const nome = document.getElementById('nome').value.trim();
  if (nome.length < 3) {
    mostrarErro('nome', 'Informe seu nome (mínimo 3 letras).');
    valido = false;
  } else {
    mostrarErro('nome', '');
  }

  const digitosTelefone = document.getElementById('telefone').value.replace(/\D/g, '');
  if (digitosTelefone.length === 0) {
    mostrarErro('telefone', 'Informe seu telefone.');
    valido = false;
  } else if (digitosTelefone.length < 10) {
    mostrarErro('telefone', 'Telefone inválido. Use o formato (45) 99999-9999.');
    valido = false;
  } else {
    mostrarErro('telefone', '');
  }

  if (document.getElementById('servico').value === '') {
    mostrarErro('servico', 'Selecione o tipo de serviço.');
    valido = false;
  } else {
    mostrarErro('servico', '');
  }

  return valido;
}

const numeroWhatsApp = '5545999830663';

function montarMensagem() {
  const campoServico = document.getElementById('servico');
  const servico = campoServico.options[campoServico.selectedIndex].text;
  const metragem = document.getElementById('metragem').value;
  const mensagem = document.getElementById('mensagem').value.trim();

  const linhas = [
    'Olá! Gostaria de um orçamento.',
    '',
    'Nome: ' + document.getElementById('nome').value.trim(),
    'Telefone: ' + document.getElementById('telefone').value,
    'Serviço: ' + servico
  ];

  if (metragem) {
    linhas.push('Metragem aproximada: ' + metragem + ' m²');
  }
  if (mensagem) {
    linhas.push('Mensagem: ' + mensagem);
  }

  return linhas.join('\n');
}

if (formulario) {
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    mensagemSucesso.hidden = true;

    if (validarFormulario()) {
      const link = 'https://wa.me/' + numeroWhatsApp + '?text=' + encodeURIComponent(montarMensagem());
      window.open(link, '_blank');

      mensagemSucesso.hidden = false;
      formulario.reset();
    } else {
      const primeiroErro = formulario.querySelector('[aria-invalid="true"]');
      if (primeiroErro) {
        primeiroErro.focus();
      }
    }
  });
}
