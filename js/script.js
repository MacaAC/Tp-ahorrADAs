
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


// Funciones de clean y show atributos

const cleanAside = () => $("#aside").classList.add("hidden");

const showAside = () =>{ 
    $("#aside").classList.remove("hidden");
    categoriesSelectInput($("#selectCategoryFilters"))
}
const cleanFrontPage = () => $("#frontPage").classList.add("hidden");

const showNewOperationForm = () => {
    $("#formNewOperation").classList.remove("hidden")
    inputDate.value = todayDate()
    categoriesSelectInput($("#selectCategory"))

};

const cleanNewOperationForm = () => $("#formNewOperation").classList.add("hidden");
const showDoneOperations = () => $("#doneOperations").classList.remove("hidden");
const cleanDoneOperations = () => $("#doneOperations").classList.add("hidden");
const cleanEditOperationsForm = () => $("#editOperationsForm").classList.add("hidden");
const showEditOperationsForm = () => $("#editOperationsForm").classList.remove("hidden");
const showCategoriesForm = () => $("#categoriesForm").classList.remove("hidden");
const cleanCategoriesForm = () => $("#categoriesForm").classList.add("hidden");
const showContainer = () => $("#container").classList.remove("hidden");
const showEditCategoryWindow = () => $("#editCategoryWindow").classList.remove("hidden");
const cleanEditCategoryWindow = () => $("#editCategoryWindow").classList.add("hidden");



/*******************************************************/


const getDataInLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};


const saveDataInLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};


// AGREGAR OPERACIONES A UN ARRAY DE OBJETOS


const operationsInfo = () => {
    const description = $("#description").value
    const amount = $("#amount").value
    const type = $("#type").value
    const selectedCategory = $("#selectCategory").value
    var date = $("#date").value
    const id = makeid()
    return {
        id,
        description,
        amount,
        type,
        selectedCategory,
        date
    }
}

/**************************************************/

const makeid = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < 10 ; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


/*******************************************************/


const generateTableOperations = (operations) => {
   
    let maybeFiltedOperations = getDataInLocalStorage("operations");

    if (operations) {
        maybeFiltedOperations = operations;
    }
      
    $("#table").innerHTML = "";

    maybeFiltedOperations.map((operation) => {
        const { id, description, selectedCategory, date, amount, type } = operation;
        const className = type === "Gasto" ? "red-500" : "green-500";
        const operator = type === "Gasto" ? "-" : "+";

        var formatedDate = correctDate(date)

        $("#table").innerHTML += `
            
            <tr>
                <td class="pl-0 pr-10 mt-4 pt-0 text-lg font-bold">${description}</td>
                <td class="mt-0 pt-0 pl-10 text-xs ">${selectedCategory}</td>
                <td class="mt-0 pt-0 pl-10 text-sm">${formatedDate}</td>
                <td class="mt-0 pt-0 pl-12 text-lg text-${className} font-bold">${operator}${amount}</td>
                <td class="pl-8 mt-0 pt-0 text-xs"><button class="mr-4 btnEditOperation" data-id="${id}" onclick="operationEdit('${id}')">Editar</button><button class="mr-4 btnDeleteOperation" data-id="${id}" onclick="deleteOperation('${id}')">Eliminar</button></td>
            </tr>
             
        `;
  });
};

/*-----------------------------------------------------------------------------------*/


//Añadir las operaciones a la tabla, generar la tabla con las mismas, DOM que muestra la tabla


$("#addOperation").addEventListener("click", () => {
  let operations = getDataInLocalStorage("operations");
  operations.push(operationsInfo());

  saveDataInLocalStorage("operations", operations);

  generateTableOperations();

  cleanNewOperationForm();
  showDoneOperations();
  showAside();
});


//Evento añadir operaciones desde la tabla


$("#addOperationTable").addEventListener("click", () => {
  showNewOperationForm();
  cleanDoneOperations();
});


/*------------------------------------------------------------------*/


//Funcion que retorna un id especifico, es decir, una operacion o categoria especifica


