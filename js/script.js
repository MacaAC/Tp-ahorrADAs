
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


let filteredOperations= []

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
        date,

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

        $("#table").innerHTML += `<div class="flex flex-row justify-between">
        
        <div class="mx-2 text-[80%] md:text-base">
          <div class="font-bold text-center">${description}</div>
        </div>

        <div class="ml-6 text-[50%] leading-5 md:text-[70%]">
          <div class="font-bold text-center">${selectedCategory}</div>
        </div>

        <div class="pl-4 text-[50%] leading-5 md:text-[70%]">
          <div class="text-center">${date}</div>
        </div>

        <div class="pl-4 text-[70%] leading-5 md:text-[70%] text-${className}">
          <div class="text-center">${operator}${amount}</div>
        </div>
        
        <div class="pl-4 text-[50%] leading-5 md:text-[70%]">
        <button class="mr-4 btnEditOperation" data-id="${id}" onclick="operationEdit(${id})"><i class="fa-sharp fa-solid fa-pen"></i></button><button class="mr-4 btnDeleteOperation" data-id="${id}" onclick="deleteOperation('${id}')"><i class="fa-sharp fa-solid fa-trash"></i></button>
        </div>`

    });

};


//Añadir las operaciones a la tabla, generar la tabla con las mismas, DOM que muestra la tabla

