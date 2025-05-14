/* Faz o link “salvar contato” baixar o vCard */
document.getElementById('save-contact').addEventListener('click', function (e) {
    e.preventDefault();
    /* coloque charlesrf.vcf na raiz do site */
   const vcfUrl = 'https://charlesrzf.github.io/card/charlesrf.vcf';

    const link = document.createElement('a');
    link.href = vcfUrl;
    link.download = 'charlesrf.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