const find = (objetsType, id) => {
  let results = getDataInLocalStorage(objetsType);
  console.log(results);
  return results.find((result) => result.id === id);
};


// Evento de editar operación, precarga los datos y botón dinámico


const operationEdit = (id) => {
  
  showEditOperationsForm()
  cleanDoneOperations()
  cleanAside()
  const editedOperation = find("operations", id);
  console.log(editedOperation);
  $("#editDescription").value = editedOperation.description;
  $("#editAmount").value = editedOperation.amount;
  $("#editType").value = editedOperation.type;
  $("#editSelectedCategory").value = editedOperation.selectedCategory;
  $("#editDate").value = editedOperation.date;

  $("#editContainer").innerHTML = `<button id="edit" data-id="${id}" class=" w-[91px] h-10 text-white border-none ml-2  bg-green-400 rounded-md ml-2" onclick="updateOperation('${id}')" >Editar</button>`;
};


//funcion que edita la operación por el usuario


const newOperationData = (id) => {
    return {
      id: id,
      description: $("#editDescription").value,
      amount: $("#editAmount").value,
      type: $("#editType").value,
      selectedCategory: $("#editSelectedCategory").value,
      date: $("#editDate").value,
    };
};


//Función que efectivamente edita

const updateOperation = (id) => {
  const newOperation = getDataInLocalStorage("operations");
  const updatedOperation = newOperation.map((operation) => {
    if (operation.id === id) {
      return newOperationData(id);
    }
    return operation;
  });

  saveDataInLocalStorage("operations", updatedOperation);
  cleanEditOperationsForm();
  showDoneOperations();
  showAside();
  
  const optionsFiltered = filterByOptions();
  const categoriesFiltered = filterByCategories($("#selectCategoryFilters").value, optionsFiltered);
 
  generateTableOperations(categoriesFiltered);
};


/*------------------------------------------------------------------*/

//Remover operación, delete


const removeOperation = (id) => {
  let operations = getDataInLocalStorage("operations");
  console.log(id)
  operations = operations.filter((operation) => operation.id !== id);
  saveDataInLocalStorage("operations", operations);
  return operations;
};


const deleteOperation = (id) => {
    console.log(id)
    removeOperation(id);
    filterByOptions()
   // return generateTableOperations();
};

/*******************************************************************/

//CANCELAR operación a editar

$("#cancelEditOperation").addEventListener("click", ()=>{
  cleanEditOperationsForm()
  showDoneOperations()
  showAside()
})




// evento para hacer desaparecer la portada y aparece el formulario de nueva op


$("#btnNewOperations").addEventListener("click", () => {
  cleanAside();
  cleanFrontPage();
  showNewOperationForm();
});


/*****************************************/

//ver tabla de categorias

$("#aCategory").addEventListener("click", () => {
  showCategoriesForm();
  cleanFrontPage();
  cleanDoneOperations();
  cleanAside();
  generateCategoriesItems();
  cleanEditCategoryWindow();
});


if (!localStorage.getItem("categories")){
localStorage.setItem ("categories", JSON.stringify([
    { id: makeid(),
      nameCategory: "Comida" },

    { id: makeid(), 
      nameCategory: "Servicios" },

    { id: makeid(), 
      nameCategory: "Salidas" },

    { id: makeid(), 
      nameCategory: "Educación" },

    { id: makeid(),
      nameCategory: "Transporte" },

    { id: makeid(), 
      nameCategory: "Trabajo" },
  ])
);
}

//Función que setea las categorías en el input select de nueva operación y en  en el input select de filtros de categorías


const categoriesSelectInput = (idInput) =>{
    let categories = getDataInLocalStorage('categories')
    idInput.innerHTML = ""
    for (const category of categories) {
        const {id, nameCategory} = category
        idInput.innerHTML += `<option value="${nameCategory}">${nameCategory}</option>`

    }
}

window.addEventListener('load', ()=>{
    alert("hola")
    categoriesSelectInput($("#selectCategoryFilters"))
    const option = document.createElement("option")
    const allText = document.createTextNode("Todas")
    option.appendChild(allText)

    $("#selectCategoryFilters").append(option)
    
   // $("#selectCategoryFilters").innerHTML += `<option>Todas</option>`
})
    

