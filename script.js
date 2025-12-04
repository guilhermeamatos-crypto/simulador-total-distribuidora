
function moedaParaNumero(v){
  return Number(v.replace("R$","").replace(".","").replace(",",".").trim());
}
function pctParaNumero(v){
  return Number(v.replace("%","").replace(",",".").trim())/100;
}
function numeroParaMoeda(v){
  return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

function calcular(){
    let precoTabela = moedaParaNumero("R$ 6170,27");
    document.getElementById("precoTabela").textContent = numeroParaMoeda(precoTabela);

    let ipi = pctParaNumero(document.getElementById("ipiPct").value);
    let valorIpi = precoTabela * ipi;
    let totalIpi = precoTabela + valorIpi;

    document.getElementById("valorIpi").textContent = numeroParaMoeda(valorIpi);
    document.getElementById("totalIpi").textContent = numeroParaMoeda(totalIpi);

    let st = pctParaNumero(document.getElementById("stPct").value);
    let valorSt = totalIpi * st;
    let precoFlat = totalIpi + valorSt;

    document.getElementById("valorSt").textContent = numeroParaMoeda(valorSt);
    document.getElementById("precoFlat").textContent = numeroParaMoeda(precoFlat);

    let incentivo = moedaParaNumero(document.getElementById("incentivo").value);
    let totalIncentivo = precoFlat - incentivo;

    document.getElementById("totalIncentivo").textContent = numeroParaMoeda(totalIncentivo);

    let outros = pctParaNumero(document.getElementById("outrosPct").value);
    let valorOutros = totalIncentivo * outros;
    let totalOutros = totalIncentivo + valorOutros;

    document.getElementById("valorOutros").textContent = numeroParaMoeda(valorOutros);
    document.getElementById("totalOutros").textContent = numeroParaMoeda(totalOutros);

    let mc = pctParaNumero(document.getElementById("mcPct").value);
    let valorMc = totalOutros * mc;
    let precoFinal = totalOutros + valorMc;

    document.getElementById("valorMc").textContent = numeroParaMoeda(valorMc);
    document.getElementById("precoFinal").textContent = numeroParaMoeda(precoFinal);
}
