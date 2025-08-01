const sipAmount=document.getElementById('sipAmount'),sipAmountNum=document.getElementById('sipAmountNum');
const sipRate=document.getElementById('sipRate'),sipRateNum=document.getElementById('sipRateNum');
const sipYears=document.getElementById('sipYears'),sipYearsNum=document.getElementById('sipYearsNum');
const sipMode=document.getElementById('sipMode');
const sipMaturity=document.getElementById('sipMaturity'),sipProfit=document.getElementById('sipProfit');

function syncSIPInput(e){
  let min, max;
  if(e.target.id === 'sipAmount' || e.target.id === 'sipAmountNum') {
    min = 500; max = 100000000;
  } else if(e.target.id === 'sipRate' || e.target.id === 'sipRateNum') {
    min = 1; max = 70;
  } else if(e.target.id === 'sipYears' || e.target.id === 'sipYearsNum') {
    min = 1; max = 50;
  }
  let value = Math.max(min, Math.min(max, Math.abs(+e.target.value)));
  e.target.value = value;
  if(e.target.type==='range') e.target.nextElementSibling.value = value;
  else e.target.previousElementSibling.value = value;
  calculateSIP();
}

sipAmount.addEventListener('input',syncSIPInput);
sipAmountNum.addEventListener('input',syncSIPInput);
sipRate.addEventListener('input',syncSIPInput);
sipRateNum.addEventListener('input', function(e) {
  // Allow free decimal editing
  let val = e.target.value;
  if(val === "") return;
  // Only update slider if valid number
  if(!isNaN(Number(val))) {
    let min = 1, max = 70;
    let num = Math.max(min, Math.min(max, Number(val)));
    sipRate.value = num;
    calculateSIP();
  }
});
sipRateNum.addEventListener('blur', function(e) {
  let val = e.target.value;
  if(val === "" || isNaN(Number(val))) {
    e.target.value = 1;
    sipRate.value = 1;
    calculateSIP();
    return;
  }
  let min = 1, max = 70;
  let num = Math.max(min, Math.min(max, Number(val)));
  e.target.value = num;
  sipRate.value = num;
  calculateSIP();
});
sipYears.addEventListener('input',syncSIPInput);
sipYearsNum.addEventListener('input',syncSIPInput);
sipMode.addEventListener('change',calculateSIP);

function formatIndianHRV(num) {
  num = Number(num);
  if (num >= 10000000) return (num/10000000).toFixed(2) + ' crore';
  if (num >= 100000) return (num/100000).toFixed(2) + ' lakh';
  if (num >= 1000) return (num/1000).toFixed(2) + ' Thousand';
  return num.toString();
}

function calculateSIP(){
  let amt = +sipAmount.value;
  let maxLimit = 100000000;
  if (amt < 500) amt = 500;
  if (amt > maxLimit) amt = maxLimit;
  sipAmount.value = amt;
  sipAmountNum.value = amt;
  let rate = +sipRate.value/100, years = +sipYears.value;
  if(amt<1||rate<=0||rate>200||years<=0){
    sipMaturity.textContent='Invalid inputs'; sipProfit.textContent='';
    return;
  }
  if(sipMode.value==='monthly'){
    let n=years*12,R=rate/12;
    let fv=amt*( (Math.pow(1+R,n)-1)*(1+R)/R );
    let invested=amt*n,profit=fv-invested;
    sipMaturity.textContent='Maturity: ₹'+fv.toFixed(2)+' ('+formatIndianHRV(fv)+')';
    sipProfit.textContent='Profit: ₹'+profit.toFixed(2)+' ('+formatIndianHRV(profit)+')';
    drawSIPChart(invested,profit);
  }else{
    let fv=amt*Math.pow(1+rate,years);
    let profit=fv-amt;
    sipMaturity.textContent='Maturity: ₹'+fv.toFixed(2)+' ('+formatIndianHRV(fv)+')';
    sipProfit.textContent='Profit: ₹'+profit.toFixed(2)+' ('+formatIndianHRV(profit)+')';
    drawSIPChart(amt,profit);
  }
  sipMaturity.classList.add('highlight-result');
  sipProfit.classList.add('highlight-result');
}
calculateSIP();
