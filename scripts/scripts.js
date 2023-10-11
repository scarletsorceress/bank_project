// CRIAR OBJETOS E VARIÁVEIS 
const obj_body = document.querySelector('body')
const obj_exibe_data = document.querySelector('#exibe_data')
const obj_form_importar = document.querySelector('#form_importar')
const obj_form_saldo = document.querySelector('#form_saldo')
const obj_form_extrato = document.querySelector('#form_extrato')

const obj_link_importar = document.querySelector('#link_importar')
const obj_link_saldo = document.querySelector('#link_saldo')
const obj_link_extrato = document.querySelector('#link_extrato')
const obj_link_home = document.querySelector('#link_home')
const obj_home = document.querySelector('#home')
const obj_imp = document.querySelector('#imp')
const obj_res_imp = document.querySelector('#res_imp')
const obj_saldo = document.querySelector('#saldo')
const obj_ext = document.querySelector('#ext')
const obj_res_ext = document.querySelector('#res_ext')

const obj_input_sel_arq = document.querySelector('#input_sel_arq')
const obj_tab_geral = document.querySelector('#tab_geral')
const conteudo_arq = new FileReader()
let dados_arquivo = []

const obj_sel_conta_saldo = document.querySelector('#sel_conta_saldo')
const obj_input_saldo = document.querySelector('#input_saldo')
const obj_img_situacao = document.querySelector('#img_situacao')

let contas = []
let saldo = 0

const obj_sel_conta_extrato = document.querySelector('#sel_conta_extrato')
const obj_input_data_ini = document.querySelector('#input_data_ini')
const obj_input_data_fim = document.querySelector('#input_data_fim')
const obj_bt_extrato = document.querySelector('#bt_extrato')
const obj_conta_extrato = document.querySelector('#conta_extrato')
const obj_tab_ext = document.querySelector('#tab_ext')

const obj_input_url_nuvem = document.querySelector('#input_url_nuvem')
const obj_bt_car_arq_nuv = document.querySelector('#bt_car_arq_nuv')
const arq_nuv = new XMLHttpRequest()


// Formato de Data do Firefox: YYYY/MM/DD
let data_ini = new Date('9999/12/31')
let data_fim = new Date('0001/01/01')


// EVENTOS
obj_body.addEventListener('load', funPreencherData(), funLimparFormularios())

obj_link_importar.addEventListener('click', function() { funExibir('#imp'); funTelaResImp() } )
obj_link_saldo.addEventListener('click', function() { funExibir('#saldo'); funTelaSaldo() } )
obj_link_extrato.addEventListener('click', function() { funExibir('#ext'); funTelaExtrato() } )
obj_link_home.addEventListener('click', function() { funEsconderTudo(); funTelaHome() } )

obj_input_sel_arq.addEventListener('change', funLerArquivoLocal)
conteudo_arq.addEventListener('load', funCarregarArquivoLocal)

obj_sel_conta_saldo.addEventListener('change', funCalcularSaldo)

obj_bt_extrato.addEventListener('click', funValidarCampos)

obj_bt_car_arq_nuv.addEventListener('click', funLerArquivoNuvem)
arq_nuv.addEventListener('readystatechange', funCarregarArquivoNuvem)

// FUNÇÕES
function funPreencherData() {
    let agora = new Date
    obj_exibe_data.innerHTML = agora.toLocaleDateString('pt-br')    
}

function funLimparFormularios() {
    obj_form_importar.reset()
    obj_form_saldo.reset()
    obj_form_extrato.reset()
}

function funEsconderTudo() {
    obj_home.setAttribute('class', 'esconde')
    obj_imp.setAttribute('class', 'esconde')
    obj_res_imp.setAttribute('class', 'esconde')
    obj_saldo.setAttribute('class', 'esconde')
    obj_ext.setAttribute('class', 'esconde')
    obj_res_ext.setAttribute('class', 'esconde')
}

function funExibir(par_tela) {
    funEsconderTudo()
    document.querySelector(par_tela).setAttribute('class', 'container')
}

function funTelaHome() {
    obj_home.setAttribute('class', 'exibe')
}

function funTelaResImp() {
    obj_res_imp.setAttribute('class', 'container')
}

function funLerArquivoLocal() {
    const arq = document.querySelector('#input_sel_arq').files[0]
    conteudo_arq.readAsText(arq)    
}