$("#addOperation").addEventListener("click", () => {

  let operations = getDataInLocalStorage("operations");
  operations.push(operationsInfo());
  saveDataInLocalStorage("operations", operations);

  show($("#container"))
  show($("#whiteBox"))

  // generateTableOperations();
  filter()
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
  categoriesSelectInput($("#editSelectedCategory"))
  clean($("#doneOperations"))
  clean($("#aside"))
  clean($("#whiteBox"))

  const editedOperation = find("operations", id);

  $("#editDescription").value = editedOperation.description;
  $("#editAmount").value = editedOperation.amount;
  $("#editType").value = editedOperation.type;
  $("#editSelectedCategory").value = editedOperation.selectedCategory;
  $("#editDate").value = editedOperation.date;



  $("#editContainer").innerHTML = `<button id="edit" data-id="${id}" class=" w-[91px] h-10 text-white border-none ml-2  bg-green-400 rounded-md ml-2" onclick="updateOperation(${id})" >Editar</button>`;
};

//funcion que edita la operación por el usuario


const newOperationData = (id) => {
  let categories = getDataInLocalStorage("categories")
  let categoryIds
  for (const category of categories){
    if ( $("#editSelectedCategory").value == category.nameCategory){
          categoryIds = category.id//preguntar a Manu
    }
  }
  return {
    id: id,
    description: $("#editDescription").value,
    amount: parseInt($("#editAmount").value),
    type: $("#editType").value,
    selectedCategory: $("#editSelectedCategory").value,
    date: $("#editDate").value,
    categoryId : categoryIds
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

  filter()
};


/*------------------------------------------------------------------*/

//Remover operación, delete

const removeOperation = (id) => {
  let operations = getDataInLocalStorage("operations");

  operations = operations.filter((operation) => operation.id !== id);
  saveDataInLocalStorage("operations", operations);
  return operations;
};

///DOM, EVENTO DELETE

const deleteOperation = (id) => {
  id = parseInt(id);

  removeOperation(id);
  filter();

  if(getDataInLocalStorage('operations').length === 0){
    show($("#frontPage"))
    clean($("#doneOperations"))
  }
  printTotalProfit()  
  printTotalExpenses()
  printTotal()

};

/*******************************************************************/

//CANCELAR operación a editar DOM

$("#cancelEditOperation").addEventListener("click", ()=>{
  clean($("#editOperationsForm"))
  show($("#doneOperations"))
  show($("#whiteBox"));
  showAside()
  filter()
})

//CANCELAR en formulario de nueva operación

$("#cancelNewOp").addEventListener("click", () =>{

  if (getDataInLocalStorage('operations').length === 0){
    clean($("#formNewOperation"))
    show($("#whiteBox"))
    show($("#frontPage"))
    showAside()
    
  }else{
    clean($("#formNewOperation"))
    show($("#container"))
    show($("#doneOperations"))
   
    filter()
  }

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
   
  clean($("#editOperationsForm"))
  clean( $("#frontPage"));
  clean($("#doneOperations"));
  clean($("#aside"));
  
  generateCategoriesItems();
  clean( $("#editCategoryWindow"));
  clean($("#whiteBox"))
  clean($("#reportsSection"))
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

  if(idInput === $("#selectCategoryFilters")){

    idInput.innerHTML = `<option id="allCategories">Todas</option>`
    
  }else{
    idInput.innerHTML = ""
  }

  for (const category of categories) {
    const {id, nameCategory} = category
    idInput.innerHTML += `<option value="${nameCategory}">${nameCategory}</option>`

  }
}


window.addEventListener('load', () => {
  setFirstDayOfMonth()
  categoriesSelectInput($("#selectCategoryFilters"))
  // setTimeout(() => filter(), 1000)
  filter()
  
}) 

const getActiveFilters = () => {
  const selectedType = $("#selectType").value
  const selectedCategory = $("#selectCategoryFilters").value
  const selectedDate = $("#filtersDate").value

  return {type: selectedType, category: selectedCategory, date: selectedDate}
}

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
  if (localStorage.getItem("operations").length === 0){
    showAside();
    show($("#whiteBox"))
    show($("#frontPage"))
    clean($("#categoriesForm"));
    clean($("#formNewOperation"));
    clean($("#reportsSection"))
    clean($("#doneOperations"))
    

  }else{
    showAside();
    show($("#whiteBox"))
    show($("#doneOperations"));
    clean($("#categoriesForm"));
    clean($("#formNewOperation"));
    clean($("#reportsSection"))
    
    filter()
  }
   

  
});


// date - fecha y hora

const inputDate = $("#date")

//se ejecuta en el formulario de nueva operación

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

setFirstDayOfMonth = () => {
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
  let totalProfit = 0

  for (const operation of operations){
    if(operation.type === "Ganancia"){
        let amountToNumber = parseInt(operation.amount)
        arrayProfitAmounts.push(amountToNumber)
        totalProfit = arrayProfitAmounts.reduce((total,profitAmounts)=> total + profitAmounts)
      }
  }

  return totalProfit
}
 

const printTotalProfit = ()=>{
return divProfits.innerText = earningBalance()
}

//------------------balance de gastos

let divExpenses = $("#divExpenses")

const expensesBalance = () =>{
  let operations = getDataInLocalStorage('operations')
  let arrayExpensesAmounts = []
  let totalExpenses =0

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
 return divExpenses.innerText = expensesBalance()
}

//---------------------balance total

const totalBalance = (a, b) => parseInt(a) - parseInt(b)

const printTotal = ()=> {
  return  $("#divTotal").innerText = totalBalance(earningBalance(),expensesBalance())
}


//****************************************************/


$("#icon").addEventListener("click",()=>{

  if (localStorage.getItem('operations').length === 0){
    show($("#whiteBox"))
    showAside()
    show($("#frontPage"))
    clean($("#doneOperations"))
    
  }else{
    clean($("#categoriesForm"))
    clean($("#editOperationsForm"))
    clean($("#formNewOperation"))
    clean($("#reportsSection"))
    clean( $("#frontPage"))
    show($("#doneOperations"))
    showAside()
    show($("#whiteBox"))


    filter()

  }

});

/***********************************************************/

//FILTROS

const filter = () => {
  filteredOperations = getDataInLocalStorage("operations");
  filterByOptions()
  filterByCategories()
  filterByDate()

  sort()
  generateTableOperations(filteredOperations)
}

// sort() => {
  // se fija el valor en el dom (input)
  // llama a la funcion de filtro correspondiente
  // actualiza la variable global (filteredOperations = sortFunction())
// }


//refactorizar funciones de ordeBy y funcion sort
const sort= () => {
  const orderBy = $("#orderBy").value
 
  if(orderBy === "A/Z" ){
    orderOperationsAz()
  }
  if(orderBy === "Z/A"){
    orderOperationsZa()
  }
  if(orderBy === "Mayor monto" || "Menor monto"){
    sortByLargerAndLowerAmount()
  }
  else{
    orderByMostAndLeastRecent()

  }
   
}
 
$("#orderBy").addEventListener("change", () => filter());


// GASTO, GANANCIA, TODOS

$("#selectType").addEventListener("change", () => filter());


const filterByOptions = () => {
  const type = $("#selectType").value
  if(type !== "Todos"){
    filteredOperations = filteredOperations.filter((operation) => operation.type === type);
  }
  return filteredOperations
};

/************************************************************************/

//FILTRO POR CATEGORÍAS

$("#selectCategoryFilters").addEventListener("change", () => filter());


const filterByCategories = () => {
  const selectedCategory = $("#selectCategoryFilters").value
  if(selectedCategory !== "Todas"){
    filteredOperations = filteredOperations.filter((operation) => operation.selectedCategory === selectedCategory);
  }
  return filteredOperations
};

//FILTRO POR FECHA DESDE


const filterByDate = () => {

 const operations = filteredOperations

 let dates = $("#filtersDate").value.split("-")
 let dateSince = new Date (dates)
 
  operations.map((operation)=>{

    let dateSplitted = operation.date.split("-")
    operation.date = new Date(dateSplitted)
   
    return operation

  })


  let operationsFilteredByDate = operations.filter((dateOp) => {
    return dateOp.date >= dateSince
  })

  operationsFilteredByDate.map((opTable)=> {

    let dateWithDash = `${opTable.date.getDate()}-${opTable.date.getMonth() + 1}-${opTable.date.getFullYear()}`

    opTable.date = dateWithDash
    return opTable


  })

  return filteredOperations = operationsFilteredByDate
}

$("#filtersDate").addEventListener("change", ()=> filter())

// FILTRO POR A/Z
 
const orderOperationsAz = () => {
  let sortAz = filteredOperations

  sortAz.sort((a, b) => {
    if (a.description.toLowerCase() < b.description.toLowerCase()) {
      return -1
    }
    if (a.description.toLowerCase() > b.description.toLowerCase()) {
      return 1
    }
    return 0
  })

  return sortAz = filteredOperations
}




// FILTRO POR Z/A

const orderOperationsZa = () => {
  let sortZa = filteredOperations
  sortZa.sort((a, b) => {
    if (a.description.toLowerCase() < b.description.toLowerCase()) {
      return 1
    }
    if (a.description.toLowerCase() > b.description.toLowerCase()) {
      return -1
    }
    return 0
  })

  return sortZa = filteredOperations
}

// FILTRO MENOR MONTO

const sortByLargerAndLowerAmount = () =>{
  let amount = filteredOperations

  if($("#orderBy").value === "Mayor monto"){
  
    amount.sort((a, b) => {
      return b.amount - a.amount
    })
  }
  if($("#orderBy").value === "Menor monto"){

    amount.sort((a, b) => {
      return a.amount - b.amount
    })
  }

  return filteredOperations = amount 
}

// const sortByLowerAmount = () =>{
//   let minorAmount = filteredOperations
//   minorAmount.sort((a, b) => {
//     return a.amount - b.amount
//   })

//   return filteredOperations = minorAmount
// }

// ORDENAR POR MAS RECIENTE

const orderByMostAndLeastRecent = () => {

  let byOperationDate = filteredOperations
  
  byOperationDate.map((operation)=>{

    let dateSplitted = operation.date.split("-").reverse()
   
    operation.date = new Date(dateSplitted)
   
    return operation
  })

  if($("#orderBy").value === "Más reciente"){
    byOperationDate.sort((a, b) => b.date - a.date)
  }
  if($("#orderBy").value === "Menos reciente"){
    byOperationDate.sort((a, b) => a.date - b.date)
  }
   

  byOperationDate.map((operation)=> {

    let dateWithDash = `${operation.date.getDate()}-${operation.date.getMonth() + 1}-${operation.date.getFullYear()}`

    operation.date = dateWithDash
    
    return operation


  })

  return console.log(byOperationDate = filteredOperations) 

}


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

  printTotalProfit()
  printTotalExpenses()
  printTotal()
}


