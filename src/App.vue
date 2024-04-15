<template>
  <h1>Propuestas Utalca</h1>

  <nav>
    <RouterLink to="/login">Login</RouterLink> |
    <RouterLink to="/Registro">Registro</RouterLink> |
    <RouterLink to="/Editar">EditarPerfil</RouterLink>
    <div class="dropdown">
      <button>Acerca de</button>
      <div class="dropdown-content">
        <a href="#">Lineamientos</a>
        <a href="#">Documentación</a>
        <a href="#">Preguntas Frecuentes</a>
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
}

.dropdown-content a:hover {
  color: #FFFFFF;
  background-color: #00A4BD;
}
</style>