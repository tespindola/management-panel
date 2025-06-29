# 💰 Panel de Gestión de Deudas Personales

Un sistema completo y moderno para administrar tus deudas personales, ingresos y proyecciones financieras. Desarrollado con Next.js 15, TypeScript y Tailwind CSS.

![Panel de Gestión de Deudas](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Características Principales

### 🎯 **Gestión Completa de Deudas**
- **Deudas por Cobrar**: Registra dinero que te deben
- **Deudas por Pagar**: Controla tus obligaciones financieras
- **Pagos Parciales**: Sistema avanzado para registrar pagos parciales con historial completo
- **Estados Dinámicos**: Pendiente, Pagado, Cobrado con indicadores visuales
- **Categorización**: Organiza tus deudas por categorías personalizadas

### 📊 **Dashboard Inteligente**
- **Resumen en Tiempo Real**: Totales actualizados automáticamente
- **Balance Proyectado**: Cálculo automático considerando pagos parciales
- **Filtrado por Mes**: Vista mensual con navegación intuitiva
- **Estadísticas Visuales**: Contadores y métricas importantes

### 💡 **Proyecciones Financieras**
- **Múltiples Escenarios**: Crea diferentes proyecciones para el próximo mes
- **Planificación Flexible**: Combina deudas existentes con nuevas entradas
- **Balance Automático**: Cálculo de superávit/déficit proyectado
- **Comparación Visual**: Analiza diferentes estrategias financieras

### 📈 **Reportes Avanzados**
- **4 Vistas Especializadas**: Resumen, Comparación, Detalles y Proyecciones
- **Análisis Temporal**: Comparación entre meses con tendencias
- **Detalles Completos**: Listado exhaustivo con pagos parciales
- **Historial de Pagos**: Seguimiento completo de todos los movimientos

### 🎨 **Experiencia de Usuario**
- **Modo Oscuro/Claro**: Tema adaptable con preferencias del sistema
- **Multiidioma**: Soporte completo para Español e Inglés
- **Responsive Design**: Funciona perfectamente en desktop y móvil
- **Fuente Optimizada**: Google Fonts (Inter) para mejor legibilidad

### 💾 **Almacenamiento Local**
- **Sin Servidor**: Todos los datos se guardan localmente en tu navegador
- **Formato JSON**: Estructura de datos clara y exportable
- **Persistencia Automática**: Guardado automático de todos los cambios
- **Sin Autenticación**: Acceso directo sin necesidad de registro

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/debt-management-panel.git
   cd debt-management-panel
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Ejecuta el proyecto**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. **Abre tu navegador**
   Visita [http://localhost:3000](http://localhost:3000)

## 📱 Cómo Usar

### 1. **Gestión de Deudas**
- Haz clic en "Agregar Deuda" para registrar nuevas deudas
- Selecciona el tipo: "Por Cobrar" o "Por Pagar"
- Completa la información: descripción, monto, fecha, categoría
- Usa "Pago Parcial" para registrar pagos incrementales
- Marca como "Completo" cuando la deuda esté saldada

### 2. **Registro de Ingresos**
- Ve a la pestaña "Ingresos"
- Registra tus ingresos esperados con fechas
- Categoriza por tipo: salario, freelance, etc.
- Marca como "Recibido" cuando el ingreso se concrete

### 3. **Crear Proyecciones**
- Accede a "Proyecciones" 
- Crea múltiples escenarios: "Optimista", "Conservador", etc.
- Selecciona deudas existentes o agrega nuevas
- Compara diferentes estrategias de pago
- Analiza el balance esperado

### 4. **Análisis de Reportes**
- **Resumen**: Vista general de 3 meses
- **Comparación**: Tendencias y variaciones
- **Detalles**: Listado completo con pagos parciales
- **Proyecciones**: Análisis de escenarios futuros

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript para type safety
- **Estilos**: Tailwind CSS + shadcn/ui components
- **Iconos**: Lucide React
- **Temas**: next-themes para modo oscuro
- **Fechas**: date-fns para manejo de fechas
- **Fuentes**: Google Fonts (Inter)
- **Almacenamiento**: localStorage del navegador

## 📁 Estructura del Proyecto

```
debt-management-panel/
├── app/
│   ├── globals.css          # Estilos globales y variables CSS
│   ├── layout.tsx           # Layout principal con providers
│   └── page.tsx             # Página principal de la aplicación
├── components/
│   ├── ui/                  # Componentes base de shadcn/ui
│   ├── debt-card.tsx        # Tarjeta individual de deuda
│   ├── debt-form.tsx        # Formulario para crear/editar deudas
│   ├── income-card.tsx      # Tarjeta de ingreso
│   ├── income-form.tsx      # Formulario de ingresos
│   ├── partial-payment-form.tsx # Formulario de pagos parciales
│   ├── projection-card.tsx  # Tarjeta de proyección
│   ├── projection-form.tsx  # Formulario de proyecciones
│   ├── reports-section.tsx  # Sección completa de reportes
│   ├── theme-toggle.tsx     # Selector de tema
│   └── language-toggle.tsx  # Selector de idioma
├── hooks/
│   └── use-translations.ts  # Hook para manejo de traducciones
└── lib/
    └── utils.ts             # Utilidades y helpers
```

## 💾 Estructura de Datos

Los datos se almacenan en localStorage con la siguiente estructura:

```json
{
  "debts": [
    {
      "id": "1640995200000",
      "type": "payable",
      "description": "Préstamo personal",
      "amount": 5000,
      "dueDate": "2024-02-15",
      "status": "pending",
      "category": "Préstamo",
      "notes": "Banco XYZ"
    }
  ],
  "incomes": [
    {
      "id": "1640995200001",
      "description": "Salario enero",
      "amount": 3000,
      "expectedDate": "2024-01-31",
      "status": "pending",
      "category": "Salario"
    }
  ],
  "partialPayments": [
    {
      "id": "1640995200002",
      "debtId": "1640995200000",
      "amount": 1000,
      "date": "2024-01-15",
      "notes": "Primer pago",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "projections": [
    {
      "id": "1640995200003",
      "name": "Escenario Optimista",
      "month": "2024-02",
      "debtsToReceive": [...],
      "debtsToPayy": [...],
      "expectedBalance": 2000,
      "notes": "Considerando todos los ingresos",
      "createdAt": "2024-01-20T15:45:00.000Z"
    }
  ]
}
```

## 🎨 Personalización

### Cambiar Tema
- Usa el botón de tema en la esquina superior derecha
- Opciones: Claro, Oscuro, Sistema

### Cambiar Idioma
- Usa el selector de idioma (🌐) junto al tema
- Idiomas disponibles: Español, English

### Agregar Nuevas Traducciones
Edita el archivo `hooks/use-translations.ts`:

```typescript
const translations = {
  "nueva.clave": {
    es: "Texto en español",
    en: "Text in English"
  }
}
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] **Exportación de datos** - CSV, PDF, Excel
- [ ] **Gráficos interactivos** - Charts.js integration
- [ ] **Recordatorios** - Notificaciones de vencimientos
- [ ] **Calculadora de intereses** - Para préstamos
- [ ] **Backup en la nube** - Sincronización opcional
- [ ] **Categorías avanzadas** - Sistema de etiquetas
- [ ] **Modo offline** - PWA capabilities
- [ ] **Importación de datos** - Desde archivos CSV/JSON

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tomas Espindola**
- GitHub: [@tespindola](https://github.com/tespindola)
- LinkedIn: [Tomas Espindola](https://www.linkedin.com/in/tomas-ezequiel-espindola-4386b71b6/)

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes base
- [Lucide](https://lucide.dev/) por los iconos
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de estilos
- [Next.js](https://nextjs.org/) por el framework

---

⭐ **¡Si este proyecto te resulta útil, no olvides darle una estrella!** ⭐
