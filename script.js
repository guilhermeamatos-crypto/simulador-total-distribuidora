
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
  let base1 = moedaParaNumero(document.getElementById('base1').value);
  let ipiPct1 = pctParaNumero(document.getElementById('ipi1').value);
  let stPct1 = pctParaNumero(document.getElementById('st1').value);

  let ipi1 = base1 + (base1*ipiPct1);
  let st1 = ipi1 + (ipi1*stPct1);

  document.getElementById('ipi1_res').textContent = numeroParaMoeda(ipi1);
  document.getElementById('st1_res').textContent = numeroParaMoeda(st1);

  let novoBase = moedaParaNumero(document.getElementById('novoBase').value);
  let ipiPct2 = pctParaNumero(document.getElementById('ipi2').value);
  let stPct2 = pctParaNumero(document.getElementById('st2').value);

  let ipi2 = novoBase + (novoBase*ipiPct2);
  let st2 = ipi2 + (ipi2*stPct2);

  document.getElementById('ipi2_res').textContent = numeroParaMoeda(ipi2);
  document.getElementById('st2_res').textContent = numeroParaMoeda(st2);

  document.getElementById('valorRebaixa').textContent = numeroParaMoeda(st1 - st2);

  let base3 = novoBase;
  document.getElementById('base3').value = numeroParaMoeda(base3);

  let ipiPct3 = pctParaNumero(document.getElementById('ipi3').value);
  let stPct3 = pctParaNumero(document.getElementById('st3').value);
  let incentivoInput = moedaParaNumero(document.getElementById('incentivo').value);
  let outrosPct = pctParaNumero(document.getElementById('outros').value);
  let mcPct = pctParaNumero(document.getElementById('mc').value);

  let ipi3 = base3 + (base3*ipiPct3);
  let st3 = ipi3 + (ipi3*stPct3);
  let incentivo = st3 - incentivoInput;
  let outros = incentivo + (incentivo*outrosPct);
  let mc = outros + (outros*mcPct);

  document.getElementById('ipi3_res').textContent = numeroParaMoeda(ipi3);
  document.getElementById('st3_res').textContent = numeroParaMoeda(st3);
  document.getElementById('outros_res').textContent = numeroParaMoeda(outros);
  document.getElementById('mc_res').textContent = numeroParaMoeda(mc);
}
