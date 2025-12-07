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
    // === Primeira tabela (SIMULADOR DE REBAIXA DE PREÇO) ===
    const base1 = currencyToNumber(document.getElementById('base1').value);
    const ipi1Percent = percentageToNumber(document.getElementById('ipi1').value);
    
    // 1. Espelhamento Base
    const result_base_mirror1 = base1;
    document.getElementById('result_base_mirror').textContent = formatCurrency(result_base_mirror1);
    
    // 2. CÁLCULO IPI (result_ipi1) - Base + (Base * %IPI)
    const resultIpi1 = base1 + (base1 * ipi1Percent / 100);
    // 3. CÁLCULO ST - REMOVIDO DA ESTRUTURA
    
    document.getElementById('result_ipi1').textContent = formatCurrency(resultIpi1);
    
    // === Segunda parte da primeira tabela (Novo Base) ===
    const novoBase = currencyToNumber(document.getElementById('novo_base').value);
    const ipi2Percent = percentageToNumber(document.getElementById('ipi2').value);
    const st2Percent = percentageToNumber(document.getElementById('st2').value);
    
    // 4. Espelhamento Novo Base
    document.getElementById('result_novo_base_mirror').textContent = formatCurrency(novoBase);
    
    // 5. CÁLCULO IPI (Novo Base)
    const resultIpi2 = novoBase + (novoBase * ipi2Percent / 100);
    // 6. CÁLCULO ST (Novo Base)
    const resultSt2 = resultIpi2 + (resultIpi2 * st2Percent / 100);
    
    document.getElementById('result_ipi2').textContent = formatCurrency(resultIpi2);
    document.getElementById('result_st2').textContent = formatCurrency(resultSt2);
    
    // 7. CÁLCULO Valor para rebaixa: (Base + IPI - Antiga ST) - (Novo Base + Novo IPI + Novo ST)
    // A Antiga ST será considerada o valor de IPI do bloco superior
    const valorAntigo = resultIpi1; 
    const valorNovo = resultSt2;

    const valorRebaixa = valorAntigo - valorNovo;
    document.getElementById('result_rebaixa').textContent = formatCurrency(valorRebaixa);
    
    // === Segunda tabela (SIMULADOR DE PREÇO DE VENDA) ===
    const base2 = currencyToNumber(document.getElementById('base2').value);
    const ipi3Percent = percentageToNumber(document.getElementById('ipi3').value);
    const st3Percent = percentageToNumber(document.getElementById('st3').value);
    const incentivo = currencyToNumber(document.getElementById('incentivo').value);
    const outrosPercent = percentageToNumber(document.getElementById('outros').value); 
    const mcPercent = percentageToNumber(document.getElementById('mc').value);
    const mkpShopperPercent = percentageToNumber(document.getElementById('mkp_shopper').value); 

    
    // 8. Espelhamento do $ Base (base2)
    const result_base2_mirror = base2;
    document.getElementById('result_base2_mirror').textContent = formatCurrency(result_base2_mirror);
    
    // 9. CÁLCULO IPI (result_ipi3)
    const resultIpi3 = base2 + (base2 * ipi3Percent / 100);
    document.getElementById('result_ipi3').textContent = formatCurrency(resultIpi3);
    
    // 10. CÁLCULO ST (result_st3)
    const resultSt3 = resultIpi3 + (resultIpi3 * st3Percent / 100);
    document.getElementById('result_st3').textContent = formatCurrency(resultSt3);
    
    // 11. CÁLCULO Incentivo (result_incentivo): ST - Incentivo (R$)
    const resultIncentivo = resultSt3 - incentivo;
    document.getElementById('result_incentivo').textContent = formatCurrency(resultIncentivo);
    
    // 12. CÁLCULO Outros (Total) = resultado_incentivo + (resultado_incentivo * %Outros)
    const resultOutros = resultIncentivo + (resultIncentivo * (outrosPercent / 100)); 
    document.getElementById('result_outros').textContent = formatCurrency(resultOutros);

    // 13. CÁLCULO MC = resultado_outros + (resultado_outros * %MC)
    const resultMc = resultOutros + (resultOutros * (mcPercent / 100)); 
    document.getElementById('result_mc').textContent = formatCurrency(resultMc);

    // 14. NOVO: CÁLCULO MKP Shopper = resultado_mc + (resultado_mc * %MKP Shopper)
    const resultMkpShopper = resultMc + (resultMc * mkpShopperPercent / 100);
    document.getElementById('result_mkp_shopper').textContent = formatCurrency(resultMkpShopper);
}

// REMOÇÃO DO CÁLCULO AUTOMÁTICO - Apenas Formatação no 'blur'
document.querySelectorAll('.currency-input, .percentage-input').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.classList.contains('currency-input')) {
            formatCurrencyInput(input);
        } else if (input.classList.contains('percentage-input')) {
            formatPercentageInput(input); 
        }
    });
});

// Event listener para o botão de calcular
document.getElementById('calculateBtn').addEventListener('click', () => {
    document.querySelectorAll('.currency-input, .percentage-input').forEach(input => {
        if (input.matches(':focus')) {
            input.blur();
        }
    });
    calculateResults();
});

// Botões de reset e imprimir 
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
    document.querySelectorAll('.currency-input').forEach(formatCurrencyInput);
    document.querySelectorAll('.percentage-input').forEach(formatPercentageInput);
    calculateResults();
});