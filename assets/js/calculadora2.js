    // Insertar texto en la posición del cursor dentro del textarea
function insertarEnCursor(textarea, texto) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const valor = textarea.value;

  textarea.value = valor.substring(0, start) + texto + valor.substring(end);
  const nuevoCursor = start + texto.length;
  textarea.selectionStart = textarea.selectionEnd = nuevoCursor;
  textarea.focus();
}

// Borrar último carácter antes del cursor
function borrarEnCursor(textarea) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const valor = textarea.value;

  if (start === 0 && end === 0) return; // nada que borrar

  if (start === end) {
    // borrar carácter antes del cursor
    textarea.value = valor.substring(0, start - 1) + valor.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start - 1;
  } else {
    // borrar selección
    textarea.value = valor.substring(0, start) + valor.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start;
  }
  textarea.focus();
}

// Preprocesar expresión para convertir notación matemática a JS
function convertirExpresionMatematica(expr) {
  return expr
    .replace(/sen\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/log10\(/g, "Math.log10(")
    .replace(/log\(/g, "Math.log(")
    .replace(/e\^\(([^)]+)\)/g, "Math.exp($1)")
    .replace(/e\^([a-zA-Z0-9]+)/g, "Math.exp($1)")
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/√([a-zA-Z0-9]+)/g, "Math.sqrt($1)")
    .replace(/(\d)([a-zA-Z])/g, "$1*$2")
    .replace(/([a-zA-Z])\^(\d+)/g, (_, v, p) => Array(parseInt(p)).fill(v).join("*"))
    .replace(/\s/g, "");
}

let grafica; // variable global para actualizar si ya existe

function graficarEuler(canvasId, xValores, yValores, graficaAnterior) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  if (graficaAnterior) graficaAnterior.destroy();
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: xValores,
      datasets: [{
        label: "Aproximación por Euler",
        data: yValores,
        borderColor: "rgba(15, 179, 179, 1)",
        backgroundColor: "rgba(4, 202, 202, 0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "x" } },
        y: { title: { display: true, text: "y" } }
      }
    }
  });
}

let grafica1 = null; 


document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("formula");
  const teclado = document.getElementById("teclado-virtual");
  const btnBorrar = document.getElementById("btn-borrar");
  const resultadoDiv = document.getElementById("resultado");
  const form = document.getElementById("eulerForm");

  teclado.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target !== btnBorrar) {
      const texto = e.target.getAttribute("data-insert");
      insertarEnCursor(textarea, texto);
    }
  });

  btnBorrar.addEventListener("click", () => {
    borrarEnCursor(textarea);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    resultadoDiv.textContent = "";

    const fxRaw = textarea.value;
    const fxStr = convertirExpresionMatematica(fxRaw);

    const x0 = parseFloat(document.getElementById("x0").value);
    const y0 = parseFloat(document.getElementById("y0").value);
    const h = parseFloat(document.getElementById("h").value);
    const n = parseInt(document.getElementById("n").value);

    
    

    let f;
    try {
      f = new Function("x", "y", "return " + fxStr);
      f(x0, y0);
    } catch (error) {
      resultadoDiv.textContent = "Función inválida. Revisa la sintaxis.";
      return;
    }

    let x = x0;
    let y = y0;


    let xValores = [x];
    let yValores = [y];

    resultadoDiv.textContent += `Paso 0: x = ${x.toFixed(4)}, y = ${y.toFixed(4)}\n`;

    for (let i = 1; i <= n; i++) {
      y = y + h * f(x, y);
      x = x + h;
      xValores.push(x);
      yValores.push(y);
      resultadoDiv.textContent += `Paso ${i}: x = ${x.toFixed(4)}, y = ${y.toFixed(4)}\n`;
    }

    resultadoDiv.textContent += `\nResultado final:\nx = ${x.toFixed(4)}\ny = ${y.toFixed(4)}`;
    grafica1 = graficarEuler("graficaEuler", xValores, yValores, grafica1);
  });

   form.addEventListener("reset", (e) => {
    e.preventDefault();
    resultadoDiv.textContent = "";
    formula.value = "";
    x0.value= 0; 
    y0.value= 0;
    h.value= 0;
    n.value = 0;

      if(grafica1){
        grafica1.destroy();
        grafica1 = null;
      }
    
   });

});

let grafica2 = null;

document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("formula2");
  const teclado = document.getElementById("teclado-virtual-2");
  const btnBorrar = document.getElementById("btn-borrar-2");
  const resultadoDiv = document.getElementById("resultado2");
  const form = document.getElementById("eulerForm2");

  teclado.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target !== btnBorrar) {
      const texto = e.target.getAttribute("data-insert");
      insertarEnCursor(textarea, texto);
    }
  });

  btnBorrar.addEventListener("click", () => {
    borrarEnCursor(textarea);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    resultadoDiv.textContent = "";

    const fxRaw = textarea.value;
    const fxStr = convertirExpresionMatematica(fxRaw);

    const x0 = parseFloat(document.getElementById("x0_2").value);
    const y0 = parseFloat(document.getElementById("y0_2").value);
    const h = parseFloat(document.getElementById("h_2").value);
    const xFinal = parseFloat(document.getElementById("xFinal").value);

    const n = Math.round((xFinal - x0)/h);

    
    

    let f;
    try {
      f = new Function("x", "y", "return " + fxStr);
      f(x0, y0);
    } catch (error) {
      resultadoDiv.textContent = "Función inválida. Revisa la sintaxis.";
      return;
    }

    let x = x0;
    let y = y0;


    let xValores = [x];
    let yValores = [y];

    resultadoDiv.textContent += `Paso 0: x = ${x.toFixed(4)}, y = ${y.toFixed(4)}\n`;

    for (let i = 1; i <= n; i++) {
      y = y + h * f(x, y);
      x = x + h;
      xValores.push(x);
      yValores.push(y);
      resultadoDiv.textContent += `Paso ${i}: x = ${x.toFixed(4)}, y = ${y.toFixed(4)}\n`;
    }

    resultadoDiv.textContent += `\nResultado final:\nx = ${x.toFixed(4)}\ny = ${y.toFixed(4)}`;
    grafica2 = graficarEuler("graficaEuler2", xValores, yValores, grafica2);
  });

   form.addEventListener("reset", (e) => {
    e.preventDefault();
    resultadoDiv.textContent = "";
    formula.value = "";
    x0.value= 0; 
    y0.value= 0;
    h.value= 0;
    n.value = 0;

      if(grafica2){
        grafica2.destroy();
        grafica2 = null;
      }
    
   });

});