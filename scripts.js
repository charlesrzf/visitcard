/*
 * Ajusta o texto do link de download do vCard de acordo com o idioma do
 * navegador e aciona o download quando clicado.
 */
document.addEventListener('DOMContentLoaded', function () {
    const link = document.getElementById('save-contact');
    if (!link) return;

    const lang = (navigator.language || 'en').toLowerCase().slice(0, 2);
    const labels = {
        pt: 'Salvar contato',
        es: 'Guardar contacto',
        en: 'Save contact'
    };
    link.textContent = labels[lang] || labels.en;

    link.addEventListener('click', function (e) {
        e.preventDefault();
        /* coloque charlesrf.vcf na raiz do site */
        const vcfUrl = 'https://charlesrzf.github.io/card/charlesrf.vcf';
        const temp = document.createElement('a');
        temp.href = vcfUrl;
        temp.download = 'charlesrf.vcf';
        document.body.appendChild(temp);
        temp.click();
        document.body.removeChild(temp);
    });
});
