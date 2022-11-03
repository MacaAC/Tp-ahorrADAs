const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

// AGREGAR OPERACIONES A UN ARRAY DE OBJETOS

if (!localStorage.getItem('operations')) {
    localStorage.setItem('operations', JSON.stringify([]))
}
// const operationsLocal = JSON.parse(localStorage.getItem('operations'))
// operationsLocal.push(operationsInfo())
// localStorage.setItem('operations', JSON.stringify(operationsLocal))
let operationsLocal = []
const operationsInfo = () => {
    const description = $("#description").value
    const amount = $("#amount").value
    const type = $("#type").value
    const selectedCategory = $("#selectCategory").value
    const date = $("#date").value
    const id = operationsLocal.length + 1
    return {
        id,
        description,
        amount,
        type,
        selectedCategory,
        date
    }
}



const generateTableOperations = (operations) => {
    $("#table").innerHTML = ""
    operations.map(operation => {
        const {id, description, selectedCategory, date, amount, type} = operation
        const className = type === 'Gasto' ? "red-500" : "green-500"
        const operator = type === 'Gasto' ? "-" : "+"

        $("#table").innerHTML += `
            
            <tr>
                <td class="pl-0 pr-10 mt-4 pt-0 text-lg font-bold">${description}</td>
                <td class="mt-0 pt-0 pl-10 text-xs ">${selectedCategory}</td>
                <td class="mt-0 pt-0 pl-10 text-sm">${date}</td>
                <td class="mt-0 pt-0 pl-12 text-lg text-${className} font-bold">${operator}${amount}</td>
                <td class="pl-8 mt-0 pt-0 text-xs"><button id="btnEditOperation" class="mr-4 btnEditOperation" data-id="${id}" onclick="operationEdit(${id})">Editar</button><button id="btnDeleteOperation" class="mr-4 btnDeleteOperation" data-id="${id}" onclick="deleteOperation(${id})">Eliminar</button></td>
            </tr>
             
        `
    })
}



/*-----------------------------------------------------------------------------------*/



//Añadir las operaciones a la tabla, tabla de operaciones ya realizadas, que aparezca la tabla

$("#addOperation").addEventListener("click", () => {
    operationsLocal = JSON.parse(localStorage.getItem('operations'))
    operationsLocal.push(operationsInfo())
    localStorage.setItem('operations', JSON.stringify(operationsLocal))
    console.log(operationsLocal)
    generateTableOperations(operationsLocal)
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
    return operationsLocal.find(operation => operation.id === id)
}


// Funcion editar operación (falta setearla), precarga los datos

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
//editar operacion

const saveOperationData = (id) => {
    return {
        id: id,
        description: $("#description").value,
        amount: $("#amount").value,
        type: $("#type").value,
        selectedCategory: $("#selectCategory").value,
        date: $("#date").value
    }
}


//remover operacion, delete

const removeOperation = (id) => {
    return operations.filter(operation => operation.id !== parseInt(id))
}


const deleteOperation = (id) => {

    generateTableOperations(removeOperation(id))

}




// const editProduct = (id) => {
//     return products.map(product => {
//         if (product.id === parseInt(id)) {
//             return saveProductData(id)
//         }
//         return product
//     })
// }


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
 const cleanEditOperationsForm = () => $("#editOperationsForm").classList.remove("hidden")
 const showEditOperationsForm = () => $("#editOperationsForm").classList.add("hidden")

// evento para hacer desaparecer la portada y aparece el formulario de nueva op

$("#btnNewOperations").addEventListener("click", () => {
    cleanAside()
    cleanFrontPage()
    showNewOperationForm()
})


/*****************************************/



// const balance = (a,b) =>{
//     operations.map(operation => {
//         const { id,amount, type} = operation
//     }



// )}
 

