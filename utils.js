function downloadEMICsv(){
let csv="Month,EMI,Principal,Interest,Balance\n";
emiData.forEach(r=>csv+=`${r[0]},${r[1].toFixed(2)},${r[2].toFixed(2)},${r[3].toFixed(2)},${r[4].toFixed(2)}\n`);
let blob=new Blob([csv],{type:"text/csv"});
let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download="emi_schedule.csv";a.click();
}