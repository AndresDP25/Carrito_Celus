const footer = document.getElementById('footer');
const formulario = document.getElementById('formulario');

//Capturo a los templates
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;

const fragment = document.createDocumentFragment();
let carrito = [];




//1- Esperamos a que cargue el html e imprimo Formulario, para validación,
// si ya hay local storage imprimio los productos
// document.addEventListener('DOMContentLoaded', () => {
    $( document ).ready(function() {
    if(localStorage.getItem('usuarioActual') == undefined){
    imprimoFormulario();
} else {
    $('.carrets').show(500);
    $('#apretarBoton').show(500);
    $('#mostrarCarrito').show(500);
    $('#muestraEfecto').show(500);
    $('#cerrarSesion').show(500);
    carrito = JSON.parse(localStorage.getItem('carrito'));
    imprimoCarrito();
    imprimoProductos();
    if(localStorage.getItem('carrito') == "[]"){
        $('#finCompra').hide();
    } else {
        $('#finCompra').show();
    }
   
    };
});

//5-Captura id 
$('#cards').click(function(e){
    addCarrito(e);
});

$('#items').click(function(e){
    btnAccion(e);
});

$('#mostrarCarrito').click(function(e){
    btnMostrar(e);
});

$('#ocultarCarrito').click(function(e){
    btnOcultar(e);
});

$('#finCompra').click(function(){
    btnfinCompra();
});

$('.finModal').click(function(e){
    btnfinModal(e);
});

$('#cerrarSesion').click(function(e){
    btnCerrarSesion(e);
});


const imprimoFormulario = () => {
    formulario.innerHTML =
    
            `
            <div class="container mt-5">   
            <div class="container col-md-4 formulario">    
                <h2 class="tituloFormulario mt-5">Ingrese sus datos:</h2>
                <form class="" id="formulario">
                    <label for="nombre"></label>
                    <input class="form-control" type="text" id="nombre"  placeholder="Nombre" required> 
                    <label for="contacto"></label>
                    <input class="form-control" type="text" id="contacto" placeholder="Contacto" required> 
                    <button class="btn btn-primary mt-4">Enviar formulario</button>
                </form>
                <div id="mensaje-validacion"></div>
            </div>
          </div>
                `  
                $('.btn-primary').click(function(e){
                    // console.log(e);
                    cargarUsuario(e);
                });      
                // onclick="cargarUsuario(event)
}



 //2-Imprimo las cards con mis celus en div con id Card
 const imprimoProductos = () => {
     if ($('.hideCard').length == 0){
    $.get('./bd.json', function(datos){
        datos.productos.forEach(prod => {
            let card = document.createElement('div')
            card.classList.add('my-4', 'col-lg-4', 'col-md-4', 'col-sm-6', 'hideCard');
        
            card.innerHTML =
        
                `
                <div class="card mb-3 shadow h-100">
                    <img src="${prod.thumbailUrl}" class="card-img-top" alt="${prod.marca}">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div class="d-flex justify-content-between">
                            <h5 class="card-title">${prod.marca}</h5>
                            <p class="card-text precio align-content-end flex-wrap"><small class="text-muted fs-5 fw-bold">${prod.precio}</small></p>
                            <button data-id="${prod.id}" class="btn btn-warning">Comprar</button>
                        </div>
                    </div>
                </div>
                    `

                cards.append(card);
                
            });
        });
    };
 };

//3-Traigo el evento para capturar el el btn comprar .btn-warning - tomo todo los padres con comprar
const addCarrito = e => {
    if (e.target.classList.contains('btn-warning')) {
        // console.log(e.target);
        //Envío el comprar a setcarrito
        if(localStorage.getItem('carrito') == "[]"){
            $('#carritoOcultar').show(200);
            $('#ocultarCarrito').show(200);
            $('#mostrarCarrito').hide(500);
        } 
        setCarrito(e.target.parentElement);
        $('#finCompra').show();
        $('#apretarBoton').hide(500);
   
        
    }
    e.stopPropagation();
};