function funLimparTabela(par_tab) {
    let linhas = par_tab.rows
    for (var i = linhas.length; i > 0; i-- ) {
        par_tab.removeChild(par_tab.firstElementChild)        
    }
}

function funCabecalhoTabelaImp() {
    obj_tab_geral.setAttribute('class', 'bordas_tabela')
    const obj_tr = document.createElement('tr')
    const obj_col1 = document.createElement('th')
    const obj_col2 = document.createElement('th')
    const obj_col3 = document.createElement('th')
    const obj_col4 = document.createElement('th')
    const obj_col5 = document.createElement('th')
    obj_col1.innerHTML = 'Linha'
    obj_col2.innerHTML = 'Conta'
    obj_col3.innerHTML = 'Data'
    obj_col4.innerHTML = 'Oper'
    obj_col5.innerHTML = 'Valor'
    obj_tr.appendChild(obj_col1)
    obj_tr.appendChild(obj_col2)
    obj_tr.appendChild(obj_col3)
    obj_tr.appendChild(obj_col4)
    obj_tr.appendChild(obj_col5)
    obj_tab_geral.appendChild(obj_tr)
}

function funCorpoTabelaImp() {
    for (var i = 0; i < dados_arquivo.length; i++) {
        const obj_tr = document.createElement('tr')
        const obj_col1 = document.createElement('td')
        const obj_col2 = document.createElement('td')
        const obj_col3 = document.createElement('td')
        const obj_col4 = document.createElement('td')
        const obj_col5 = document.createElement('td')
        obj_col1.innerHTML = i+1
        obj_col2.innerHTML = dados_arquivo[i]['conta']
        obj_col3.innerHTML = dados_arquivo[i]['data'].toLocaleDateString('pt-br')
        obj_col4.innerHTML = dados_arquivo[i]['oper']
        obj_col5.innerHTML = 'R$ ' + dados_arquivo[i]['valor'] + ',00'
        obj_col5.setAttribute('class', 'alin_dir')
        obj_tr.appendChild(obj_col1)
        obj_tr.appendChild(obj_col2)
        obj_tr.appendChild(obj_col3)
        obj_tr.appendChild(obj_col4)
        obj_tr.appendChild(obj_col5)
        obj_tab_geral.appendChild(obj_tr)
    }
}

function funLimparDadosSaldoExtrato() {
    contas = []
    data_ini = new Date('9999/12/31')
    data_fim = new Date('0001/01/01')

    for ( var i = ( obj_sel_conta_saldo.options.length-1 ); i > 0; i-- ) {
        obj_sel_conta_saldo.options[i].remove()
    }
    
    for ( var i = ( obj_sel_conta_extrato.options.length-1 ); i > 0; i-- ) {
        obj_sel_conta_extrato.options[i].remove()
    }

    obj_input_saldo.setAttribute('value', '')
    obj_input_saldo.setAttribute('class', '')
    obj_img_situacao.setAttribute('src', 'imagens/interrog.png')
    obj_img_situacao.setAttribute('alt', 'Situação da Conta')

    obj_form_saldo.reset()
    obj_form_extrato.reset()
}


function funCarregarArquivoLocal() {
    dados_arquivo = []
    let linhas_separadas = conteudo_arq.result.split('\r\n')
    for (var i = 0; i < linhas_separadas.length; i++ ) {
        let colunas_separadas = linhas_separadas[i].split(';')
        dados_arquivo[i] = {
            conta: colunas_separadas[0],
            // DDMMYYYY
            // YYYY/MM/DD (formato Firefox)
            data: new Date(colunas_separadas[1].substring(4, 8) + '/' +
                           colunas_separadas[1].substring(2, 4) + '/' +
                           colunas_separadas[1].substring(0, 2)),
            oper: colunas_separadas[2],
            valor: colunas_separadas[3]
        }
    }
    funLimparTabela(obj_tab_geral)
    funCabecalhoTabelaImp()
    funCorpoTabelaImp()
    funLimparDadosSaldoExtrato()
}

function funListarContas() {
    if ( contas.length == 0 ) {
        for (var i = 0; i < dados_arquivo.length; i++ ) {
            for (var j = 0; j < contas.length; j++) {
                if ( dados_arquivo[i]['conta'] == contas[j] ) {
                    break
                }
            }
            contas[j] = dados_arquivo[i]['conta']
        }
        contas.sort()
    }
}