//AGREGAR CATEGORIAS A UN ARRAY DE OBJETOS EN LOCAL STORAGE


const categoriesInfo = () => {
  const nameCategory = $("#nameCategory").value;
  const id = makeid();
  return {
    id,
    nameCategory,
  };
};


const generateCategoriesItems = () => {
  $("#categoriesItems").innerHTML = "";
  $("#selectCategory").innerHTML = ""

  getDataInLocalStorage("categories").map((item) => {
    const { id, nameCategory } = item;

    $("#categoriesItems").innerHTML += ` <div class="flex flex-row">          
        <div class="flex w-[1300px] mt-8" >
            <span>${nameCategory}</span>
        </div>
    
        <div class="flex flex-row w-[200px] mt-8">
            
            <button class="ml-2" id="${id}" onclick="categoryEdit('${id}')">Editar</button>
            <button class="ml-2" id="${id}" onclick="deleteCategory('${id}')">Eliminar</button>
                
        </div>
    
    </div> `;

  });
};



$("#addCategory").addEventListener("click", () => {
  let categories = getDataInLocalStorage("categories");
  categories.push(categoriesInfo());
  saveDataInLocalStorage("categories", categories);
  console.log(categories);
  generateCategoriesItems(getDataInLocalStorage("categories"));
  $("#nameCategory").value = "";
});



//Editar categorías

const categoryEdit = (id) => {
  cleanCategoriesForm();
  showEditCategoryWindow();
  const editedCategory = find("categories", id);
  $("#editCategoryInput").value = editedCategory.nameCategory;

  $("#editCategoryContainer").innerHTML = `<button id="${id}" class=" w-[91px] h-10 text-white border-none ml-2  bg-green-400 rounded-md ml-2" onclick="updateCategory('${id}')">Editar</button>`;
};


const newCategoryData = (id) => {
  return {
    id: id,
    nameCategory: $("#editCategoryInput").value,
  };
};


const updateCategory = (id) => {
  const newCategory = getDataInLocalStorage("categories");
  const updatedCategory = newCategory.map((category) => {
    if (category.id === id) {
      return newCategoryData(id);
    }
    return category;
  });

  saveDataInLocalStorage("categories", updatedCategory);

  cleanEditCategoryWindow();
  showCategoriesForm();
  generateCategoriesItems();
};


/*********************************************************/

// Remover categoría

const removeCategory = (id) =>{
    let categories = getDataInLocalStorage("categories")
   
    categories = categories.filter((category) => category.id !== id);
    
    saveDataInLocalStorage("categories", categories)
    
}

  
const deleteCategory = (id) => {
  removeCategory(id)
  return generateCategoriesItems()
}

/*********************************************************/


//CANCELAR categoría en edición

$("#cancelCategoryInEdition").addEventListener("click", ()=>{
    showCategoriesForm()
    cleanEditCategoryWindow()
})

/*********************************************************/

$("#navBalance").addEventListener("click", () => {
  if (localStorage.getItem("operations")) {
    showAside();
    showDoneOperations();
    generateTableOperations();
    cleanCategoriesForm();
    cleanNewOperationForm();
   // categoriesSelectInput($("#selectCategoryFilters"))
    //falta agregar mas dom
  }
});



// date - fecha y hora
const inputDate = $("#date")
//se ejecuta en el formulario nEW oPERATION FORM
const todayDate = () =>{
    let newDate = new Date ()  
    let month =  newDate.getMonth() + 1
    let day = newDate.getDate(); //obteniendo dia
    let year = newDate.getFullYear(); 
    if(day<10){
    day='0'+day; }//agrega cero si el menor de 10
    if(month<10){
    month='0'+month} 
    return inputDate.value= year + "-" + month + "-" + day
}


//Dar vuelta la fecha

const correctDate = (date) =>{
        let formatDate = date.split("-").reverse().join("-")   
        return formatDate
}