//--------------------------------------REPORTES------------------

//Categoria con mayor ganancia


let categories = getDataInLocalStorage("categories")
operations = getDataInLocalStorage("operations")

let arrayAmounts = []


const createObjForCat =(id,profitOrExpense)=>{
  let nameCat 
  let catObj = {
  }

  for(const category of categories){
    arrayAmounts = []
    for(const operation of operations){
      if (category.id == operation.categoryId && operation.type==profitOrExpense &&category.id==id){
        arrayAmounts.push(operation.amount)
        var categoryTotalvar = arrayAmounts.reduce((acc,items) => {return acc = acc + items;})
        nameCat =category.nameCategory
      }
  }
  }
  catObj["categoryName"]= nameCat,
  catObj["categoryTotal"]= categoryTotalvar
  return catObj

} //me devuelve un objeto por cada categoria (con nombr3e y total por cat)

let categoryAndTotalsArray = []
 const pushObjCatAndTotals = (profitOrExpense)=>{
  for(const category of categories){
    createObjForCat(category.id,profitOrExpense)
  if (createObjForCat(category.id,profitOrExpense).categoryName != undefined){
    categoryAndTotalsArray.push(createObjForCat(category.id,profitOrExpense))
  }
 }
 return categoryAndTotalsArray 
} //me retorna un array con categorias y totales por categoria

