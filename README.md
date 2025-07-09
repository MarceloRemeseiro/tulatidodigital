# Tu Latido Digital - Sitio Web Corporativo

Sitio web de la agencia de marketing digital **Tu Latido Digital**, especializada en copywriting, community management y media buying.

## 🚀 Tecnologías Utilizadas

- **Astro 5.9.3** - Framework moderno para sitios web estáticos
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework de CSS utilitario
- **Poppins Font** - Tipografía moderna de Google Fonts

## 🎨 Características

### ✨ Diseño y UX
- **Diseño responsive** adaptado a todos los dispositivos
- **Modo claro/oscuro** con toggle automático
- **Animaciones suaves** y microinteracciones
- **Paleta de colores** personalizada con gradientes teal y naranja

### 🛠 Funcionalidades
- **Navegación fija** con smooth scrolling
- **Toggle de servicios** entre paquetes integrales e individuales
- **Modal interactivo** para videos IA
- **Carousel de testimonios** con navegación automática y manual
- **Formulario de contacto** con validación
- **Newsletter subscription** en el footer

### 📱 Responsive Design
- **Desktop**: 1200px+ (grid completo)
- **Tablet**: 768px-1199px (grid adaptativo)
- **Mobile**: <768px (stack vertical)

## 🏗 Estructura del Proyecto

```
src/
├── layouts/
│   └── Layout.astro          # Layout base con meta tags y estilos
├── components/
│   ├── Navigation.astro      # Navegación con menú responsive
│   ├── Hero.astro           # Sección principal con CTA
│   ├── Services.astro       # Servicios con toggle y modal
│   ├── Testimonials.astro   # Carousel de testimonios
│   ├── About.astro          # Información de la empresa
│   ├── Contact.astro        # Formulario de contacto
│   └── Footer.astro         # Footer con enlaces y newsletter
├── pages/
│   └── index.astro          # Página principal
public/
└── favicon.svg              # Favicon personalizado
```

## 🚀 Comandos

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Construye para producción:

```bash
npm run build
```

Previsualiza el build de producción:

```bash
npm run preview
```

## 🎯 Secciones del Sitio

1. **Hero** - Mensaje principal y propuesta de valor
2. **Promesa** - Problema y solución que ofrece la agencia
3. **Servicios** - Paquetes integrales y servicios individuales
4. **Testimonios** - Casos de éxito de clientes reales
5. **Nosotros** - Historia y valores de Raquel y Lydia
6. **Contacto** - Formulario y información de contacto

## 📊 Optimizaciones SEO

- Meta tags completos para redes sociales
- Estructura semántica HTML5
- Tiempo de carga optimizado
- Responsive images
- Accesibilidad mejorada

## 🎨 Paleta de Colores

- **Teal**: `#0d9488` (principal)
- **Orange**: `#f97316` (acento)
- **Stone**: Variaciones para fondos y texto
- **Gradientes**: Combinaciones teal-orange para CTAs

## 📝 Customización

Para personalizar colores, edita `tailwind.config.mjs`:

```javascript
colors: {
  primary: { /* tus colores */ },
  secondary: { /* tus colores */ }
}
```

Para modificar contenido, edita los componentes en `src/components/`.

## 🔧 Integración de Formularios

El formulario de contacto está preparado para integrarse con:
- **Formspree**
- **Netlify Forms**
- **API personalizada**

Modifica el script en `Contact.astro` para conectar con tu servicio preferido.

## 📱 Features Mobile

- Menú hamburguesa animado
- Touch-friendly buttons
- Optimización de performance
- Navegación por swipe en carousel

## 🚀 Deploy

El proyecto está optimizado para deploy en:
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **Cualquier hosting estático**

```bash
npm run build
# Sube la carpeta ./dist/ a tu hosting
```

---

**Tu Latido Digital** - Agencia de Marketing Digital que convierte el caos digital en resultados reales.

✨ Hecho con ❤️ para emprendedoras que quieren brillar online. 