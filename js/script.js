
const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

// funciones de clean y show atributos

const cleanAside = () => $("#aside").classList.add("hidden")
const showAside = () => $("#aside").classList.remove("hidden")
const cleanFrontPage = () => $("#frontPage").classList.add("hidden")
const showNewOperationForm = () =>  $("#formNewOperation").classList.remove("hidden")
const cleanNewOperationForm = () => $("#formNewOperation").classList.add("hidden")
const showDoneOperations = () => $("#doneOperations").classList.remove("hidden")
const cleanDoneOperations = () => $("#doneOperations").classList.add("hidden")
const cleanEditOperationsForm = () => $("#editOperationsForm").classList.remove("hidden")
const showEditOperationsForm = () => $("#editOperationsForm").classList.add("hidden")
const cleanCategoriesForm = () => $("#categoriesForm").classList.remove("hidden")
const showContainer = () => $("#container").classList.remove("hidden")

/*******************************************************/

const getDataInLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key))
}

const saveDataInLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

// AGREGAR OPERACIONES A UN ARRAY DE OBJETOS
const operationsInfo = () => {
    const description = $("#description").value
    const amount = $("#amount").value
    const type = $("#type").value
    const selectedCategory = $("#selectCategory").value
    const date = $("#date").value
    const id = getDataInLocalStorage('operations').length + 1
    return {
        id,
        description,
        amount,
        type,
        selectedCategory,
        date
    }
}



const generateTableOperations = () => {
    $("#table").innerHTML = ""
    console.log(getDataInLocalStorage('operations'))
    getDataInLocalStorage('operations').map(operation => {
        const {id, description, selectedCategory, date, amount, type} = operation
        const className = type === 'Gasto' ? "red-500" : "green-500"
        const operator = type === 'Gasto' ? "-" : "+"
 
        $("#table").innerHTML += `
            
            <tr>
                <td class="pl-0 pr-10 mt-4 pt-0 text-lg font-bold">${description}</td>
                <td class="mt-0 pt-0 pl-10 text-xs ">${selectedCategory}</td>
                <td class="mt-0 pt-0 pl-10 text-sm">${date}</td>
                <td class="mt-0 pt-0 pl-12 text-lg text-${className} font-bold">${operator}${amount}</td>
                <td class="pl-8 mt-0 pt-0 text-xs"><button class="mr-4 btnEditOperation" data-id="${id}" onclick="eventEditOperation(${id})">Editar</button><button class="mr-4 btnDeleteOperation" data-id="${id}" onclick="deleteOperation(${id})">Eliminar</button></td>
            </tr>
             
        `
    })
}

let tr = $("#hola")

/*-----------------------------------------------------------------------------------*/
//Añadir las operaciones a la tabla, tabla de operaciones ya realizadas, que aparezca la tabla

$("#addOperation").addEventListener("click", () => {
    
    let operations = getDataInLocalStorage('operations')              
    operations.push(operationsInfo())
    
    saveDataInLocalStorage('operations', operations) 
    
    generateTableOperations(getDataInLocalStorage('operations'))
    
    cleanNewOperationForm()
    showDoneOperations()
    showAside()
    
})

//Evento añadir operaciones desde la tabla

$("#addOperationTable").addEventListener("click", () => {
    showNewOperationForm()
    cleanDoneOperations()
})


/*------------------------------------------------------------------*/

//Funcion que retorna un id especifico, es decir, una operacion especifica

const findOperation = (id) => {
    let operations = getDataInLocalStorage('operations')
    console.log(operations) 
    return operations.find(operation => operation.id === id)
}


// Evento de editar operación, precarga los datos y edita

const operationEdit = (id) => {
    cleanEditOperationsForm()
    cleanDoneOperations()
    cleanAside()
    const editedOperation = findOperation(id)
    console.log(editedOperation)
    $("#editDescription").value = editedOperation.description
    $("#editAmount").value = editedOperation.amount
    $("#editType").value = editedOperation.type
    $("#editSelectedCategory").value = editedOperation.selectedCategory
    $("#editDate").value =  editedOperation.date                
    $("#editContainer").innerHTML = `<button id="edit" data-id="${id}" class=" w-[91px] h-10 text-white border-none ml-2  bg-green-400 rounded-md ml-2" onclick="updateOperation(${id})" >Editar</button>`   
}


//Funcion que efectivamente edita

