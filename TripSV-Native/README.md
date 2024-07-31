# Proyecto TrivSV

| Requisitos    | Version  | 
|---------------|----------|
| Node          | v18.15.0 |
| AndroidStudio | 2022     |

To run your project, navigate to the directory and run one of the following npm commands.

## Pasos de construccion del proyecto

### Clonamos el repositorio

```shell
 git clone
```

### Cambiamos de directorio a nuestro proyecto

```shell
 cd trivsv-native
```

### Instala las librerias

```shell
 npm install
```

## Para correr nuestro proyecto
---

### Correr en android

* Esta opcion require android-studio sdk

```shell
 npm run android
```

### Correr en ios

* Necesitas usar un macOs para construir el proyecto en IOS, use la app de expo si quiere hacer el desarrollo sin un
  equipo mac.

```shell
 npm run ios 
```

### Correr via navegador

```shell
 npm run web
```

### Compilar para expo modo previsualizacion

```shell
 eas build -p android --profile preview

```