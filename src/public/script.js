const markdownInput = document.getElementById("markdownInput");
const preview = document.getElementById("preview");
const actualBtn = document.getElementById("actual-btn");

const sidebar = document.getElementById("sidebar");
const fileChosen = document.getElementById("file-chosen");



actualBtn.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const content = e.target.result;
    markdownInput.value = content;
    processMarkdown();
    
  };

  reader.onerror = function (e) {
    console.error("File could not be read! Code " + e.target.error.code);
  };

  reader.readAsText(file);
});

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

const updatePreviewText = (text,id) => {
  preview.innerHTML = text;

    markdownInput.dataset.documentId = id;
  
}

// Function to send input to backend and update the output div
async function processMarkdown() {
  const text = markdownInput.value.trim();
  const documentId = markdownInput.dataset.documentId;
  if (!text) {
    preview.innerHTML = "<p class='text-gray-500'>Start typing Markdown...</p>";
    return;
  }
  try {
   
    const data = await sendTextToServer(text,documentId);

    if (data.processedText) {
      const processedText = data.processedText;
      const documentId = data.documentId; 
      updatePreviewText(processedText,documentId);
    } else {
      console.error("Error:", data.message);
      preview.innerHTML = `<span class="text-red-500">${data.message}</span>`;
    }
   
  } catch (error) {
    console.error("Error processing markdown:", error);
    preview.innerHTML = `<span class="text-red-500">Error processing input.</span>`;
  }
}

const sendTextToServer = async (text, documentId = "") => {
  let data
  if(documentId){
    const response = await fetch(`/markdown/update/${documentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text}),
    });
   data = await response.json();
  
  }else{
    const response = await fetch("/markdown/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, tags: [] }),
    });
    data = await response.json();
  
  }

  return data;
};

function toggleSidebar() {
  sidebar.classList.toggle("w-64");
  sidebar.classList.toggle("w-0");
}

markdownInput.addEventListener("input", debounce(processMarkdown, 1000));


  const sidebarToggleBtn = document.getElementById("sidebar-toggle");
  sidebarToggleBtn.addEventListener("click", async () => {
    loadDocumentList()
  });

async function loadDocument(id) {
  const response = await fetch(`/markdown/document/${id}`);
  const fileName = document.getElementById("fileName");

  const res = await response.json();
  if (res) {
    toggleSidebar()
    markdownInput.value = res.content;
    fileName.value = res.title;
   updatePreviewText(res.processedText,id);
  } else {
    console.error("Document not found");
  }
}

async function createNewFile() {
  markdownInput.value = "";
  updatePreviewText("", "");
}

async function deleteDocument(id) {
  const response = await fetch(`/markdown/document/${id}`, {
    method: "DELETE",
  });
  const res = await response.json();
  if (res.message === "Document deleted successfully") {
    loadDocumentList();
  } else {
    console.error("Error deleting document:", res.message);
  }
}

async function loadDocumentList() {
  const response = await fetch("/markdown/documents")
  const res = await response.json()
        const documents = res.documents
        const sidebar = document.getElementById("document-list");
        if(res && res.documents && res.documents.length > 0) {
        sidebar.innerHTML = documents.map(doc => `<li class=" border-b border-gray-200 cursor-pointer flex justify-between" ><p class="hover:bg-gray-700 p-2" onclick="loadDocument('${doc._id}')">${doc.title}</p><div>
          
          <button onclick="deleteDocument('${doc._id}')" class="hover:bg-gray-700 text-red-500 p-2"><img style="width: 25px" src="/images/bin.svg"/></button>
          </div></li>`).join(''); 
        }else {
         sidebar.innerHTML=` <li class="flex items-center justify-center" id="document-list-placeholder">
          <p class="text-gray-500">No documents available.</p>
        </li>`
        }
      }

const saveButton = document.getElementById("saveButton");

async function saveFile() {
  const fileName = document.getElementById("fileName").value;
  const documentId = markdownInput.dataset.documentId;
  if (fileName && documentId) {
    const response = await fetch(`/markdown/update-title/${documentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: fileName, }),
    });

    const data = await response.json();
    if (response.ok) {
      loadDocumentList();
    } else {
      console.error("Error saving document:", data.message);
    }
  } else {
    console.error("File name and content cannot be empty.");
  }
}

