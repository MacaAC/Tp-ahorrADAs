//NUEVO
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// FUNCIONES REUTILIZABLES

// Funciones de clean y show atributos

const clean = (idHtml) => idHtml.classList.add("hidden");
const show = (idHtml) => idHtml.classList.remove("hidden");

const showAside = () =>{ 
  categoriesSelectInput($("#selectCategoryFilters"))
  show($("#aside"))
};

const showNewOperationForm = () => {
  show($("#formNewOperation"))
  inputDate.value = todayDate()
  categoriesSelectInput($("#selectCategory"))

};

/*******************************************************/

const getDataInLocalStorage = (key) => JSON.parse(localStorage.getItem(key));
const saveDataInLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));


// AGREGAR OPERACIONES A UN ARRAY DE OBJETOS

const operationsInfo = () => {
    const operations = getDataInLocalStorage("operations")
    const categories = getDataInLocalStorage("categories")
    const description = $("#description").value
    const amount = parseInt($("#amount").value)
    const type = $("#type").value
    //const categoryName = $("#selectCategory").value ahora categoryName no existe
    const selectedCategory = $("#selectCategory").value



  for (const category of categories){
    if ( $("#selectCategory").value == category.nameCategory){
        var categoryId = category.id//preguntar a Manu
    }
  }

  var date = $("#date").value//preguntar a Manu
  let id = parseInt(operations.length + 1)
  

  for (const operation of operations){
    if(operation.id==id){
      id = id + 1
    }
  }

    return {
        id,
        description,
        amount,
        type,
        categoryId,
        selectedCategory,
        date
    }
}

/**************************************************/

const generateTableOperations = (operations) => {
   
  let maybeFilteredOperations = getDataInLocalStorage("operations");

  if (operations) {
    maybeFilteredOperations = operations;
  }
      
  $("#table").innerHTML = "";

    maybeFilteredOperations.map((operation) => {
        const { id, description, selectedCategory, date, amount, type} = operation;
        const className = type === "Gasto" ? "red-500" : "green-500";
        const operator = type === "Gasto" ? "-" : "+";

    var formatedDate = correctDate(date)//ver con Manu

    $("#table").innerHTML += `
            
            <tr>
                <td class="pl-0 pr-10 mt-4 pt-0 text-lg font-bold capitalize">${description}</td>
                <td class="mt-0 pt-0 pl-10 text-xs ">${selectedCategory}</td>
                <td class="mt-0 pt-0 pl-10 text-sm">${formatedDate}</td>
                <td class="mt-0 pt-0 pl-12 text-lg text-${className} font-bold">${operator}${amount}</td>
                <td class="pl-8 mt-0 pt-0 text-xs"><button class="mr-4 btnEditOperation" data-id="${id}" onclick="operationEdit(${id})">Editar</button><button class="mr-4 btnDeleteOperation" data-id="${id}" onclick="deleteOperation('${id}')">Eliminar</button></td>
            </tr>
             
        `;
  });

};


//Añadir las operaciones a la tabla, generar la tabla con las mismas, DOM que muestra la tabla

$("#addOperation").addEventListener("click", () => {

  let operations = getDataInLocalStorage("operations");
  operations.push(operationsInfo());
  saveDataInLocalStorage("operations", operations);

  show($("#container"))
  show($("#whiteBox"))

  generateTableOperations();
  printTotalProfit()  
  printTotalExpenses()
  printTotal()

  clean($("#formNewOperation"));
  show($("#doneOperations"));
  showAside();

});


//Evento añadir operaciones desde la tabla


$("#addOperationTable").addEventListener("click", () => {
  showNewOperationForm();
  clean($("#doneOperations"));
  clean($("#container"))

  $("#description").value = ""
  $("#amount").value = ""
});


//Funcion que retorna un id especifico, es decir, una operacion o categoria especifica
//funciona
const find = (objetsType, id) => {
  let results = getDataInLocalStorage(objetsType);
  console.log(results);
  return results.find((result) => result.id === id);
};


// Evento de editar operación, precarga los datos y botón dinámico