let objAmounts =[]
const highestProfitOrSpentCat =(profitOrExpense)=>{
for(const obj of pushObjCatAndTotals(profitOrExpense)){
  objAmounts.push(obj.categoryTotal)
}
 let highestValue = Math.max.apply(null,objAmounts)
 console.log(highestValue)
 for(const obj of pushObjCatAndTotals(profitOrExpense)){
  if(obj.categoryTotal==highestValue){
    return obj
  }
}
}
//categoria con mayor ganancia
let highestEarningCategory = highestProfitOrSpentCat("Ganancia")
//categoria con mayor gasto
let highestSpendingCategory = highestProfitOrSpentCat("Gasto")


//------------------------------------------------------------------------------------------
//categoria con mayor balance


const createObjBalance = (id) =>{
  let profitAmountsArr=[]
  let spendingAmountsArr=[]
  let balanceObj = {
    categoryName: "",
    categoryTotalSpents: 0,
    categoryTotalProfits: 0

  }
  let categoryName
  for (const category of categories){

      for(const operation of operations){

        if (category.id == operation.categoryId && operation.type== "Ganancia" &&category.id==id){
          profitAmountsArr.push(operation.amount)
          var categoryTotalProfits = profitAmountsArr.reduce((acc,items) => {return acc = acc + items;})
          categoryName =category.nameCategory
        }

        if (category.id == operation.categoryId && operation.type== "Gasto" &&category.id==id){
          spendingAmountsArr.push(operation.amount)
          var categoryTotalSpents = spendingAmountsArr.reduce((acc,items) => {return acc = acc + items;})
          categoryName =category.nameCategory

        }
      }

    }
    balanceObj.categoryName= categoryName

    if(categoryTotalSpents==undefined){
      balanceObj.categoryTotalSpents= 0
    }else{
      balanceObj.categoryTotalSpents= categoryTotalSpents
    }

    if(categoryTotalProfits==undefined){
    balanceObj.categoryTotalProfits= 0
    }else{
      balanceObj.categoryTotalProfits= categoryTotalProfits
    }

    return balanceObj


  }

