
const adicionar = document.getElementById("add_tran");

adicionar.addEventListener("click", function(){
    document.querySelector('.seg_tel').style.display = "flex";
});

const formulario = document.getElementById("form_entrada");
const nome = document.getElementById("nome");
const tipo = document.getElementById("tipo");
const valor = document.getElementById("valor");
const data = document.getElementById("data");
const tabela = document.getElementById("novas_entradas");

const api_url = "https://tesoureiroback-1.onrender.com/tesouraria/entradas";

function formatarValor(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

function formatarTipo(tipo) {
    const tipos = {
        dizimo: "Dízimo",
        oferta: "Oferta",
        vendas: "Vendas dos Departamentos"
    };

    return tipos[tipo] || tipo;
}

async function carregar() {

    try {

        const resposta = await fetch(api_url);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar entradas");
        }

        const entradas = await resposta.json();

        tabela.innerHTML = "";

        if (entradas.length === 0) {

            const linha = document.createElement("tr");
            const coluna = document.createElement("td");

            coluna.colSpan = 4;
            coluna.textContent = "Nenhuma entrada cadastrada";

            linha.appendChild(coluna);
            tabela.appendChild(linha);

            return;
        }

        entradas.forEach(function(entrada) {

            const linha = document.createElement("tr");

            const colData = document.createElement("td");
            const colValor = document.createElement("td");
            const colContribuinte = document.createElement("td");
            const colTipo = document.createElement("td");

            colData.textContent = formatarData(entrada.data);
            colValor.textContent = formatarValor(entrada.valor);
            colContribuinte.textContent = entrada.contribuinte;
            colTipo.textContent = formatarTipo(entrada.tipo);

            linha.appendChild(colData);
            linha.appendChild(colValor);
            linha.appendChild(colContribuinte);
            linha.appendChild(colTipo);

            tabela.appendChild(linha);

        });

    } catch(erro) {

        console.error("Erro ao buscar entradas:", erro);
        alert("Não foi possível carregar as entradas!");

    }

}

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const dados = {
        contribuinte: nome.value.trim(),
        tipo: tipo.value,
        valor: Number(valor.value),
        data: data.value
    };

    try {

        const resposta = await fetch(api_url, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dados)

        });

        if (!resposta.ok) {
            const mensagem = await resposta.text();
            throw new Error(mensagem || "Erro ao cadastrar entrada");
        }

        const entradaSalva = await resposta.json();

        console.log("Entrada cadastrada:", entradaSalva);

        /*alert("Entrada cadastrada com sucesso!");*/

        formulario.reset();

        document.querySelector(".seg_tel").style.display = "none";

        await carregar();

    } catch(erro) {

        console.error("Erro ao cadastrar:", erro);
        alert("Não foi possível cadastrar! Verifique o console.");

    }

});

carregar();