const updateOperation = (id) => {
  
    const newOperation = getDataInLocalStorage('operations')
    const updatedOperation = newOperation.map(operation => {
        if(operation.id === id){
            return newOperationData(id)
        }
        return operation

    })


    saveDataInLocalStorage('operations', updatedOperation)
    showEditOperationsForm()
    showDoneOperations()
    showAside()
    generateTableOperations()
}
   
//funcion que edita la operacion por el usuario

const newOperationData = (id) => {
    return {
        id: id,
        description: $("#editDescription").value,
        amount: $("#editAmount").value,
        type: $("#editType").value,
        selectedCategory: $("#editSelectedCategory").value,
        date: $("#editDate").value
    }
}


/*------------------------------------------------------------------*/



//remover operacion, delete

const removeOperation = (id) => {
    let operations = getDataInLocalStorage('operations')
    operations = operations.filter(operation => operation.id !== id)
    saveDataInLocalStorage("operations",operations)
    return operations
}

const deleteOperation = (id) => { 
    return generateTableOperations(removeOperation(id))
}


// evento para hacer desaparecer la portada y aparece el formulario de nueva op

$("#btnNewOperations").addEventListener("click", () => {
    cleanAside()
    cleanFrontPage()
    showNewOperationForm()
})


/*****************************************/

//ver tabla de categorias

$("#aCategory").addEventListener("click", ()=>{
    cleanCategoriesForm()
    cleanFrontPage()
    cleanDoneOperations()
    cleanAside()
})


localStorage.setItem('categories', JSON.stringify([
    {id: 1,
    nameCategory: "Comida",
    },
    
    {id: 2,
    nameCategory: "Servicios",
    },
    
    {id: 3,
    nameCategory: "Salidas",
    },
    
    {id: 4,
    nameCategory: "Educación",
    },
    
    {id: 5,
    nameCategory: "Transporte",
    },
    
    {id: 6,
    nameCategory: "Trabajo",
    },
]))


//AGREGAR CATEGORIAS A UN ARRAY DE OBJETOS EN LOCAL STORAGE

const categoriesInfo = () => {
    const nameCategory = $("#nameCategory").value
    const id = getDataInLocalStorage('categories').length + 1
    return {
        id,
        nameCategory
    }
}


const addCategoriesItems = () =>{

    $("#categoriesItems").innerHTML = ""

    getDataInLocalStorage('categories').map(item =>{

       const {id, nameCategory} = item

        $("#categoriesItems").innerHTML += ` <div class="flex flex-row">          
        <div class="flex w-[1300px] mt-8" >
            <span>${nameCategory}</span>
        </div>
    
        <div class="flex flex-row w-[200px] mt-8">
            
            <button class="ml-2" onclick="" >Editar</button>
            <button class="ml-2">Eliminar</button>
                
        </div>
    
     </div> `

    })


}



$("#addCategory").addEventListener("click", ()=>{
    let categories = getDataInLocalStorage('categories')
    categories.push(categoriesInfo())
    saveDataInLocalStorage('categories', categories)
    console.log(categories)
    addCategoriesItems(getDataInLocalStorage('categories'))
    $("#nameCategory").value = ""
    //agregar show y hidden
})






/*********************************************************/

// const balance = () =>{
//     operationsLocal.map(operationL => {
//         const { id, amount, type} = operationL
//         let result = 0
//         if(amount === "Gasto"){
//           result += amount
//           return $("#total").innerText = result
//         }else{
//         result = result - amount
//         return $("#total").innerText = result
//         }
        
//     })
  
// }


$("#navBalance").addEventListener("click", ()=>{
    if (localStorage.getItem('operations')){

    }
})







// date - fecha y hora

window.onload = ()=>{
    const inputDate = $("#date")
    let date = new Date ()
    let month =  date.getMonth() + 1
    let day = date.getDate(); //obteniendo dia
    let year = date.getFullYear(); 
    if(day<10){
    day='0'+day; }//agrega cero si el menor de 10
    if(month<10){
    month='0'+month} 
    inputDate.value = year + "-" + month + "-" + day
}


const balance = () =>{
getDataInLocalStorage(operations)
}
console.log($("#gastos").innerText = 6)


/***********************************************************/


if (!localStorage.getItem('operations')) {
    localStorage.setItem('operations', JSON.stringify([]))
    
}else{
    cleanFrontPage() 
    showDoneOperations()
    generateTableOperations()
}