const objToBalanceFunction =()=>{
  let objToBalanceArr =[]
for (const category of categories){
 if (createObjBalance(category.id).categoryName!=undefined){
  objToBalanceArr.push(createObjBalance(category.id))
 }
}
//console.log(objToBalanceArr)
return objToBalanceArr
}

const balancesObjects =()=>{

  let balance
  let arrayBalanceResult =[];
 

  for (const obj of objToBalanceFunction()){
    balance = obj.categoryTotalProfits - obj.categoryTotalSpents

    let balanceObj = {
      categoryName: "",
      balanceResult: 0
    }
   
    balanceObj.categoryName = obj.categoryName

    balanceObj.balanceResult= balance
  
    arrayBalanceResult.push(balanceObj)
  
  }

  return arrayBalanceResult
}
const highestBalanceCategory = ()=>{
  let catConMayorBalance=Math.max.apply(null,balancesObjects().map(x=>x.balanceResult))

  for(obj of balancesObjects()){
    if(obj.balanceResult==catConMayorBalance){
      return obj
    }
  }
}

//categoria con mayor balance : me devuelve un objeto con la categoria con mayor balance y el balance de la Misma

let highestBalanceCategoryLet = highestBalanceCategory()

 //---------------------------totales por categoria
categories = getDataInLocalStorage("categories")
operations= getDataInLocalStorage("operations")

const createObjTotalByCategory =()=>{
let array =[]
  for (category of categories){
    for(const operation of operations){
      if(operation.categoryId==category.id){
 let ganancias = createObjForCat(category.id,"Ganancia").categoryTotal

 let gastos =createObjForCat(category.id,"Gasto").categoryTotal

       let totalByCatObj={
        id:category.id,
        name: "",
        profits: 0,
        spents: 0,
        balance: 0
      }

      totalByCatObj.name=category.nameCategory
      ganancias == undefined ?  totalByCatObj.profits = 0 : totalByCatObj.profits = ganancias
      gastos == undefined ? totalByCatObj.spents = 0 : totalByCatObj.spents = gastos

      let balance = totalByCatObj.profits  - totalByCatObj.spents
      totalByCatObj.balance = balance

      array.push(totalByCatObj)


      }

    }
  }
  return  array
}


//createObjTotalByCategory() me devuelve un array con objetos que tienen los totales por categoria. el problema es que hay objetos duplicados. debo encontrrar la forma de eliminarlos, y falta pintarlos en la tabla.

//-------------------------------------------
//----------------totales por mes ------------


for (const operation of operations){

  let mes = new Date(operation.date).getMonth()+1

  let año = new Date(operation.date).getFullYear()

  let monthYear = `${mes}-${año} `

  operation["monthYear"] = monthYear

}


saveDataInLocalStorage("operations", operations)

operations = getDataInLocalStorage("operations")
let arrayMonthsYear = []

for(const operation of operations){
  const {monthYear} = operation
  !arrayMonthsYear.includes(monthYear) && arrayMonthsYear.push(monthYear)
}

operations = getDataInLocalStorage("operations")
let arrayObjectTotalByMonths = []
let objectTotalByMonths
const generateObjectTotalByMonths = () =>{
  for (const monthYear of arrayMonthsYear){
    objectTotalByMonths = {
    profits: 0,
    spents: 0,
    balance:0
   }
   objectTotalByMonths["monthYear"] = monthYear
  arrayObjectTotalByMonths.push(objectTotalByMonths)
     for (const operation of operations){
      
      if(monthYear == operation.monthYear && operation.type == "Ganancia"){
        objectTotalByMonths.profits = objectTotalByMonths.profits +  operation.amount
      }
      if(monthYear == operation.monthYear && operation.type == "Gasto"){
        objectTotalByMonths.spents = objectTotalByMonths.spents +  operation.amount
      }
      objectTotalByMonths.balance = objectTotalByMonths.profits - objectTotalByMonths.spents 
}
    }
return arrayObjectTotalByMonths
}
//mes con mayor ganancia

