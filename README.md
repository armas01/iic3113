# React + Vite - Web Scraper Inmobiliario

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 🏠 Acerca del Proyecto

Sistema de web scraping y análisis de propiedades inmobiliarias del mercado chileno. Extrae datos de Portal Inmobiliario y proporciona análisis avanzados con preparación para integración con IA.

### Características Principales

- 🕷️ **Web Scraping**: Extracción automatizada de propiedades
- 📊 **Raw Data**: Visualización de datos sin procesar
- 🤖 **Análisis con IA**: Sistema preparado para Machine Learning
- 📈 **Insights del Mercado**: Análisis estadísticos avanzados
- 🎯 **Oportunidades de Inversión**: Detección automática de mejores ofertas
- 📍 **Análisis Geográfico**: Comparación por comunas
- 💰 **Análisis de Precios**: Distribución, tendencias y correlaciones

## 🚀 Cómo usar

### Instalación

```bash
yarn install
```

### Desarrollo

Para iniciar solo el frontend:

```bash
yarn dev
```

Para iniciar frontend + backend juntos:

```bash
yarn dev:full
```

O en terminales separadas:

```bash
# Terminal 1 - Frontend
yarn dev

# Terminal 2 - Backend
yarn server
```

### Acceso a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 📁 Estructura del Proyecto

```
iic3113/
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx          # Página de inicio
│   │   ├── Dashboard.jsx     # Dashboard principal
│   │   ├── RawData.jsx       # Visualización de datos crudos
│   │   ├── Analysis.jsx      # Análisis avanzado con IA
│   │   ├── Guide.jsx         # Guía de uso
│   │   └── Team.jsx          # Información del equipo
│   └── App.jsx
├── server/
│   ├── index.js              # Servidor Express
│   ├── scraper.js            # Web scraper con Puppeteer
│   ├── dataAnalyzer.js       # Motor de análisis
│   └── README.md             # Documentación del backend
└── package.json
```

## 🛠️ Tecnologías

### Frontend
- React 19
- Vite
- CSS Modules
- Axios (para llamadas API)

### Backend
- Express.js
- Puppeteer (web scraping)
- Cheerio (HTML parsing)
- CORS

## 📊 Páginas de la Aplicación

### 1. Home
Página de bienvenida con información del proyecto y estadísticas generales.

### 2. Dashboard
Interfaz principal con:
- Filtros de búsqueda (operación, tipo, comuna, precio)
- Tarjetas de propiedades
- Estadísticas generales
- Insights del mercado

### 3. Análisis IA
Análisis avanzado con:
- Resumen estadístico
- Insights del mercado
- Análisis de precios por m²
- Rankings por ubicación
- Oportunidades de inversión
- Modelos de ML sugeridos
- Estado de preparación para IA

### 4. Raw Data
Visualización de datos sin procesar con:
- Metadata del scraping
- Tres vistas: Formateado, JSON, Tabla
- Exportación a JSON/CSV
- Detalles completos de cada propiedad

### 5. Guía
Guía completa de uso de la plataforma.

### 6. Equipo
Información del equipo de desarrollo.

## 🤖 Integración con IA (Preparada)

El sistema está completamente preparado para integración con IA, incluyendo:

### Data Schema para Machine Learning
- **Campos numéricos**: price, priceUF, bedrooms, bathrooms, area, parking
- **Campos categóricos**: comuna, propertyType, operation, currency, realEstate
- **Campos temporales**: scrapedAt

### Modelos Sugeridos
1. **Price Prediction** (Regresión)
   - Predice precios basado en características
   
2. **Property Classification** (Clasificación)
   - Clasifica tipos de propiedades
   
3. **Opportunity Detection** (Detección de Anomalías)
   - Identifica oportunidades de inversión
   
4. **Market Segmentation** (Clustering)
   - Segmenta el mercado en grupos similares

### Endpoints Preparados
- `POST /api/ai-analysis` - Para análisis con modelos de IA (próximamente)

## 📡 API Endpoints

Ver documentación completa en `server/README.md`

Principales endpoints:
- `GET /api/health` - Health check
- `GET /api/properties` - Obtener propiedades
- `GET /api/raw-data` - Datos sin procesar
- `GET /api/analysis` - Análisis avanzado
- `POST /api/scrape` - Ejecutar scraping
- `POST /api/ai-analysis` - Análisis con IA (próximamente)

## 👥 Equipo

- **Rodolfo Andrés Armas Saenz** - Gerente / Líder de Proyecto
- **Juan Manuel Hernández** - Gerente / Análisis de Negocio
- **Agustín Arias** - Jefe de Bases de Datos
- **Baltazar Lutjens** - Jefe de NLP
- **Nicolás Fernández** - Jefe de Datos
- **María Ignacia De Goyeneche** - Jefa de Web Scraping

## 📝 Notas de Desarrollo

### Web Scraping
El scraper utiliza Puppeteer para navegación headless y Cheerio para parsing HTML. Incluye:
- Rotación de User-Agent
- Delays aleatorios entre requests
- Manejo de errores robusto
- Soporte para múltiples páginas

### Análisis de Datos
El motor de análisis calcula automáticamente:
- Estadísticas descriptivas
- Distribuciones de precios
- Rankings por ubicación
- Correlaciones entre variables
- Oportunidades de inversión
- Calidad de datos
- Valores atípicos (outliers)

## 🔜 Próximas Características

- [ ] Integración con base de datos
- [ ] Modelos de ML entrenados
- [ ] API de predicción de precios
- [ ] Sistema de alertas
- [ ] Exportación avanzada de reportes
- [ ] Dashboard de administración
- [ ] Autenticación de usuarios
- [ ] Historial de búsquedas

## 📄 Licencia

Este proyecto es parte del curso IIC3113.

---

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
