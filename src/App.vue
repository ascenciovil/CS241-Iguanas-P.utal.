<template>
  <h1>Propuestas Utalca</h1>

  <nav>
    <RouterLink to="/login">Login</RouterLink> |
    <RouterLink to="/Registro">Registro</RouterLink> |
    <RouterLink to="/Editar">EditarPerfil</RouterLink> |
    <RouterLink to="/Propuesta">Propuesta</RouterLink>
    <div class="dropdown">
      <button class="acercaDe">Acerca de</button>
      <div class="dropdown-content">
        <a @click="abrirLineamientos()">Lineamientos</a>
        <a @click="abrirDocumentacion()">Documentación</a>
        <a @click="abrirPreguntas()">Preguntas Frecuentes</a>
      </div>
    </div>
  </nav>
  <main>
    <RouterView />
  </main>
  <body>
    <div id="ventanaLineamientos" class="ventana">
      <div class="contenido">
        <h2>Lineamientos</h2>
        <p>Esto es una ventana emergente.</p>
        <button @click="cerrarLineamientos()">Cerrar</button>
      </div>
    </div>
    <div id="ventanaDocumentacion" class="ventana">
      <div class="contenido">
        <h2>Documentacion</h2>
        <p>Esto es una ventana emergente.</p>
        <button @click="cerrarDocumentacion()">Cerrar</button>
      </div>
    </div>
    <div id="ventanaPreguntas" class="ventana">
      <div class="contenido">
        <h2>Preguntas Frecuentes</h2>
        <p>Esto es una ventana emergente.</p>
        <button @click="cerrarPreguntas()">Cerrar</button>
      </div>
    </div>
  </body>
</template>

<script setup>
function abrirLineamientos() {
  var elemento = document.getElementById("ventanaLineamientos");
  if (elemento != null) {
    elemento.style.display = "block";
  }
};

function cerrarLineamientos() {
  var elemento = document.getElementById("ventanaLineamientos");
  if (elemento != null) {
    elemento.style.display = "none";
  }
};

function abrirDocumentacion() {
  var elemento = document.getElementById("ventanaDocumentacion");
  if (elemento != null) {
    elemento.style.display = "block";
  }
};

function cerrarDocumentacion() {
  var elemento = document.getElementById("ventanaDocumentacion");
  if (elemento != null) {
    elemento.style.display = "none";
  }
};

function abrirPreguntas() {
  var elemento = document.getElementById("ventanaPreguntas");
  if (elemento != null) {
    elemento.style.display = "block";
  }
};

function cerrarPreguntas() {
  var elemento = document.getElementById("ventanaPreguntas");
  if (elemento != null) {
    elemento.style.display = "none";
  }
};
</script>

<style scoped>
.dropdown {
  display: inline-block;
  position: relative;
  width: 8%;
  font-size: small;
}

.dropdown-content {
  display: none;
  position: absolute;
  width: 100%;
  overflow: auto;
  box-shadow: 0px 20px 20px 0px rgba(0, 0, 0, 0.4);
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  display: block;
  color: #000000;
  padding: 5px;
  text-decoration: none;
  background-color: white;
}

.dropdown-content a:hover {
  color: #FFFFFF;
  background-color: #00cccc;
}

.ventana {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.contenido {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

#cerrarVentana {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.acercaDe {
  margin-left: 5px;
  font-size: medium;
  background-color: #bfbcf0;
  color: blue;
  text-decoration: underline;
  border-bottom: none;
  border-top: none;
  border-right: none;
  padding-left: 5px;
}
</style>