const highestProfitMonth = ()=>{
const maxMonthProfit = generateObjectTotalByMonths().reduce((acc, i)=>(i.profits > acc.profits ? i : acc))
return maxMonthProfit
}
//mes con mayor gasto

const highestSpendingMonth = ()=>{
  const maxMonthSpents = generateObjectTotalByMonths().reduce((acc, i)=>(i.spents > acc.spents ? i : acc))
  return maxMonthSpents

}
//-------------

const printReports =()=>{

  $("#summary1").innerHTML= `<span> ${highestEarningCategory.categoryName} </span>`
  $("#total1").innerHTML= `<span> + $ ${highestEarningCategory.categoryTotal} </span>`

  $("#summary2").innerHTML= `<span> ${highestSpendingCategory.categoryName} </span>`
  $("#total2").innerHTML= `<span> - $ ${highestSpendingCategory.categoryTotal} </span>`

  $("#summary3").innerHTML= `<span> ${highestBalanceCategoryLet.categoryName} </span>`
  $("#total3").innerHTML= `<span>  $ ${highestBalanceCategoryLet.balanceResult} </span>`

  $("#summary4").innerHTML= `<span> ${highestProfitMonth().monthYear} </span>`
  $("#total4").innerHTML= `<span> + $ ${highestProfitMonth().profits} </span>`

  $("#summary5").innerHTML= `<span> ${highestSpendingMonth().monthYear} </span>`
  $("#total5").innerHTML= `<span> - $ ${highestSpendingMonth().spents} </span>`
}



const generateCategoryTotalsTable = ()=>{
  $("#rowTotalsByCat").innerHTML = "";

for(objCatTotals of createObjTotalByCategory()){
  const{name,profits,spents,balance}=objCatTotals

  $("#rowTotalsByCat").innerHTML += `
<div class="flex flex-row justify-center">
  <div class="my-5 mx-12 text-lg">
      <div class="font-bold flex justify-start">${name}</div>
  </div>
  <div class="my-5 mx-12 text-lg font-lg ">
      <div class="font-bold flex justify-end text-green-400" > +$ ${profits}</div>
  </div>
  <div class="my-5 mx-12 text-lg font-lg ">
      <div class="font-bold flex justify-end text-red-400"> -$ ${spents}</div>
  </div>
  <div class="my-5 mx-12 text-lg font-lg ">
      <div class="font-bold flex justify-end"> $ ${balance}</div>
  </div>
</div>
  `;
}

}


const generateMonthTotalsTable = ()=>{
  $("#rowTotalsByMonth").innerHTML = "";

for(objMonthTotals of generateObjectTotalByMonths()){
  const{monthYear,profits,spents,balance}= objMonthTotals

  $("#rowTotalsByMonth").innerHTML += `
<div class="flex flex-row justify-center">
  <div class="my-5 mx-12 text-lg">
      <div class="font-bold flex justify-start bg-green-400">${monthYear}</div>
  </div>
  <div class="my-5 mx-12 text-lg font-lg ">
      <div class="font-bold flex justify-end text-green-400" > +$ ${profits}</div>
  </div>
  <div class="my-5 mx-12 text-lg font-lg ">
      <div class="font-bold flex justify-end text-red-400"> -$ ${spents}</div>
  </div>
  <div class="my-5 mx-12 text-lg font-lg ">
      <div class="font-bold flex justify-end"> $ ${balance}</div>
  </div>
</div>
  `;
}

}


$("#navReports").addEventListener("click", ()=>{
    
    show($("#reportsSection"))
    show($("#reportsSection"))

    clean($("#container"))
    clean($("#aside"))
    clean($("#doneOperations"))
    clean($("#categoriesForm"))
    clean($("#frontPage"))
  
    printReports()
    generateCategoryTotalsTable()
    generateMonthTotalsTable()
    
})
  

//-------funcion navbar responsive

$("#btnMenu").addEventListener('click', () => $("#menu").classList.toggle('hidden'))

