# Guía: Conectar el Formulario RSVP a Google Sheets (Excel)

Para guardar todas las respuestas de confirmación de asistencia directamente en una hoja de Google Sheets (que luego puedes descargar como Excel con un clic), sigue estos sencillos pasos.

---

## Paso 1: Crear la Hoja de Google Sheets
1. Entra a tu cuenta de Google y crea una nueva planilla en [Google Sheets](https://docs.google.com/spreadsheets).
2. En la primera fila (fila 1), escribe exactamente los nombres de las columnas que usará el script. Escríbelos en las celdas de la **A1** a la **G1** en este orden:
   * **Celda A1:** `timestamp`
   * **Celda B1:** `name`
   * **Celda C1:** `attendance`
   * **Celda D1:** `companions`
   * **Celda E1:** `companion_names`
   * **Celda F1:** `diet`
   * **Celda G1:** `music`
   * **Celda H1:** `message`
3. Dale un nombre a tu planilla (ejemplo: *Confirmaciones Matrimonio*).

---

## Paso 2: Abrir el Editor de Scripts (Google Apps Script)
1. En el menú superior de la hoja de cálculo, ve a **Extensiones** (o *Extensions*) y selecciona **Apps Script**.
2. Se abrirá una nueva pestaña con un editor de código. Borra todo el código que aparezca por defecto en el archivo `Código.gs` (normalmente viene una función vacía llamada `myFunction`).

---

## Paso 3: Copiar y Pegar el Siguiente Código
Pega todo el siguiente código en el editor:

```javascript
function doPost(e) {
  try {
    // Abrir la planilla activa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Obtener los datos enviados
    var data = JSON.parse(e.postData.contents);
    
    // Preparar la fila con el mismo orden de las columnas de tu hoja
    var newRow = [
      data.timestamp || new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" }),
      data.name || "",
      data.attendance === "si" ? "Sí, asistirá" : "No asistirá",
      data.companions || "0",
      data.companion_names || "",
      data.diet || "",
      data.music || "",
      data.message || ""
    ];
    
    // Agregar la fila al final de la hoja
    sheet.appendRow(newRow);
    
    // Retornar respuesta de éxito
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    // Retornar respuesta de error
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Guarda los cambios haciendo clic en el icono del **Disquete** (o presionando `Ctrl + S`).

---

## Paso 4: Implementar como Aplicación Web
Para que el formulario de la página web pueda enviarle los datos al script, debes publicarlo:
1. Haz clic en el botón azul **Implementar** (o *Deploy*) en la esquina superior derecha, y selecciona **Nueva implementación** (o *New deployment*).
2. En la ventana emergente, haz clic en el icono de engranaje al lado de "Seleccionar tipo" y elige **Aplicación web** (o *Web app*).
3. Configura los parámetros exactamente así:
   * **Descripción:** `RSVP Matrimonio` (puedes poner lo que gustes).
   * **Ejecutar como:** **Tú** (tu dirección de correo electrónico).
   * **Quién tiene acceso:** **Cualquiera** (o *Anyone*). *Esto es muy importante para que la web pueda enviar datos sin pedir autenticación.*
4. Haz clic en **Implementar** (o *Deploy*).
5. Si es la primera vez, Google te pedirá **Autorizar acceso**. Haz clic en "Autorizar acceso", selecciona tu cuenta de Google, haz clic en "Configuración avanzada" (abajo) y luego en **Ir a Proyecto sin nombre (no seguro)**. Después, haz clic en **Permitir**.
6. Una vez completado, verás una ventana que dice "La implementación se completó correctamente".
7. Copia la **URL de la aplicación web** que te proporciona (empieza por `https://script.google.com/macros/s/...`).

---

## Paso 5: Guardar la URL en tu Código de la Página Web
1. Abre el archivo `app.js` de tu sitio web.
2. Busca la línea número 138 que dice:
   ```javascript
   const GOOGLE_SHEETS_SCRIPT_URL = "URL_DE_TU_GOOGLE_APPS_SCRIPT_AQUI";
   ```
3. Reemplaza `"URL_DE_TU_GOOGLE_APPS_SCRIPT_AQUI"` por la URL que copiaste en el paso anterior (asegúrate de mantener las comillas dobles).
   ```javascript
   const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/TU_ID_AQUI/exec";
   ```
4. Guarda el archivo `app.js`.

¡Listo! A partir de este momento, cada vez que un invitado rellene y envíe el formulario de confirmación en la página web, se agregará una fila en tiempo real en tu planilla de Google Sheets. 

*Nota: Desde Google Sheets puedes ir a **Archivo** > **Descargar** > **Microsoft Excel (.xlsx)** cuando quieras consolidar la información o enviarla a tu banquetera.*
