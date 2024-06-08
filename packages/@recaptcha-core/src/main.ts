import { install, execute } from './core';

window.addEventListener('load', () => {
    const div = document.createElement('div');
    div.setAttribute("id", 'recaptcha');
    document.body.appendChild(div);

    install(div, {
        identifier: 'my-recaptcha',
        siteKey: '6LdteZ8lAAAAAHqIZeUbEnTQsyPswWymS1_9m4sl',
    })

    const button = document.createElement('button');
    button.textContent = 'Execute';
    button.addEventListener("click", async () => {
        execute('my-recaptcha').then((token) => {
            console.log(token);
        });
    });
    document.body.appendChild(button);
});