const operationEdit = (id) => {
  
  show($("#editOperationsForm"))
  clean($("#doneOperations"))
  clean($("#aside"))
  clean($("#whiteBox"))

  const editedOperation = find("operations", id);
  console.log(editedOperation);
  $("#editDescription").value = editedOperation.description;
  $("#editAmount").value = editedOperation.amount;
  $("#editType").value = editedOperation.type;
  $("#editSelectedCategory").value = editedOperation.selectedCategory;
  $("#editDate").value = editedOperation.date;
  
  

  $("#editContainer").innerHTML = `<button id="edit" data-id="${id}" class=" w-[91px] h-10 text-white border-none ml-2  bg-green-400 rounded-md ml-2" onclick="updateOperation(${id})" >Editar</button>`;
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
    //categoryId : 
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
  clean($("#editOperationsForm"));
  show($("#doneOperations"));
  showAside();
  show($("#whiteBox"))
  
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

///DOM, EVENTO DELETE

const deleteOperation = (id) => {
  id = parseInt(id);

  removeOperation(id);
  filterByOptions();

  if(getDataInLocalStorage('operations').length === 0){
    show($("#frontPage"))
    clean($("#doneOperations"))
  }

};

/*******************************************************************/

//CANCELAR operación a editar DOM

$("#cancelEditOperation").addEventListener("click", ()=>{
  clean($("#editOperationsForm"))
  show($("#doneOperations"))
  showAside()
})

// evento para hacer desaparecer la portada y aparece el formulario de nueva op

$("#btnNewOperations").addEventListener("click", () => {
  clean($("#aside"));
  clean( $("#frontPage"));
  showNewOperationForm();
  clean($("#whiteBox"))
});


/*****************************************/

//ver tabla de categorias

$("#navCategory").addEventListener("click", () => {
  show($("#categoriesForm"));
  clean( $("#frontPage"));
  clean($("#doneOperations"));
  clean($("#aside"));
  generateCategoriesItems();
  clean( $("#editCategoryWindow"));
  clean($("#whiteBox"))
});


if (!localStorage.getItem("categories")){
localStorage.setItem ("categories", JSON.stringify([
    { id: 1,
      nameCategory: "Comida" },

    { id: 2, 
      nameCategory: "Servicios" },

    { id: 3, 
      nameCategory: "Salidas" },

    { id: 4, 
      nameCategory: "Educación" },

    { id: 5,
      nameCategory: "Transporte" },

    { id: 6, 
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
  categoriesSelectInput($("#selectCategoryFilters"))
  const option = document.createElement("option")
  const allText = document.createTextNode("Todas")
  option.appendChild(allText)

  $("#selectCategoryFilters").append(option)}) //preguntar a Ro si acá cierra el evento (?)

//AGREGAR CATEGORIAS A UN ARRAY DE OBJETOS EN LOCAL STORAGE


const categoriesInfo = () => {
  const nameCategory = $("#nameCategory").value;
  let id = getDataInLocalStorage("categories").length + 1;
  let categories = getDataInLocalStorage("categories");

  for (const category of categories){
    if(category.id == id){
      id = id + 1
    }
  }

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

    $("#categoriesItems").innerHTML += `<div class="flex flex-row">
      <div class="flex w-[1300px] mt-8" >
        <span>${nameCategory}</span>
      </div>

      <div class="flex flex-row w-[200px] mt-8">
        <button class="ml-2" id="${id}" onclick="categoryEdit('${id}')">Editar</button>
        <button class="ml-2" id="${id}" onclick="deleteCategory('${id}')">Eliminar</button>
      </div>

    </div>`;

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
  clean($("#categoriesForm"));
  show( $("#editCategoryWindow"));

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

  clean( $("#editCategoryWindow"));
  show($("#categoriesForm"));
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
  id = parseInt(id)
  removeCategory(id)
  return generateCategoriesItems()
}

/*********************************************************/


//CANCELAR categoría en edición DOM

$("#cancelCategoryInEdition").addEventListener("click", ()=>{
  show($("#categoriesForm"))
  clean( $("#editCategoryWindow"))
});

/*********************************************************/

$("#navBalance").addEventListener("click", () => {
  if (localStorage.getItem("operations")) {
    showAside();
    show($("#doneOperations"));

    generateTableOperations();

    clean($("#categoriesForm"));
    clean($("#formNewOperation"));
    show($("#whiteBox"))

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
    day='0'+day
  }
  if(month<10){
  month='0'+month
  }
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
    day='0'+day
  }//agrega cero si el menor de 10
  if(month<10){
  month='0'+month
  }

  inputFiltersDate.value= year + "-" + month + "-" + day

}

//--------------------balance de ganancias

let divProfits = $("#divProfits")
const earningBalance = () =>{
  let operations = getDataInLocalStorage('operations')
  let arrayProfitAmounts = []
  let totalProfit

  for (const operation of operations){
    if(operation.type === "Ganancia"){
        let amountToNumber = parseInt(operation.amount)
        arrayProfitAmounts.push(amountToNumber)
        totalProfit = arrayProfitAmounts.reduce((total,profitAmounts)=> total + profitAmounts)
      }
  }
  return totalProfit
}

//falta resolver
const printTotalProfit = ()=>{
  //let operations = getDataInLocalStorage('operations')
 // getDataInLocalStorage("operations") ? divProfits.innerText = "0" :
  divProfits.innerText = earningBalance()
}

//------------------balance de gastos

let divExpenses = $("#divExpenses")

const expensesBalance = () =>{
  let operations = getDataInLocalStorage('operations')
  let arrayExpensesAmounts = []
  let totalExpenses

  for (const operation of operations){
    if(operation.type === "Gasto"){
      let amountToNumber = parseInt(operation.amount)
      arrayExpensesAmounts.push(amountToNumber)
      totalExpenses = arrayExpensesAmounts.reduce((total,expensesAmounts)=> total + expensesAmounts)
    }
  }
  return totalExpenses

}

const printTotalExpenses = ()=>{
  //let operations = getDataInLocalStorage('operations')
  //getDataInLocalStorage("operations") ? divExpenses.innerText = "0" :
  divExpenses.innerText = expensesBalance()
}

//---------------------balance total

const totalBalance = (a, b) => a - b

const printTotal = ()=> {
  // let operations = getDataInLocalStorage('operations')
  // getDataInLocalStorage("operations") ? $("#divTotal").innerText = "0" :
$("#divTotal").innerText = totalBalance(earningBalance(),expensesBalance())
}


//****************************************************/


$("#icon").addEventListener("click",()=>{

  if (!localStorage.getItem('operations')){
    show($("#whiteBox"))
    showAside()
  }else{
    clean($("#categoriesForm"))
    clean($("#editOperationsForm"))
    clean($("#formNewOperation"))
    clean( $("#frontPage")) 
    show($("#doneOperations"))
    showAside()

    generateTableOperations()

    show($("#whiteBox"))
  }

});

/***********************************************************/

//FILTROS

// GASTO, GANANCIA, TODOS

$("#selectType").addEventListener("change", (e) => filterByOptions(e.target.value));


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

};

//FILTRO POR FECHA DESDE

// var f1 = new Date(2015, 11, 31); //31 de diciembre de 2015
// var f2 = new Date(2014, 10, 30); //30 de noviembre de 2014
    
// if(f1 > f2){
//     console.log("f1 > f2");
// }
// if(f1 < f2){
//     console.log("f1 < f2");
// }

let operationsFilteredByDate = []

const filterSince = (e) => {

 const operations = getDataInLocalStorage('operations')

 const dates = $("#filtersDate").value.split("-")
 const dateSince = new Date (dates)


  operations.map((operation)=>{

    let rocio = operation.date.split("-")

    operation.date = new Date(rocio) 

    return operation

  })


  operationsFilteredByDate = operations.filter((dateOp) => dateOp.date >= dateSince)
    
  operationsFilteredByDate.map((opTable)=> {

    let luka = `${opTable.date.getDate()}-${opTable.date.getMonth() + 1}-${opTable.date.getFullYear()}`
   
    opTable.date = luka
    return opTable


  })
  
  return operationsFilteredByDate
  


}

$("#filtersDate").addEventListener("change", ()=>{
  generateTableOperations(filterSince())    
})


// falta pintar la tabla con estas operaciones y la fecha puesta normal
// (hacer un map de operatonsFilter??) arreglar ese nombre


// let newDate = new Date ()
//   let month =  newDate.getMonth() + 1
//   let day = newDate.getDate(); //obteniendo dia
//   let year = newDate.getFullYear();

// const formatDate2 = (date, symbol) => {
//   const arrayDate = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
//   return arrayDate.join(symbol)
// }


//Methods
// console.log(date.getDay())
// console.log(date.getFullYear())
// console.log(date.getMonth()+1)
// console.log(date.getDate())


// FILTRO POR A/Z

const orderOperationsAz = () => {
const sortAz = getDataInLocalStorage('operations')
//generateTable?? que muestre todas las operaciones
console.log(sortAz.sort((a, b) => {
    if (a.description.toLowerCase() < b.description.toLowerCase()) {
      return -1
    }
    if (a.description.toLowerCase() > b.description.toLowerCase()) {
      return 1
    }
    return 0
  }))
}

// FILTRO POR Z/A

const orderOperationsZa = () => {
  const sortZa = getDataInLocalStorage('operations')

  console.log(sortZa.sort((a, b) => {
    if (a.description.toLowerCase() < b.description.toLowerCase()) {
      return 1
    }
    if (a.description.toLowerCase() > b.description.toLowerCase()) {
      return -1
    }
    return 0
  }))
}

// FILTRO MENOR MONTO

const orderByMajorAmount = () =>{
  const largerAmount = getDataInLocalStorage('operations')
  console.log(largerAmount.sort((a, b) => {
    return b.amount - a.amount
})
  )

}

const orderByMinorAmount = () =>{
  const minorAmount = getDataInLocalStorage('operations')
  console.log(minorAmount.sort((a, b) => {
    return a.amount - b.amount
  }))

}

//$("#orderBy").addEventListener("change", (e) => generateTableOperations(orderByOtherFilters()));


//SE USA (falta terminar)

const orderByOtherFilters = () => {
 const otherFilters = $("#orderBy").value

//  if("A/Z"){
//   orderOperationsAz()
//  }
//  if("Z/A"){
//   orderOperationsZa()
//  }
//  if("Mayor monto"){
//   orderByMajorAmount()
//  }
//  if("Menor monto"){
//   orderByMinorAmount()
//  }
  
  if(otherFilters === "A/Z" ){
    generateTableOperations(orderOperationsAz())
    //orderOperationsAz()
    //y pintala en la tabla?
  }
  if( otherFilters === "Z/A"){
    orderOperationsZa()
  }
  if(otherFilters === "Mayor monto"){
    orderByMajorAmount()
  }
  if(otherFilters === "Menor monto"){
    orderByMinorAmount()
  }

}


//falta meterlo en la tabla

/////////////////////////////////////////////////////////


if (!localStorage.getItem("operations")) {
  localStorage.setItem("operations", JSON.stringify([]));
  show($("#frontPage"))

}
if(getDataInLocalStorage('operations').length === 0){
show($("#frontPage"))

}
else {
  clean($("#frontPage"));
  show($("#doneOperations"));

  generateTableOperations()
   
  printTotalProfit()
  printTotalExpenses()
  printTotal()
}


//--------------------------------------REPORTES------------------

//Funcion que devuelve la CATEGORIA CON MAYOR GANANCIA y Mayor gasto

let categories = getDataInLocalStorage("categories")
let operations = getDataInLocalStorage("operations")
let arrayCategories
let selectedCategoryVar
let selectedCategoryName
let totalArrayEarns = []


const categoriesTotal =(categoryIdPar,gananciaOGasto)=>{
  arrayCategories=[]
  for (const operation of operations){
      let {selectedCategory,amount,type, categoryId}=operation
      amount = parseInt(amount)
      selectedCategoryVar = categoryId
      selectedCategoryName = selectedCategory
      for(const category of categories){
        if(categoryId == category.id && type== gananciaOGasto && category.id == categoryIdPar){
          arrayCategories.push(amount)
          var categoryTotal = arrayCategories.reduce((acc,items) => {return acc = acc + items;})
    }
              }
  }
  return  categoryTotal
 
}


categories.forEach(category=>{
  if(categoriesTotal(category.id, "Ganancia") != undefined){
    totalArrayEarns.push(categoriesTotal(category.id, "Ganancia"))
  }
});

const highestAmountEarn = () =>{
  let highestValue = Math.max.apply(null,totalArrayEarns)
  //me falta darle el if correcto para que me retorne correctamente el nombre de la categoría
  return{
   // selectedCategoryName,
    highestValue
  }
}

//----------categoria con mayor gasto


let totalArraySpents = []

categories.forEach(category=>{
  if(categoriesTotal(category.id, "Gasto") != undefined){
    totalArraySpents.push(categoriesTotal(category.id, "Gasto"))
  }
});

const highestAmountSpents = () =>{

  let highestValue = Math.max.apply(null,totalArraySpents)
  //me falta darle el if correcto para que me retorne correctamente el nombre de la categoría
  return{
   // selectedCategoryName,
    highestValue
  }
}

//-------funcion navbar responsive

$("#btnMenu").addEventListener('click', () => $("#menu").classList.toggle('hidden'))





