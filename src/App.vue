<template>
  <h1>Hello App!</h1>

  <nav>
    <RouterLink to="/login">Login</RouterLink> |
    <RouterLink to="/Registro">Registro</RouterLink> |
    <RouterLink to="/Editar">EditarPerfil</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>