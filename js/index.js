const botonesArticulos = document.querySelectorAll("#articulos button");
const db = window.localStorage;
const cuerpoTabla = document.getElementById("cuerpoTabla");
const btnLimpiarCarrito = document.getElementById("btnLimpiarCarrito");
let keysItemCarrito = [];
let precioFinal = document.getElementById("precioFinal");
btnLimpiarCarrito.addEventListener("click", limpiarCarrito);

function asignarIdBotonesArticulos() {
  console.log(botonesArticulos);
  botonesArticulos.forEach((element, index) => {
    element.id = index + 1;
    element.addEventListener("click", agregarItemCarrito);
  });
  comprobarItemsLocalStorage();
}

function comprobarContenidoTabla() {
  if (cuerpoTabla.childNodes.length !== 0) {
    return true;
  } else {
    return false;
  }
}

function agregarItemCarrito(e) {
  let keysLocalStorage = Object.keys(db);
  let item;
  if (comprobarContenidoTabla()) {
    let estado = true;
    for (let index = 0; index < db.length; index++) {
      if (
        parseInt(e.target.id) ===
        JSON.parse(db.getItem(keysLocalStorage[index])).id
      ) {
        item = JSON.parse(db.getItem(keysLocalStorage[index]));
        item.cantidad = item.cantidad + 1;
        db.setItem(item.id, JSON.stringify(item));
        document.getElementById("cantidad" + item.id).textContent =
          item.cantidad;
        document.getElementById("total" + item.id).textContent =
          item.cantidad * item.precio;
        calcularPrecioFinal();
        estado = false;
        break;
      }
    }
    if (estado) {
      crearItem(e);
    }
  } else {
    crearItem(e);
  }
}

function crearItem(e) {
  console.log("sadsada");
  let hijosContenedorBoton = e.target.parentNode.childNodes;
  let nombreArticulo = hijosContenedorBoton[1].textContent;
  let precioArticulo = parseInt(
    hijosContenedorBoton[3].textContent.replace("€", "").replace(" ", "")
  );
  let objeto = {
    id: parseInt(e.target.id),
    nombre: nombreArticulo,
    precio: precioArticulo,
    cantidad: 1,
  };
  db.setItem(objeto.id, JSON.stringify(objeto));
  pintarItem(objeto);
}

function pintarItem(objeto) {
  const tr = document.createElement("tr");
  const tdId = document.createElement("td");
  tdId.textContent = objeto.id;
  const tdNombre = document.createElement("td");
  tdNombre.textContent = objeto.nombre;
  const tdCantidad = document.createElement("td");
  tdCantidad.id = "cantidad" + objeto.id;
  tdCantidad.textContent = objeto.cantidad;
  const tdTotal = document.createElement("td");
  tdTotal.id = "total" + objeto.id;
  tdTotal.textContent = objeto.precio * objeto.cantidad;
  tr.appendChild(tdId);
  tr.appendChild(tdNombre);
  tr.appendChild(tdCantidad);
  tr.appendChild(tdTotal);
  cuerpoTabla.appendChild(tr);
  calcularPrecioFinal();
}

function comprobarItemsLocalStorage() {
  let keysLocalStorage = Object.keys(db);
  let item;
  botonesArticulos.forEach((element, indice) => {
    for (let index = 0; index < db.length; index++) {
      if (indice + 1 === JSON.parse(db.getItem(keysLocalStorage[index])).id) {
        item = JSON.parse(db.getItem(keysLocalStorage[index]));
        pintarItem(item);
        break;
      }
    }
  });
}

function limpiarCarrito() {
  if (comprobarContenidoTabla()) {
    let keysLocalStorage = Object.keys(db);
    botonesArticulos.forEach((element, indice) => {
      for (let index = 0; index < db.length; index++) {
        if (indice + 1 === JSON.parse(db.getItem(keysLocalStorage[index])).id) {
          keysItemCarrito.push(
            JSON.parse(db.getItem(keysLocalStorage[index])).id
          );
          break;
        }
      }
    });
    borrarItemsCarrito(keysItemCarrito);
  }
}

function borrarItemsCarrito(array) {
  for (key of array) {
    localStorage.removeItem(key);
  }
  window.location.reload();
}

function calcularPrecioFinal() {
  let conteo = 0;
  for (let index = 0; index < cuerpoTabla.childNodes.length; index++) {
    conteo += parseInt(cuerpoTabla.childNodes[index].lastChild.textContent);
  }
  precioFinal.textContent = conteo;
}

asignarIdBotonesArticulos();
