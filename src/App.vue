<template>
   <h1>Propuestas Utalca</h1>
  
    <nav>
      <RouterLink to="/login">Login</RouterLink> |
      <RouterLink to="/Registro">Registro</RouterLink> |
      <RouterLink to="/Editar">EditarPerfil</RouterLink> |
      <RouterLink to="/Propuesta">Propuesta</RouterLink>
      <div class="dropdown">
      <button>Acerca de</button>
      <div class="dropdown-content">
        <a @click="abrirLineamientos()">Lineamientos</a>
        <a id="documentacion">Documentación</a>
        <a id="preguntas">Preguntas Frecuentes</a>
      </div>
    </div>
    </nav>
    <main>
      <RouterView />
    </main>
  </template>

<style scoped>
.dropdown {
  display: inline-block;
  position: relative;
  width: 8%;
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
</style>