function funTelaSaldo() {
    if (dados_arquivo.length == 0) {
        alert('Arquivo não carregado!')
    }
    else {
        funListarContas()
        if (obj_sel_conta_saldo.options.length == 1) {
            for (var k = 0; k < contas.length; k++) {
                const obj_option = document.createElement('option')
                obj_option.value = contas[k]
                obj_option.innerHTML = contas[k]
                obj_sel_conta_saldo.appendChild(obj_option)
            }
        }
    }
}


function funCalcularSaldo() {
    saldo = 0
    for (var i = 0; i < dados_arquivo.length; i++) {
        if (dados_arquivo[i]['conta'] == obj_sel_conta_saldo.value) {
            if ( dados_arquivo[i]['oper'] == 'C' ) {
                saldo = saldo + parseFloat(dados_arquivo[i]['valor'])
            }
            else {
                saldo = saldo - parseFloat(dados_arquivo[i]['valor'])
            }
        }
    }
    obj_input_saldo.setAttribute('value', 'R$ ' + saldo + ',00')
    if ( saldo > 0 ) {
        obj_input_saldo.setAttribute('class', 'saldo_positivo')
        obj_img_situacao.setAttribute('src', 'imagens/ok.png')
        obj_img_situacao.setAttribute('alt', 'Saldo Positivo')
    }
    else {
        obj_input_saldo.setAttribute('class', 'saldo_negativo')
        obj_img_situacao.setAttribute('src', 'imagens/nok.png')
        obj_img_situacao.setAttribute('alt', 'Saldo Negativo')
    }
}

function funTratamentoDatas() {
    for ( var i = 0; i < dados_arquivo.length; i++ ) {
        if ( dados_arquivo[i]['data'] < data_ini ) {
            data_ini = dados_arquivo[i]['data']
        }
        if ( dados_arquivo[i]['data'] > data_fim ) {
            data_fim = dados_arquivo[i]['data']
        }
    }

    // Conversão para o mesmo formato de data do input: YYYY-MM-DD (ISO)
    let converte = data_ini.toISOString().slice(0, 10)
    obj_input_data_ini.setAttribute('value', converte)
    obj_input_data_ini.setAttribute('min', converte)
    obj_input_data_fim.setAttribute('min', converte)

    converte = data_fim.toISOString().slice(0, 10)
    obj_input_data_fim.setAttribute('value', converte)
    obj_input_data_ini.setAttribute('max', converte)
    obj_input_data_fim.setAttribute('max', converte)
}

function funTelaExtrato() {
    if (dados_arquivo.length == 0) {
        alert('Arquivo não carregado!')
    }
    else {
        funListarContas()
        if (obj_sel_conta_extrato.options.length == 1) {
            for (var k = 0; k < contas.length; k++) {
                const obj_option = document.createElement('option')
                obj_option.value = contas[k]
                obj_option.innerHTML = contas[k]
                obj_sel_conta_extrato.appendChild(obj_option)
            }
        }
        funTratamentoDatas()
    }
}

function funTelaResExt() {
    obj_res_ext.setAttribute('class', 'container')
    obj_conta_extrato.innerHTML = obj_sel_conta_extrato.value
}


function funCabecalhoTabelaExt() {
    obj_tab_ext.setAttribute('class', 'bordas_tabela')
    const obj_tr = document.createElement('tr')
    const obj_col1 = document.createElement('th')
    const obj_col2 = document.createElement('th')
    const obj_col3 = document.createElement('th')
    const obj_col4 = document.createElement('th')
    const obj_col5 = document.createElement('th')
    obj_col1.innerHTML = 'Data'
    obj_col2.innerHTML = 'Saldo Anterior'
    obj_col3.innerHTML = 'Op'
    obj_col4.innerHTML = 'Valor'
    obj_col5.innerHTML = 'Saldo Atualizado'
    obj_tr.appendChild(obj_col1)
    obj_tr.appendChild(obj_col2)
    obj_tr.appendChild(obj_col3)
    obj_tr.appendChild(obj_col4)
    obj_tr.appendChild(obj_col5)
    obj_tab_ext.appendChild(obj_tr)
}