//4-Envío un objeto producto a carrito
const setCarrito = objeto => {
    // console.log (objeto);
    const producto = {
        id: objeto.querySelector('.btn-warning').dataset.id,
        marca:  objeto.querySelector('h5').textContent,
        precio:  objeto.querySelector('p').textContent,
        cantidad: 1
    };
 
    if (carrito.find(p => p.id == producto.id) == undefined) {
        carrito.push(producto)
    } else { carrito.find(p => p.id == producto.id).cantidad += 1}

    
    imprimoCarrito();

};

const imprimoCarrito = () => {
    
    // console.log(carrito);
    //Iniciamos vacio el inner de itemas para que lo pise y no repita
    items.innerHTML = ' ';
    carrito.forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.marca;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;
        //clonamos las cards x cantidad de productos que recorremos
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment) 

    imprimoFooter();
    

    localStorage.setItem('carrito', JSON.stringify(carrito));

};


const imprimoFooter = () => {
    footer.innerHTML = '';
    if (carrito.length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return;
    }

    const nCantidad = carrito.reduce((acc, {cantidad}) => acc + cantidad, 0);
    const nPrecio = carrito.reduce((acc, {cantidad,precio}) => acc + cantidad * precio, 0);
    // console.log(nPrecio);

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);


    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', () => {
        carrito = [];
        imprimoCarrito();
    })
}



const btnAccion = e => {
    // console.log(e.target);
    //Accion de aumentar
    if (e.target.classList.contains('btn-info')) {
        
        carrito.find(p => p.id == e.target.dataset.id).cantidad ++;
        
        imprimoCarrito();
        
    }

    if (e.target.classList.contains('btn-danger')) {
        
        carrito.find(p => p.id == e.target.dataset.id).cantidad --;
        
        if(carrito.find(p => p.id == e.target.dataset.id).cantidad === 0) {
        
            var item = carrito.findIndex(p => p.id == e.target.dataset.id);
            carrito.splice(item,1);

        }

        imprimoCarrito();  
    }
    e.stopPropagation();
}

const btnMostrar = e => {
    if (e.target.classList.contains('mostrarCarrito')) {
    $('#carritoOcultar').show(500,function(){
        $('#apretarBoton').hide(500);
        // $('#muestraEfecto').remove.classList('btn-success');
        // $('#muestraEfecto').classList.add ('btn-warning');
        $('#mostrarCarrito').fadeOut(1000); 
        $('#ocultarCarrito').show(1000);  
        $('#finCompra').show(1000);
        
    });
    
    
};
};    
   
const btnOcultar = e => {
    if (e.target.classList.contains('ocultarCarrito')) {    
    $('#carritoOcultar').hide(600, function() {
        $('#ocultarCarrito').fadeOut(600);
        $('#mostrarCarrito').show(600);
    });   
};
};

const btnfinCompra = () => {

    
    usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    carrito = JSON.parse(localStorage.getItem('carrito'));
    let celus = ':';
    let products = $('#products');
    
    if (carrito.length == 0){
        $('.actualUser').html('No agregó ningún producto a la cesta');
        $('#sinCompra').hide();  
        $('.finModal').hide();  
    } else {
        $('.finModal').show();  
        $('#sinCompra').show(); 
        $('.actualUser').html(`Felicitaciones ${usuarioActual.nombre}`);
        
        carrito.forEach(p => {
        
        celus =  celus + '  ' + `${p.marca} -`;
        });    
    products.html(celus);
    };
    const nPrecio = carrito.reduce((acc, {cantidad,precio}) => acc + cantidad * precio, 0);
    $('#total').html(`$${nPrecio}`);
};

const btnfinModal = (e) => {
    
    // carrito = JSON.parse(localStorage.getItem('carrito'));
    // console.log(e.target);
    if (e.target.classList.contains('finModal')){
    carrito = [];
    imprimoCarrito();
    $('#apretarBoton').show(200);
    };
    
    
};


const btnCerrarSesion = e => {
    
    localStorage.clear();
    location.reload()
    
};

