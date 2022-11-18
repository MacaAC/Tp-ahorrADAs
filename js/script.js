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
  id = parseInt(id);
  removeOperation(id);
  filterByOptions();
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

//falta resolver--manu
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

//FILTRO POR FECHA

// FILTRO POR A/Z

const orderOperationsAz = () => {
const sortAz = getDataInLocalStorage('operations')

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
    return a.amount - b.amount
})
  )

}

const orderByMinorAmount = () =>{
  const minorAmount = getDataInLocalStorage('operations')
  console.log(minorAmount.sort((a, b) => {
    return b.amount - a.amount
  }))

}

//$("#selectType").addEventListener("change", (e) => filterByOptions(e.target.value));


//SE USA (falta terminar)

const filterByOtherFilters = () => {
  const otherFilters = $("#otherFilters").value

  if(otherFilters === "A/Z" ){
    orderOperationsAz()
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
} else {
  clean( $("#frontPage"));
  show($("#doneOperations"));
  generateTableOperations();
  printTotalProfit()
  printTotalExpenses()
  printTotal()
}


//--------------------------------------REPORTES------------------

//Categoria con mayor ganancia


let categories = getDataInLocalStorage("categories")
let operations = getDataInLocalStorage("operations")

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


//--------------mes con mayor gasto

//1ro filtro por gasto o ganancia

operations = getDataInLocalStorage("operations")

let filteredOperationsByProfit= operations.filter(operation => operation.type == "Ganancia")
let filteredOperationsBySpent= operations.filter(operation => operation.type == "Gasto")


const months = (array)=>{
  let arrayMonths = []

  for(const operation of array){
    const {date}=operation
    !arrayMonths.includes(date.split("-")[1]) && arrayMonths.push(date.split("-")[1])
  }

  return arrayMonths

} //months me retorna un array con todos los meses que tienen operaciones (strings)


let profitMonths = months(filteredOperationsByProfit)
let spentMonth = months(filteredOperationsBySpent)
 //-addingAmounts- que me devuelva la suma de los amounts por mes. o sea que reciba por parametro un mes y el array con operaciones y me devuelva la suma de los amounts de esas operaciones.

const addingAmounts = (month,arrayOp)=>{
  let acc = 0
  let filteredByMonthArray = arrayOp.filter(op=>op.date.split("-")[1] == month)
  let filteredByMonthAmountsArray = filteredByMonthArray.map(op=>op.amount)

  for(amount of filteredByMonthAmountsArray){
    acc += amount
  }
  return acc
}



const createObjByMonth =()=>{
  let arrayReturn = []

  for (let i = 0; i < profitMonths.length; i++) {
    let amount = addingAmounts(profitMonths[i],filteredOperationsByProfit)
    let month = profitMonths[i]

    let obj = {
      month: month,
      amount: amount
    }

    arrayReturn.push(obj)
  }
  return arrayReturn

}
const createObjByMonthSP =()=>{
  let arrayReturn = []

  for (let i = 0; i < spentMonth.length; i++) {
    let amount = addingAmounts(spentMonth[i],filteredOperationsBySpent)
    let month = spentMonth[i]

    let obj = {
      month: month,
      amount: amount
    }

    arrayReturn.push(obj)

  }
  return arrayReturn

}
 //arrayX = createObjByMonth()
 //amountX= arrayX.map((x)=> x.amount)
 //montoMayor =Math.max.apply(null,amountX)
 //arrayGanador = arrayX.filter(x=> x.amount == montoMayor)
 //arrayGanador = arrayX.filter(x=> x.amount == Math.max.apply(null,prueba().map((x)=> x.amount)))

 //Mes con mayor ganancia
 arrayObjMonthHighestProfit = createObjByMonth().filter(x=> x.amount == Math.max.apply(null,createObjByMonth().map((x)=> x.amount)))
//mes con mayor gasto
 arrayObjMonthHighestSpent = createObjByMonthSP().filter(x=> x.amount == Math.max.apply(null,createObjByMonthSP().map((x)=> x.amount)))



 //---------------------------totales por categoria

let suma


let array =[]
//1ro itero por las categorias
categories = getDataInLocalStorage("categories")
operations= getDataInLocalStorage("operations")

const funcion =()=>{
  for (category of categories){
    for(const operation of operations){
      if(operation.categoryId==category.id){
        //entonces guardame la operation.amount en un array al cual dsp le haé un reduce
        array.push(operation.amount)
      }

    }
  }
  console.log(array)
}



//-------funcion navbar responsive

$("#btnMenu").addEventListener('click', () => $("#menu").classList.toggle('hidden'))
