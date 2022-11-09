const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

// AGREGAR OPERACIONES A UN ARRAY DE OBJETOS

if (!localStorage.getItem('operations')) {
    localStorage.setItem('operations', JSON.stringify([]))
    
}
// const operationsLocal = JSON.parse(localStorage.getItem('operations'))
// operationsLocal.push(operationsInfo())
// localStorage.setItem('operations', JSON.stringify(operationsLocal))

const getDataInLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key))
}

const saveDataInLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

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
    getDataInLocalStorage('operations').map(operationL => {
        const {id, description, selectedCategory, date, amount, type} = operationL
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
    return operations.find(operation => operation.id === id)
}


// Funcion editar operación, precarga los datos

const operationEdit = (id) => {
    cleanEditOperationsForm()
    cleanDoneOperations()
    cleanAside()
    const editedOperation = findOperation(id)
    $("#editDescription").value = editedOperation.description
    $("#editAmount").value = editedOperation.amount
    $("#editType").value = editedOperation.type
    $("#editSelectedCategory").value = editedOperation.selectedCategory
    $("#editDate").value =  editedOperation.date
    
    
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





// const newOperationData = (id) => {
    //     idOpEdited = $("#btnEditOperation").getAttribute("data-id")
    //     console.log(idOpEdited)
    //     return opEditada = {
        //         id: parseInt(idOpEdited),
        //         description: $("#editDescription").value,
        //         amount: $("#editAmount").value,
        //         type: $("#editType").value,
        //         selectedCategory: $("#editSelectedCategory").value,
//         date: $("#editDate").value
//     }
// }


/*------------------------------------------------------------------*/
// funcion que edita efectivamente la operacion

//no termiona de funcionar ALDY
const editOperation= (id) => {
    let operations = getDataInLocalStorage('operations') 
     operations.map(operation => {
        if (operation.id === id) {
            console.log("entro en el if")
            return newOperationData(id)
            
        }
        operation
    })
    saveDataInLocalStorage("operations",operations)
    return operations
}

const eventEditOperation = () => {
    showEditOperationsForm()
}

// const editedOperation= (id) => {
//    let op = getDataInLocalStorage('operations')
//    let arr = operationEdit(id)
//    op.filter(o => {
//     if (description.id !== arr){
//        return op
//     }
//    })

// }




/*---------------------------------------------------------*/

//saveDataInLocalStorage('operations', editedOperation(id))

// const edited = (id) =>{
//     return operationsLocal.map(operationL => {
//         if (opEditada.id === operationL.id){
//            o
//         }
//         return operationL
//     })
// }





// $btnEdit.addEventListener("click", () => {
//     const productId = $btnEdit.getAttribute("data-id")
//     $form.classList.add("d-none")
//     generateCards(editProduct(productId))
// })

// $("#edit").addEventListener("click", ()=>{
// //   const idOpEdited = $("#btnEditOperation").getAttribute("data-id")
// //   generateTableOperations(editedOperation(idOpEdited))

//     // console.log(idOpEdited)
    
//     // generateTableOperations(editedOperation(idOpEdited))
// })

$("#edit").addEventListener("click", ()=>{
 const newOperation = getDataInLocalStorage('operations')
//  newOperation.push(newOperationData())
 saveDataInLocalStorage('operations', newOperation)
 showEditOperationsForm()
 showDoneOperations()
 showAside()
 generateTableOperations()
})



//remover operacion, delete

const removeOperation = (id) => {
    let operations = getDataInLocalStorage('operations')
    operations = operations.filter(operation => operation.id !== id)
    saveDataInLocalStorage("operations",operations)
    return operations

}

//saveDataInLocalStorage('operations', operations)

const deleteOperation = (id) => { 
    return generateTableOperations(removeOperation(id))
}



//let categorys = ["Comida", "Servicios", "Salidas", "Educación", "Transporte", "Trabajo"]




// evento para que aparezca el form al presionar +nueva operación(maca)
// const cleanFrontPage =()=> $("#front-page").innerHTML = ""

// funciones de clean y show atributos

 const cleanAside = () => $("#aside").classList.add("hidden")
 const showAside = () => $("#aside").classList.remove("hidden")
 const cleanFrontPage = () => $("#frontPage").classList.add("hidden")
 const showNewOperationForm = () =>  $("#formNewOperation").classList.remove("hidden")
 const cleanNewOperationForm = () => $("#formNewOperation").classList.add("hidden")
 const showDoneOperations = () => $("#doneOperations").classList.remove("hidden")
 const cleanDoneOperations = () => $("#doneOperations").classList.add("hidden")
 const cleanEditOperationsForm = () => $("#editOperationsForm").classList.add("hidden")
 const showEditOperationsForm = () => $("#editOperationsForm").classList.remove("hidden")
 const cleanCategoriesForm = () => $("#categoriesForm").classList.remove("hidden")
 const showContainer = () => $("#container").classList.remove("hidden")


// evento para hacer desaparecer la portada y aparece el formulario de nueva op

$("#btnNewOperations").addEventListener("click", () => {
    cleanAside()
    cleanFrontPage()
    showNewOperationForm()
})


/*****************************************/



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
 




//ver tabla de categorias

$("#aCategory").addEventListener("click", ()=>{
    cleanCategoriesForm()
    cleanFrontPage()
    cleanDoneOperations()
    cleanAside()
})

//categorias

let categories = [
{id: 1,
category: "Comida",
},

{id: 2,
category: "Servicios",
},

{id: 3,
category: "Salidas",
},

{id: 4,
category: "Educación",
},

{id: 5,
category: "Transporte",
},

{id: 6,
category: "Trabajo",
},

]


const newCategory = () => {
 const id = categories.length + 1
 const category = $("#nameCategory").value
 return {
    id,
    category,
    
}
}


const addCategoriesItems = () =>{

    categories.map(item =>{

       const {id, category} = item

        $("#categoriesItems").innerHTML += ` <div class="flex flex-row">
                    
        <div class="flex w-[1300px] mt-8" >
            <span>${category}</span>
        </div>
    
        <div class="flex flex-row w-[200px] mt-8">
            
            <button class="ml-2">Editar</button>
            <button class="ml-2">Eliminar</button>
                
        </div>
    
     </div> `

    })


}





$("#addCategory").addEventListener("click", ()=>{
    categories.push(newCategory())
    console.log(categories)
    addCategoriesItems()
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