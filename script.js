document.getElementById('cadastro-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value; // Permite qualquer texto
    const telefone = document.getElementById('telefone').value;
    const dataVencimento = document.getElementById('data-vencimento').value;
    const valor = document.getElementById('valor').value;

    const cliente = { nome, email, telefone, dataVencimento, valor, status: 'Pendente' };
    registrarCliente(cliente);
    renderizarClientes();

    // Limpar formulário
    document.getElementById('cadastro-form').reset();
});

function registrarCliente(cliente) {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientes.push(cliente);
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

function calcularDiasVencidos(dataVencimento) {
    const dataAtual = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = dataAtual - vencimento;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffTime > 0 ? diffDays : 0;
}

function renderizarClientes() {
    const tabelaCobrancas = document.getElementById('tabela-cobrancas').getElementsByTagName('tbody')[0];
    tabelaCobrancas.innerHTML = '';

    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    clientes.forEach((cliente, index) => {
        const novaLinha = tabelaCobrancas.insertRow();
        novaLinha.classList.add(cliente.status.toLowerCase());
        novaLinha.insertCell(0).textContent = cliente.nome;
        novaLinha.insertCell(1).textContent = cliente.email;
        novaLinha.insertCell(2).textContent = cliente.telefone;
        novaLinha.insertCell(3).textContent = cliente.dataVencimento;
        novaLinha.insertCell(4).textContent = cliente.valor;

        const diasVencidos = calcularDiasVencidos(cliente.dataVencimento);
        novaLinha.insertCell(5).textContent = diasVencidos;

        const acoesCell = novaLinha.insertCell(6);
        acoesCell.style.textAlign = 'center';

        const alternarStatusButton = document.createElement('button');
        alternarStatusButton.innerHTML = cliente.status === 'Pendente' ? '<i class="fas fa-check"></i> Pago' : '<i class="fas fa-times"></i> Pendente';
        alternarStatusButton.classList.add('status-btn');
        alternarStatusButton.addEventListener('click', function() {
            cliente.status = cliente.status === 'Pendente' ? 'Pago' : 'Pendente';
            novaLinha.classList.toggle('pendente');
            novaLinha.classList.toggle('pago');
            alternarStatusButton.innerHTML = cliente.status === 'Pendente' ? '<i class="fas fa-check"></i> Pago' : '<i class="fas fa-times"></i> Pendente';
            clientes[index] = cliente;
            localStorage.setItem('clientes', JSON.stringify(clientes));
        });
        acoesCell.appendChild(alternarStatusButton);

        const excluirButton = document.createElement('button');
        excluirButton.innerHTML = '<i class="fas fa-trash"></i> Excluir';
        excluirButton.classList.add('excluir-btn');
        excluirButton.addEventListener('click', function() {
            clientes.splice(index, 1);
            localStorage.setItem('clientes', JSON.stringify(clientes));
            renderizarClientes(); // Re-renderizar a tabela após a exclusão
        });
        acoesCell.appendChild(excluirButton);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    VMasker(document.getElementById('telefone')).maskPattern('(99) 99999-9999');
    VMasker(document.getElementById('valor')).maskMoney({
        precision: 2,
        separator: ',',
        delimiter: '.',
        unit: 'R$',
        zeroCents: false
    });
    renderizarClientes();
});