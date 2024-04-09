<template>
  <h1>Hello App!</h1>

  <nav>
    <RouterLink to="/login">Login</RouterLink> |
    <RouterLink to="/PerfilUsario'">Editar perfil</RouterLink> |
    <RouterLink to="/Registro">Registro</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>