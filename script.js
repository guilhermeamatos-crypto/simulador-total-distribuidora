// Funções de conversão e formatação (Mantidas)
function currencyToNumber(value) {
    if (!value) return 0;
    return parseFloat(value.replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.'));
}
function percentageToNumber(value) {
    if (!value) return 0;
    return parseFloat(value.replace(/%\s?/g, '').replace(',', '.'));
}
function formatCurrency(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return 'R$ 0,00';
    return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatPercentage(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return '0,00%';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
}
function formatCurrencyInput(input) {
    let value = input.value.trim();
    if (!value) return;
    value = value.replace(/[^\d,.-]/g, '');
    if (!value.includes(',') && !value.includes('.')) {
        if (value.length <= 2) {
            value = '0,' + value.padStart(2, '0');
        } else {
            value = value.slice(0, -2) + ',' + value.slice(-2);
        }
    }
    value = value.replace('.', ',');
    const [intPart, decPart] = value.split(',');
    const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + (decPart || '00').slice(0, 2);
    input.value = formatted;
}
function formatPercentageInput(input) {
    let value = input.value.trim();
    if (!value) return;
    value = value.replace(/[^\d,.-]/g, '');
    value = value.replace('.', ',');
    const [intPart, decPart] = value.split(',');
    const formatted = (intPart || '0') + ',' + (decPart || '00').slice(0, 2);
    input.value = formatted + '%'; 
}

// Função para calcular resultados
function calculateResults() {
    // === Primeira tabela ===
    const base1 = currencyToNumber(document.getElementById('base1').value);
    const ipi1Percent = percentageToNumber(document.getElementById('ipi1').value);
    const st1Percent = percentageToNumber(document.getElementById('st1').value);
    
    // CÁLCULO 1: D2 (result_base_mirror) = B2
    const result_base_mirror = base1;
    document.getElementById('result_base_mirror').textContent = formatCurrency(result_base_mirror);
    
    // CÁLCULO 2: IPI (result_ipi1) = D2 + (D2 * B3)
    const resultIpi1 = base1 + (base1 * ipi1Percent / 100);
    // CÁLCULO 3: ST (result_st1) = D3 + (D3 * B4)
    const resultSt1 = resultIpi1 + (resultIpi1 * st1Percent / 100);
    
    document.getElementById('result_ipi1').textContent = formatCurrency(resultIpi1);
    document.getElementById('result_st1').textContent = formatCurrency(resultSt1);
    
    // === Segunda parte da primeira tabela (Novo Base) ===
    const novoBase = currencyToNumber(document.getElementById('novo_base').value);
    const ipi2Percent = percentageToNumber(document.getElementById('ipi2').value);
    const st2Percent = percentageToNumber(document.getElementById('st2').value);
    
    // CÁLCULO 4: IPI (result_ipi2) = B5 + (B5 * B6)
    const resultIpi2 = novoBase + (novoBase * ipi2Percent / 100);
    // CÁLCULO 5: ST (result_st2) = D6 + (D6 * B7)
    const resultSt2 = resultIpi2 + (resultIpi2 * st2Percent / 100);
    
    document.getElementById('result_ipi2').textContent = formatCurrency(resultIpi2);
    document.getElementById('result_st2').textContent = formatCurrency(resultSt2);
    
    // CÁLCULO 6: Valor para rebaixa (result_rebaixa) = D4 - D7
    const valorRebaixa = resultSt1 - resultSt2;
    document.getElementById('result_rebaixa').textContent = formatCurrency(valorRebaixa);
    
    // === Segunda tabela ===
    const base2 = currencyToNumber(document.getElementById('base2').value);
    const ipi3Percent = percentageToNumber(document.getElementById('ipi3').value);
    const st3Percent = percentageToNumber(document.getElementById('st3').value);
    
    // NOVO CÁLCULO: Espelhamento do $ Base (base2)
    const result_base2_mirror = base2;
    document.getElementById('result_base2_mirror').textContent = formatCurrency(result_base2_mirror);
    
    // CÁLCULO 7: IPI (result_ipi3) = B9 + (B9 * B10)
    const resultIpi3 = base2 + (base2 * ipi3Percent / 100);
    
    // CÁLCULO 8: ST (result_st3) = D10 + (D10 * B11)
    const resultSt3 = resultIpi3 + (resultIpi3 * st3Percent / 100);
    
    document.getElementById('result_ipi3').textContent = formatCurrency(resultIpi3);
    document.getElementById('result_st3').textContent = formatCurrency(resultSt3);
    
    // CÁLCULO 9: Incentivo (result_incentivo) = D11 - B12
    const incentivo = currencyToNumber(document.getElementById('incentivo').value);
    const resultIncentivo = resultSt3 - incentivo;
    
    document.getElementById('result_incentivo').textContent = formatCurrency(resultIncentivo);
    
    // CÁLCULO 10: Outros (Total) (result_outros) = D12 + (D12 * B13)
    const outrosPercent = percentageToNumber(document.getElementById('outros').value);
    const resultOutros = resultIncentivo + (resultIncentivo * outrosPercent / 100);
    
    document.getElementById('result_outros').textContent = formatCurrency(resultOutros);
    
    // CÁLCULO 11: MC (result_mc) = D13 + (D13 * B14)
    const mcPercent = percentageToNumber(document.getElementById('mc').value);
    const resultMc = resultOutros + (resultOutros * mcPercent / 100);
    
    document.getElementById('result_mc').textContent = formatCurrency(resultMc);
}

// REMOÇÃO DO CÁLCULO AUTOMÁTICO - Apenas Formatação no 'blur'
document.querySelectorAll('.currency-input, .percentage-input').forEach(input => {
    // Apenas formata o valor ao sair do campo (blur), SEM CALCULAR
    input.addEventListener('blur', () => {
        if (input.classList.contains('currency-input')) {
            formatCurrencyInput(input);
        } else if (input.classList.contains('percentage-input')) {
            formatPercentageInput(input); 
        }
    });
    
    // Evento 'input' e cálculo automático foram removidos
});

// Event listener para o botão de calcular
document.getElementById('calculateBtn').addEventListener('click', () => {
    // 1. Garante que todos os campos ativos sejam formatados (simulando 'blur')
    document.querySelectorAll('.currency-input, .percentage-input').forEach(input => {
        if (input.matches(':focus')) {
            input.blur();
        }
    });
    // 2. Executa o cálculo
    calculateResults();
});

// Botões de reset e imprimir (mantidos)
document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar todos os valores?')) {
        document.querySelectorAll('input[type="text"]').forEach(input => {
            input.value = '';
        });
        document.querySelectorAll('.result-value').forEach(result => {
            result.textContent = 'R$ 0,00';
        });
        calculateResults();
    }
});

document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
});

// Inicializa os cálculos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Aplica a formatação inicial
    document.querySelectorAll('.currency-input').forEach(formatCurrencyInput);
    document.querySelectorAll('.percentage-input').forEach(formatPercentageInput);
    calculateResults();
});