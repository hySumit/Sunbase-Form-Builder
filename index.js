let elements = [
  {
    id: "c0ac49c5-871e-4c72-a878-251de465e6b4",
    type: "input",
    label: "Sample Label",
    placeholder: "Sample placeholder"
  },
  {
    id: "146e69c2-1630-4a27-9d0b-f09e463a66e4",
    type: "select",
    label: "Sample Label",
    options: ["Sample Option", "Sample Option", "Sample Option"]
  },
  {
    id: "45002ecf-85cf-4852-bc46-529f94a758f5",
    type: "input",
    label: "Sample Label",
    placeholder: "Sample Placeholder"
  },
  {
    id: "680cff8d-c7f9-40be-8767-e3d6ba420952",
    type: "textarea",
    label: "Sample Label",
    placeholder: "Sample Placeholder"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const formCanvas = document.getElementById("form_canvas");
  const addInputBtn = document.getElementById("addInput");
  const addSelectBtn = document.getElementById("addSelect");
  const addTextareaBtn = document.getElementById("addTextarea");

  function createFormElement(type, label, placeholder = "", options = []) {
    let element = document.createElement("div");
    element.classList.add("form-element");
    element.setAttribute("draggable", "true");

    if (type === "input") {
      const labelElem = document.createElement("label");
      const inputElem = document.createElement("input");
      labelElem.textContent = label || "Input Label";
      inputElem.placeholder = placeholder || "Input Placeholder";
      inputElem.type = "text";
      element.appendChild(labelElem);
      element.appendChild(inputElem);
    } else if (type === "select") {
      const labelElem = document.createElement("label");
      const selectElem = document.createElement("select");
      labelElem.textContent = label || "Select Label";
      options.forEach(option => {
        const newOption = new Option(option);
        selectElem.add(newOption);
      });
      element.appendChild(labelElem);
      element.appendChild(selectElem);
      
      const optionInput = document.createElement("input");
      optionInput.placeholder = "Add Option";
      element.appendChild(optionInput);

      const addOptionBtn = document.createElement("button");
      addOptionBtn.textContent = "Add Option";
      addOptionBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const newOption = optionInput.value.trim();
        if (newOption) {
          selectElem.add(new Option(newOption));
          optionInput.value = "";
        }
      });
      element.appendChild(addOptionBtn);

      const removeOptionBtn = document.createElement("button");
      removeOptionBtn.textContent = "Remove Selected Option";
      removeOptionBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedOption = selectElem.selectedIndex;
        if (selectedOption !== -1) {
          selectElem.remove(selectedOption);
        }
      });
      element.appendChild(removeOptionBtn);
    } else if (type === "textarea") {
      const labelElem = document.createElement("label");
      const textareaElem = document.createElement("textarea");
      labelElem.textContent = label || "Textarea Label";
      textareaElem.placeholder = placeholder || "Textarea Placeholder";
      element.appendChild(labelElem);
      element.appendChild(textareaElem);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Remove";
    deleteBtn.addEventListener("click", () => element.remove());
    element.appendChild(deleteBtn);

    formCanvas.appendChild(element);

    addDragAndDropEvents(element);
  }

  elements.forEach(({ type, label, placeholder, options }) => {
    createFormElement(type, label, placeholder, options);
  });

  addInputBtn.addEventListener("click", () => createFormElement("input"));
  addSelectBtn.addEventListener("click", () => createFormElement("select"));
  addTextareaBtn.addEventListener("click", () => createFormElement("textarea"));

  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
  }

  function handleDrop(e) {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    if (type === "addInput") {
      createFormElement("input");
    } else if (type === "addSelect") {
      createFormElement("select");
    } else if (type === "addTextarea") {
      createFormElement("textarea");
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  addInputBtn.setAttribute("draggable", "true");
  addSelectBtn.setAttribute("draggable", "true");
  addTextareaBtn.setAttribute("draggable", "true");

  addInputBtn.addEventListener("dragstart", handleDragStart);
  addSelectBtn.addEventListener("dragstart", handleDragStart);
  addTextareaBtn.addEventListener("dragstart", handleDragStart);

  formCanvas.addEventListener("dragover", handleDragOver);
  formCanvas.addEventListener("drop", handleDrop);

  let draggedElement = null;

  function addDragAndDropEvents(element) {
    element.addEventListener("dragstart", (e) => {
      draggedElement = element;
      e.dataTransfer.effectAllowed = "move";
      setTimeout(() => {
        if (draggedElement) {
          draggedElement.classList.add("hidden");
        }
      }, 0);
    });

    element.addEventListener("dragend", () => {
      setTimeout(() => {
        if (draggedElement) {
          draggedElement.classList.remove("hidden");
          draggedElement = null;
        }
      }, 0);
    });

    element.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    element.addEventListener("drop", (e) => {
      e.preventDefault();
      if (draggedElement && draggedElement !== element) {
        const rect = element.getBoundingClientRect();
        const next = (e.clientY - rect.top) / rect.height > 0.5;
        formCanvas.insertBefore(draggedElement, next ? element.nextSibling : element);
      }
    });
  }

  document.querySelectorAll(".form-element").forEach(addDragAndDropEvents);

  const saveBtn = document.getElementById("save");
  saveBtn.addEventListener("click", () => {
    const elements = Array.from(formCanvas.children);
    const formData = elements.map((element) => {
      const label = element.querySelector("label")?.textContent || "";
      const input = element.querySelector("input[type='text']");
      const select = element.querySelector("select");
      const textarea = element.querySelector("textarea");

      if (input) {
        return { type: "input", label, value: input.value, placeholder: input.placeholder };
      } else if (select) {
        const options = Array.from(select.options).map((option) => option.value);
        return { type: "select", label, options };
      } else if (textarea) {
        return { type: "textarea", label, value: textarea.value, placeholder: textarea.placeholder };
      }
      return null;
    });

    console.log(JSON.stringify(formData, null, 2));
  });
});
    