function funCorpoTabelaExt() {
    let saldo_ant = 0
    let classe_credito_debito
    saldo = 0

    for (var i = 0; i < dados_arquivo.length; i++) {
        if ( dados_arquivo[i]['conta'] == obj_sel_conta_extrato.value ) {
            saldo_ant = saldo
            if ( dados_arquivo[i]['oper'] == 'C' ) {
                saldo = saldo + parseFloat(dados_arquivo[i]['valor'])
                classe_credito_debito = 'credito'
            }
            else {
                saldo = saldo - parseFloat(dados_arquivo[i]['valor'])
                classe_credito_debito = 'debito'
            }
            if ( dados_arquivo[i]['data'].toISOString().slice(0, 10) >= obj_input_data_ini.value
              && dados_arquivo[i]['data'].toISOString().slice(0, 10) <= obj_input_data_fim.value ) {
                const obj_tr = document.createElement('tr')
                const obj_col1 = document.createElement('td')
                const obj_col2 = document.createElement('td')
                const obj_col3 = document.createElement('td')
                const obj_col4 = document.createElement('td')
                const obj_col5 = document.createElement('td')
                obj_col1.innerHTML = dados_arquivo[i]['data'].toLocaleDateString('pt-br')
                obj_col2.innerHTML = 'R$ ' + saldo_ant + ',00'
                obj_col3.innerHTML = dados_arquivo[i]['oper']
                obj_col4.innerHTML = 'R$ ' + dados_arquivo[i]['valor'] + ',00'
                obj_col5.innerHTML = 'R$ ' + saldo + ',00'
                if (saldo_ant >= 0) {
                    obj_col2.classList.add('credito')
                }
                else {
                    obj_col2.classList.add('debito')
                }
                obj_col2.classList.add('alin_dir')
                obj_col3.setAttribute('class', classe_credito_debito)
                obj_col4.classList.add(classe_credito_debito)
                obj_col4.classList.add('alin_dir')
                if (saldo >= 0) {
                    obj_col5.classList.add('credito')
                }
                else {
                    obj_col5.classList.add('debito')
                }
                obj_col5.classList.add('alin_dir')
                obj_tr.appendChild(obj_col1)
                obj_tr.appendChild(obj_col2)
                obj_tr.appendChild(obj_col3)
                obj_tr.appendChild(obj_col4)
                obj_tr.appendChild(obj_col5)
                obj_tab_ext.appendChild(obj_tr)
            }
        }
    }
}

function funGerarExtrato() {
    funTelaResExt()
    funLimparTabela(obj_tab_ext)
    funCabecalhoTabelaExt()
    funCorpoTabelaExt()
}

function funValidarCampos() {
    if ( obj_sel_conta_extrato.value == '' ) {
        alert('Selecione uma conta!')
    }
    else if ( obj_input_data_fim.value < obj_input_data_ini.value ) {
        alert('Data de Fim deve ser posterior à Data de Início do período!')
    }
    else {
        funGerarExtrato()
    }
}

function funLerArquivoNuvem() {
    if (obj_input_url_nuvem.value == '') {
        alert('Nenhum arquivo selecionado!')
    } else {
        arq_nuv.open('GET', obj_input_url_nuvem.value)
        arq_nuv.send()
    }
}

function funCarregarArquivoNuvem() {
    dados_arquivo = []
    if (arq_nuv.readyState == 4 && arq_nuv.status == 200) {
        let linhas_separadas = arq_nuv.responseText.split('\r\n')
    for (var i = 0; i < linhas_separadas.length; i++ ) {
        let colunas_separadas = linhas_separadas[i].split(';')
        dados_arquivo[i] = {
            conta: colunas_separadas[0],
            // DDMMYYYY
            // YYYY/MM/DD (formato Firefox)
            data: new Date(colunas_separadas[1].substring(4, 8) + '/' +
                           colunas_separadas[1].substring(2, 4) + '/' +
                           colunas_separadas[1].substring(0, 2)),
            oper: colunas_separadas[2],
            valor: colunas_separadas[3]
        }
    }
        funLimparTabela(obj_tab_geral)
        funCabecalhoTabelaImp()
        funCorpoTabelaImp()
        funLimparDadosSaldoExtrato()
    } else if (arq_nuv.status == 404){
        alert('Erro ao abrir arquivo')
    }
}   