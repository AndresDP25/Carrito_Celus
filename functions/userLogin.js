var usuarioActual;

//2)Cargamos al Usuario

const cargarUsuario = (e) => {
    e.preventDefault();
    let nombreUsuario = document.getElementById("nombre").value;
    let contactoUsuario = document.getElementById("contacto").value;
    let mensajeValidacion = document.querySelector('#mensaje-validacion');
    usuarioActual = new Usuario(nombreUsuario, contactoUsuario);

    if(usuarioActual.nombre == ""){

        mensajeValidacion.className="text-danger mt-3 display-4";
        mensajeValidacion.innerHTML=`Ingrese Usuario`;
        
    } else {
            mensajeValidacion.className="text-success mt-3 display-4";
            mensajeValidacion.innerHTML=`Bienvenido ${usuarioActual.nombre}`;
            $('.carrets').show(500);
            $('#apretarBoton').show(500);
            $('#mostrarCarrito').show(500);
            $('#muestraEfecto').show(500);
            $('#cerrarSesion').show(500);
            
            
            // setTimeout(()=>{
            //     window.location='./index.html';
            // },2000);
            setTimeout( ()=>{
            $('#formulario').hide(1000);},1000);

            localStorage.setItem('usuarioActual',JSON.stringify(usuarioActual));
            // carrito = [];
            localStorage.setItem('carrito', JSON.stringify(carrito));        
            imprimoProductos(); 
            
         }

}