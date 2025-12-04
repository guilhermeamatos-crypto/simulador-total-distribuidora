// Função para converter string de moeda para número
function currencyToNumber(value) {
    if (!value) return 0;
    // Remove "R$", espaços e converte vírgula em ponto
    return parseFloat(value.replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.'));
}

// Função para converter string de percentual para número
function percentageToNumber(value) {
    if (!value) return 0;
    // Remove "%" e espaços
    return parseFloat(value.replace(/%\s?/g, '').replace(',', '.'));
}

// Função para formatar número como moeda
function formatCurrency(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return 'R$ 0,00';
    return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Função para formatar número como percentual
function formatPercentage(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return '0,00%';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
}

// Função para limpar e formatar input de moeda
function formatCurrencyInput(input) {
    let value = input.value.trim();
    
    if (!value) return;
    
    // Remove caracteres não numéricos (exceto vírgula e ponto)
    value = value.replace(/[^\d,.-]/g, '');
    
    // Se não houver vírgula ou ponto, adiciona como centavos
    if (!value.includes(',') && !value.includes('.')) {
        if (value.length <= 2) {
            value = '0,' + value.padStart(2, '0');
        } else {
            // Permite separadores de milhar (ponto) ao digitar, mas remove para processamento
            value = value.replace(/\./g, '');
            value = value.slice(0, -2) + ',' + value.slice(-2);
        }
    }
    
    // Converte ponto em vírgula se necessário
    value = value.replace('.', ',');
    
    // Formata com separador de milhares
    const [intPart, decPart] = value.split(',');
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    input.value = formattedInt + ',' + (decPart || '00').slice(0, 2);
}

// Função para limpar e formatar input de percentual
function formatPercentageInput(input) {
    let value = input.value.trim();
    
    if (!value) return;
    
    // Remove caracteres não numéricos (exceto vírgula e ponto)
    value = value.replace(/[^\d,.-]/g, '');
    
    // Converte ponto em vírgula se necessário
    value = value.replace('.', ',');
    
    // Limita a 2 casas decimais
    const [intPart, decPart] = value.split(',');
    const formatted = (intPart || '0') + ',' + (decPart || '00').slice(0, 2);
    
    input.value = formatted + '%';
}

// Função para calcular resultados
function calculateResults() {
    // === Primeira tabela (Cálculos Base) ===
    const base1 = currencyToNumber(document.getElementById('base1').value);
    const ipi1Percent = percentageToNumber(document.getElementById('ipi1').value);
    const st1Percent = percentageToNumber(document.getElementById('st1').value);
    
    // IPI = C3 + (C3 * B4)
    const resultIpi1 = base1 + (base1 * ipi1Percent / 100);
    // ST = C4 + (C4 * B5)
    const resultSt1 = resultIpi1 + (resultIpi1 * st1Percent / 100);
    
    document.getElementById('result_ipi1').textContent = formatCurrency(resultIpi1);
    document.getElementById('result_st1').textContent = formatCurrency(resultSt1);
    
    // === Segunda parte da primeira tabela (Novo Base) ===
    const novoBase = currencyToNumber(document.getElementById('novo_base').value);
    const ipi2Percent = percentageToNumber(document.getElementById('ipi2').value);
    const st2Percent = percentageToNumber(document.getElementById('st2').value);
    
    // IPI = C6 + (C6 * B7)
    const resultIpi2 = novoBase + (novoBase * ipi2Percent / 100);
    // ST = C7 + (C7 * B8)
    const resultSt2 = resultIpi2 + (resultIpi2 * st2Percent / 100);
    
    document.getElementById('result_ipi2').textContent = formatCurrency(resultIpi2);
    document.getElementById('result_st2').textContent = formatCurrency(resultSt2);
    
    // Valor para rebaixa = C5 - C8 (resultSt1 - resultSt2)
    const valorRebaixa = resultSt1 - resultSt2;
    document.getElementById('result_rebaixa').textContent = formatCurrency(valorRebaixa);
    
    // === Segunda tabela (Cálculos Incentivo, Outros e MC) ===
    const base2 = currencyToNumber(document.getElementById('base2').value);
    const ipi3Percent = percentageToNumber(document.getElementById('ipi3').value);
    const st3Percent = percentageToNumber(document.getElementById('st3').value);
    
    // IPI = C11 + (C11 * B12)
    const resultIpi3 = base2 + (base2 * ipi3Percent / 100);
    // ST = C12 + (C12 * B13)
    const resultSt3 = resultIpi3 + (resultIpi3 * st3Percent / 100);
    
    document.getElementById('result_ipi3').textContent = formatCurrency(resultIpi3);
    document.getElementById('result_st3').textContent = formatCurrency(resultSt3);
    
    // Incentivo = C13 - B14 (resultSt3 - incentivo)
    const incentivo = currencyToNumber(document.getElementById('incentivo').value);
    const resultIncentivo = resultSt3 - incentivo;
    
    document.getElementById('result_incentivo').textContent = formatCurrency(resultIncentivo);
    
    // Outros (Total) = C14 + (C14 * B15)
    const outrosPercent = percentageToNumber(document.getElementById('outros').value);
    const resultOutros = resultIncentivo + (resultIncentivo * outrosPercent / 100);
    
    document.getElementById('result_outros').textContent = formatCurrency(resultOutros);
    
    // MC = C15 + (C15 * B16)
    const mcPercent = percentageToNumber(document.getElementById('mc').value);
    const resultMc = resultOutros + (resultOutros * mcPercent / 100);
    
    document.getElementById('result_mc').textContent = formatCurrency(resultMc);
}

// Event listeners para inputs de moeda e percentual
document.querySelectorAll('.currency-input, .percentage-input').forEach(input => {
    // 1. Apenas formata o valor ao sair do campo (perde o foco)
    input.addEventListener('blur', () => {
        if (input.classList.contains('currency-input')) {
            formatCurrencyInput(input);
        } else if (input.classList.contains('percentage-input')) {
            formatPercentageInput(input);
        }
        // REMOVIDO: calculateResults()
    });
    
    // REMOVIDO: calculation on 'input' event
});

// NOVO: Botão de calcular
document.getElementById('calculateBtn').addEventListener('click', () => {
    // 1. Força a formatação de qualquer campo ativo
    document.querySelectorAll('.currency-input, .percentage-input').forEach(input => {
        if (input.matches(':focus')) {
            input.blur(); // Dispara o evento blur, que chama a formatação
        }
    });
    // 2. Executa o cálculo
    calculateResults();
});


// Botão de reset
document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar todos os valores?')) {
        document.querySelectorAll('input[type="text"]').forEach(input => {
            input.value = '';
        });
        document.querySelectorAll('.result-value').forEach(result => {
            result.textContent = 'R$ 0,00';
        });
    }
});

// Botão de imprimir
document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
});

// Inicializa os cálculos ao carregar a página com os valores padrões
document.addEventListener('DOMContentLoaded', () => {
    calculateResults();
});