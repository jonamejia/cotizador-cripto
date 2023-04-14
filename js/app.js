const criptomonedas = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const monedaSelect = document.querySelector('#moneda');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

const obtenerCriptomoneda = criptomoneda => new Promise( resolve => {
    resolve(criptomoneda);
})

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    monedaSelect.addEventListener('change', leerValor);

    criptomonedas.addEventListener('change', leerValor);

});

async function consultarCriptomonedas() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    // fetch( url )
    //     .then( respuesta => respuesta.json())
    //     .then( resultado => obtenerCriptomoneda(resultado.Data))
    //     .then( criptomoneda => selectCriptomonedas(criptomoneda));

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomoneda(resultado.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas( criptomenedas ) {

    criptomenedas.forEach( criptomoneda => {
        const { FullName, Name } = criptomoneda.CoinInfo;
        console.log(FullName);

        const option = document.createElement('OPTION');
        option.textContent = FullName;
        option.value = Name;
        criptomonedas.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;

    if( moneda === '' || criptomoneda === ''){
        imprimirAlerta('AMBOS CAMPOS SON OBLIGATORIOS');
        return;
    }

    consultarAPI();
    

}

async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url =`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    // fetch( url )
    //     .then( respuesta => respuesta.json())
    //     .then( resultado => {
    //        mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda])
    //     })

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error);
    }

}

function imprimirAlerta( msg ) {
    const alertaClase = document.querySelector('.error');

    if(!alertaClase) {

        const alerta = document.createElement('P');
        alerta.textContent = msg;
        alerta.classList.add('error');
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);

    }
}

function mostrarCotizacionHTML(cotizacion) {

    limpiarHtml();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE  } = cotizacion;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span> ${PRICE}</span>`;
    

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `<p>El precio mas alto es: <span>${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `<p>El precio mas bajo es: <span>${LOWDAY}</span></p>`;


    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `<p>Variacion en las ultimas 24 horas es:  <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimasCotizacion = document.createElement('P');
    ultimasCotizacion.innerHTML = `<p>Ultima cotizacion:  <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimasCotizacion);
}

function mostrarSpinner(){

    limpiarHtml();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
 
    `;

    resultado.appendChild(spinner);
}

function limpiarHtml() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