/* seteando al primer dia del mes */

window.onload = ()=>{
    const inputFiltersDate = $("#filtersDate")
    let newDate = new Date ()  
    
    let month =  newDate.getMonth() + 1
    let day = 1; //obteniendo dia
    let year = newDate.getFullYear(); 
    if(day<10){
    day='0'+day; }//agrega cero si el menor de 10
    if(month<10){
    month='0'+month} 
    inputFiltersDate.value= year + "-" + month + "-" + day
}

/***********************************************************/
const divGastos = $("#gastos")
// const balance = () =>{
// // getDataInLocalStorage(operations)
// // let arrayAmounts = []
// // for (const operation of operations){
// //     let amounts = parseInt(operation.amount)
// //     // console.log(amounts)
// //     arrayAmounts.push(amounts)
// //     // console.log(arrayAmounts
// // }
// const res = arrayAmounts.reduce((acc,item)=>{
//     return acc = acc +item
//  })
// return res
// }
// divGastos.innerText = 6

const balance = ()=>{
    let operations = getDataInLocalStorage('operations')
    
    let arrayAmountsBills = []
    
     for ( const operation of operations){
        if(operation.type === "Gasto"){
           let changeToNumber = parseInt(operation.amount)
           arrayAmountsBills.push(changeToNumber) 
           let totalBills = arrayAmountsBills.reduce((total,bills)=> total + bills) 
        } if(operation.type === "Ganancia"){ 
            arrayAmountsGananancias.push (amounts)
            const resGanancias = arrayAmountsGastos.reduce((acc,item)=>{
                return acc = acc +item
             }) 
             return resGanancias 
        }
     }
     console.log(sumaTotal)

}


// window.onload = () => {
//   const inputDate = $("#date");
//   let date = new Date();
//   let month = date.getMonth() + 1;
//   let day = date.getDate(); //obteniendo dia
//   let year = date.getFullYear();
//   if (day < 10) {
//     day = "0" + day;
//   } //agrega cero si el menor de 10
//   if (month < 10) {
//     month = "0" + month;
//   }
//   inputDate.value = year + "-" + month + "-" + day;
// };


// /****************************************************/


// const balance = () => {
//   getDataInLocalStorage(operations);
// };
// console.log(($("#gastos").innerText = 6));


/***********************************************************/


$("#icon").addEventListener("click",()=>{
    if (!localStorage.getItem('operations')) {
        showFrontPage()
        showAside()
    } else{
    cleanCategoriesForm()
    cleanEditOperationsForm()
    cleanNewOperationForm()
    cleanFrontPage() 
    showDoneOperations()
    showAside()
    generateTableOperations()
    }
})
/***********************************************************/


//FILTROS


// GASTO, GANANCIA, TODOS

$("#selectType").addEventListener("change", (e) => {

    filterByOptions(e.target.value)
 
});


const filterByOptions = () => {
  const type = $("#selectType").value

  if(type === "Todos"){
    generateTableOperations()
    return getDataInLocalStorage("operations")
  }else{

    const localS = getDataInLocalStorage("operations");
  
    const filteredLocalS = localS.filter((operation) => operation.type === type);

    generateTableOperations(filteredLocalS);

    return filteredLocalS
  }

     
};


// Función que muestra la tabla según el filtro aplicado




/************************************************************************/

//FILTRO POR CATEGORÍAS

$("#selectCategoryFilters").addEventListener("change", (e) => {

    const optionsFiltered = filterByOptions();
    const categoriesFiltered = filterByCategories(e.target.value, optionsFiltered); 

    generateTableOperations(categoriesFiltered)
     
});


const filterByCategories = (selectedCategory, operations) => {

    const filteredLocalS = operations.filter((operation) => operation.selectedCategory === selectedCategory);

    return filteredLocalS
  
    //generateTableOperations(filteredLocalS);
    
};




  








if (!localStorage.getItem("operations")) {
    localStorage.setItem("operations", JSON.stringify([]));

   
} else {
    cleanFrontPage();
    showDoneOperations();
    generateTableOperations();
    
}

