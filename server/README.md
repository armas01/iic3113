# Web Scraper - Backend API

API RESTful para scraping y análisis de propiedades inmobiliarias del mercado chileno.

## 🚀 Tecnologías

- **Express.js** - Framework web
- **Puppeteer** - Web scraping con headless Chrome
- **Cheerio** - Parsing de HTML
- **CORS** - Cross-Origin Resource Sharing

## 📋 Endpoints

### Health Check
```
GET /api/health
```
Verifica que el servidor esté en línea.

### Obtener Propiedades
```
GET /api/properties
```
Devuelve todas las propiedades scrapeadas.

### Obtener Raw Data
```
GET /api/raw-data
```
Devuelve los datos sin procesar incluyendo metadata.

### Obtener Análisis
```
GET /api/analysis
```
Devuelve análisis avanzado de las propiedades con insights, estadísticas y oportunidades de inversión.

### Ejecutar Scraping
```
POST /api/scrape
Body: {
  "operation": "venta" | "arriendo",
  "propertyType": "departamento" | "casa" | "oficina" | "bodega" | "estacionamiento",
  "comuna": "las-condes" | "providencia" | etc.,
  "pages": 3
}
```
Inicia el proceso de scraping.

### Análisis con IA (Coming Soon)
```
POST /api/ai-analysis
Body: {
  "properties": [...],
  "query": "string"
}
```
Endpoint preparado para futura integración con modelos de IA.

### Limpiar Datos
```
DELETE /api/properties
```
Elimina todas las propiedades almacenadas.

## 🗂️ Estructura de Datos

### Property Schema
```javascript
{
  id: string,
  title: string,
  price: number,
  priceText: string,
  priceUF: number,
  currency: 'CLP' | 'UF' | 'USD',
  location: string,
  comuna: string,
  address: string,
  propertyType: string,
  type: string,
  operation: 'venta' | 'arriendo',
  link: string,
  bedrooms: number,
  bathrooms: number,
  area: number,
  sqMeters: number,
  parking: number,
  parkings: number,
  attributes: string[],
  isNew: boolean,
  realEstate: string,
  scrapedAt: string (ISO 8601),
  source: string
}
```

## 📊 Análisis de Datos

El sistema de análisis incluye:

- **Summary Statistics**: Estadísticas generales del mercado
- **Price Analysis**: Distribución de precios, precio por m², cuartiles
- **Location Analysis**: Análisis por comuna, rankings
- **Type Analysis**: Análisis por tipo de propiedad
- **Market Insights**: Insights automáticos del mercado
- **Opportunities**: Detección de oportunidades de inversión
- **Correlations**: Correlaciones entre variables
- **AI Ready Data**: Datos preparados para modelos de ML

## 🤖 Preparación para IA

El backend incluye una estructura completa para integración futura con IA:

### Modelos Sugeridos
1. **Price Prediction** (Regression)
2. **Property Classification** (Classification)
3. **Opportunity Detection** (Anomaly Detection)
4. **Market Segmentation** (Clustering)

### Data Schema para ML
- Campos numéricos: price, priceUF, bedrooms, bathrooms, area, parking
- Campos categóricos: comuna, propertyType, operation, currency, realEstate
- Campos temporales: scrapedAt

## 🛠️ Scraper

El scraper soporta dos modos:

1. **Real Scraping** (Puppeteer): Extrae datos reales de Portal Inmobiliario
2. **Mock Data**: Genera datos de prueba realistas

### Características
- User-Agent rotation para evitar detección
- Random delays entre páginas
- Error handling robusto
- Múltiples páginas de resultados

## 📈 Métricas de Calidad

El sistema calcula automáticamente:
- Completitud de datos
- Valores faltantes por campo
- Validación de tipos de datos
- Detección de outliers

## 🔒 Seguridad

- CORS habilitado para desarrollo
- Validación de parámetros
- Error handling
- Rate limiting (próximamente)

## 📝 Logs

El servidor muestra logs detallados:
- Inicio del servidor
- Scraping progress
- Errores y warnings
- Análisis completado

## 🚧 Próximas Características

- Integración con base de datos (MongoDB/PostgreSQL)
- Caché de resultados
- Rate limiting
- Autenticación
- Webhooks
- Integración con APIs de IA (OpenAI, Anthropic)
- Modelos de ML entrenados

